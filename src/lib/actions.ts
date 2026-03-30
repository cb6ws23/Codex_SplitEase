"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  generateWriteToken,
  getWriteAccessToken,
  hashWriteToken,
  normalizeWriteTokenInput,
  setWriteAccessCookie,
  writeTokenMatches,
} from "@/lib/auth";
import { createUniqueGroupSlug, getGroupBySlug, prismaDecimal } from "@/lib/groups";
import { parseYenInput } from "@/lib/money";
import { prisma } from "@/lib/prisma";
import {
  addMemberSchema,
  createExpenseSchema,
  createGroupSchema,
  deleteExpenseSchema,
  memberLinesToNames,
  unlockAccessSchema,
  updateExpenseSchema,
} from "@/lib/validation";

function failureRedirect(locale: string, path: string, code = "error"): never {
  redirect(`/${locale}${path}?status=${code}`);
}

function getLocaleValue(formData: FormData) {
  const locale = formData.get("locale");
  return typeof locale === "string" && locale.length > 0 ? locale : "en";
}

function getStringValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function normalizeWhitespace(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

async function requireAuthorizedGroup(slug: string) {
  const group = await prisma.group.findUnique({
    where: { slug },
    include: {
      members: {
        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
      },
    },
  });

  if (!group) {
    throw new Error("Group not found.");
  }

  const token = await getWriteAccessToken(slug);

  if (!token || !writeTokenMatches(token, group.writeTokenHash)) {
    throw new Error("Unauthorized");
  }

  return group;
}

function memberIdsBelongToGroup(groupMemberIds: string[], selected: string[]) {
  const memberIdSet = new Set(groupMemberIds);
  return selected.every((memberId) => memberIdSet.has(memberId));
}

export async function createGroupAction(formData: FormData) {
  const locale = getLocaleValue(formData);
  const parsed = createGroupSchema.safeParse({
    locale: formData.get("locale"),
    name: formData.get("name"),
    initialMembers: formData.get("initialMembers"),
  });

  if (!parsed.success) {
    failureRedirect(locale, "/groups/new", "invalidGroup");
  }

  const { name, initialMembers } = parsed.data;
  const slug = await createUniqueGroupSlug();
  const writeToken = generateWriteToken();
  const writeTokenHash = hashWriteToken(writeToken);
  const members = memberLinesToNames(initialMembers);

  try {
    await prisma.group.create({
      data: {
        slug,
        name: normalizeWhitespace(name),
        writeTokenHash,
        members: {
          create: members.map((memberName, index) => ({
            name: memberName,
            sortOrder: index,
          })),
        },
      },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      failureRedirect(locale, "/groups/new", "error");
    }

    failureRedirect(locale, "/groups/new", "error");
  }

  await setWriteAccessCookie(slug, writeToken);
  redirect(`/${locale}/g/${slug}?status=saved`);
}

export async function addMemberAction(formData: FormData) {
  const locale = getLocaleValue(formData);
  const slug = getStringValue(formData, "slug");
  const parsed = addMemberSchema.safeParse({
    locale: formData.get("locale"),
    slug: formData.get("slug"),
    name: formData.get("name"),
  });

  if (!parsed.success) {
    failureRedirect(locale, `/g/${slug}`, "invalidMember");
  }

  const { name } = parsed.data;

  try {
    const group = await requireAuthorizedGroup(slug);

    await prisma.member.create({
      data: {
        groupId: group.id,
        name: normalizeWhitespace(name),
        sortOrder: group.members.length,
      },
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      failureRedirect(locale, `/g/${slug}`, "invalidAccess");
    }

    failureRedirect(locale, `/g/${slug}`, "error");
  }

  revalidatePath(`/${locale}/g/${slug}`);
  revalidatePath(`/${locale}/g/${slug}/settlement`);
  redirect(`/${locale}/g/${slug}?status=saved`);
}

export async function createExpenseAction(formData: FormData) {
  const locale = getLocaleValue(formData);
  const slug = getStringValue(formData, "slug");
  const parsed = createExpenseSchema.safeParse({
    locale: formData.get("locale"),
    slug: formData.get("slug"),
    title: formData.get("title"),
    notes: formData.get("notes"),
    amount: formData.get("amount"),
    paidByMemberId: formData.get("paidByMemberId"),
    happenedOn: formData.get("happenedOn"),
    participantIds: formData.getAll("participantIds"),
  });

  if (!parsed.success) {
    failureRedirect(locale, `/g/${slug}/expenses/new`, "invalidExpense");
  }

  const { ...values } = parsed.data;

  try {
    const group = await requireAuthorizedGroup(slug);
    const memberIds = group.members.map((member) => member.id);

    if (
      !memberIdsBelongToGroup(memberIds, [
        values.paidByMemberId,
        ...values.participantIds,
      ])
    ) {
      throw new Error("Invalid member selection");
    }

    const amount = parseYenInput(values.amount);

    await prisma.expense.create({
      data: {
        groupId: group.id,
        title: normalizeWhitespace(values.title),
        notes: values.notes || null,
        amount: prismaDecimal(amount),
        paidByMemberId: values.paidByMemberId,
        happenedOn: new Date(`${values.happenedOn}T00:00:00.000Z`),
        participants: {
          create: values.participantIds.map((memberId) => ({
            memberId,
          })),
        },
      },
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      failureRedirect(locale, `/g/${slug}`, "invalidAccess");
    }

    if (error instanceof Error && error.message.includes("Amount must")) {
      failureRedirect(locale, `/g/${slug}/expenses/new`, "invalidAmount");
    }

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2003"
    ) {
      failureRedirect(locale, `/g/${slug}/expenses/new`, "invalidExpense");
    }

    failureRedirect(locale, `/g/${slug}/expenses/new`, "error");
  }

  revalidatePath(`/${locale}/g/${slug}`);
  revalidatePath(`/${locale}/g/${slug}/settlement`);
  redirect(`/${locale}/g/${slug}?status=saved`);
}

export async function updateExpenseAction(formData: FormData) {
  const locale = getLocaleValue(formData);
  const slug = getStringValue(formData, "slug");
  const expenseId = getStringValue(formData, "expenseId");
  const parsed = updateExpenseSchema.safeParse({
    locale: formData.get("locale"),
    slug: formData.get("slug"),
    expenseId: formData.get("expenseId"),
    title: formData.get("title"),
    notes: formData.get("notes"),
    amount: formData.get("amount"),
    paidByMemberId: formData.get("paidByMemberId"),
    happenedOn: formData.get("happenedOn"),
    participantIds: formData.getAll("participantIds"),
  });

  if (!parsed.success) {
    failureRedirect(locale, `/g/${slug}/expenses/${expenseId}/edit`, "invalidExpense");
  }

  const { ...values } = parsed.data;

  try {
    const group = await requireAuthorizedGroup(slug);
    const memberIds = group.members.map((member) => member.id);

    if (
      !memberIdsBelongToGroup(memberIds, [
        values.paidByMemberId,
        ...values.participantIds,
      ])
    ) {
      throw new Error("Invalid member selection");
    }

    const amount = parseYenInput(values.amount);

    const existingExpense = await prisma.expense.findFirst({
      where: {
        id: expenseId,
        groupId: group.id,
      },
      select: {
        id: true,
      },
    });

    if (!existingExpense) {
      throw new Error("Expense not found");
    }

    await prisma.$transaction(async (tx) => {
      await tx.expenseParticipant.deleteMany({
        where: {
          expenseId,
        },
      });

      await tx.expense.update({
        where: {
          id: expenseId,
        },
        data: {
          title: normalizeWhitespace(values.title),
          notes: values.notes || null,
          amount: prismaDecimal(amount),
          paidByMemberId: values.paidByMemberId,
          happenedOn: new Date(`${values.happenedOn}T00:00:00.000Z`),
          participants: {
            create: values.participantIds.map((memberId) => ({
              memberId,
            })),
          },
        },
      });
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      failureRedirect(locale, `/g/${slug}`, "invalidAccess");
    }

    if (error instanceof Error && error.message === "Expense not found") {
      failureRedirect(locale, `/g/${slug}`, "error");
    }

    if (error instanceof Error && error.message.includes("Amount must")) {
      failureRedirect(locale, `/g/${slug}/expenses/${expenseId}/edit`, "invalidAmount");
    }

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      failureRedirect(locale, `/g/${slug}`, "error");
    }

    failureRedirect(locale, `/g/${slug}/expenses/${expenseId}/edit`, "error");
  }

  revalidatePath(`/${locale}/g/${slug}`);
  revalidatePath(`/${locale}/g/${slug}/settlement`);
  redirect(`/${locale}/g/${slug}?status=saved`);
}

export async function deleteExpenseAction(formData: FormData) {
  const locale = getLocaleValue(formData);
  const slug = getStringValue(formData, "slug");
  const parsed = deleteExpenseSchema.safeParse({
    locale: formData.get("locale"),
    slug: formData.get("slug"),
    expenseId: formData.get("expenseId"),
  });

  if (!parsed.success) {
    failureRedirect(locale, `/g/${slug}`, "error");
  }

  const { expenseId } = parsed.data;

  try {
    const group = await requireAuthorizedGroup(slug);

    const deleted = await prisma.expense.deleteMany({
      where: {
        id: expenseId,
        groupId: group.id,
      },
    });

    if (deleted.count === 0) {
      throw new Error("Expense not found");
    }
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      failureRedirect(locale, `/g/${slug}`, "invalidAccess");
    }

    if (error instanceof Error && error.message === "Expense not found") {
      failureRedirect(locale, `/g/${slug}`, "error");
    }

    failureRedirect(locale, `/g/${slug}`, "error");
  }

  revalidatePath(`/${locale}/g/${slug}`);
  revalidatePath(`/${locale}/g/${slug}/settlement`);
  redirect(`/${locale}/g/${slug}?status=deleted`);
}

export async function verifyAccessOrNull(slug: string) {
  const group = await getGroupBySlug(slug);

  if (!group) {
    return null;
  }

  const token = await getWriteAccessToken(slug);

  if (!token || !writeTokenMatches(token, group.writeTokenHash)) {
    return null;
  }

  return token;
}

export async function validateUnlockRequest(input: {
  locale: string | null;
  slug: string;
  token: string | null;
}) {
  const normalizedToken = normalizeWriteTokenInput(input.token);

  return unlockAccessSchema.safeParse({
    locale: input.locale,
    slug: input.slug,
    token: normalizedToken,
  });
}
