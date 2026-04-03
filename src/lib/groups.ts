import { Prisma } from "@prisma/client";
import Decimal from "decimal.js";
import { randomBytes } from "node:crypto";

import { coerceSupportedCurrency } from "@/lib/constants";
import { formatMoneyForExport } from "@/lib/money";
import { prisma } from "@/lib/prisma";
import { allocateEqualShares } from "@/lib/money";
import { buildSettlementRecommendations } from "@/lib/settlement";

const SLUG_ALPHABET = "23456789abcdefghjkmnpqrstuvwxyz";

function randomSlugSegment(length: number) {
  const bytes = randomBytes(length);

  return Array.from(bytes, (byte) => SLUG_ALPHABET[byte % SLUG_ALPHABET.length]).join("");
}

export async function createUniqueGroupSlug() {
  for (let attempt = 0; attempt < 12; attempt += 1) {
    const slug = `${randomSlugSegment(4)}-${randomSlugSegment(6)}`;
    const existing = await prisma.group.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (!existing) {
      return slug;
    }
  }

  throw new Error("Unable to generate a unique group slug.");
}

export async function getGroupBySlug(slug: string) {
  return prisma.group.findUnique({
    where: { slug },
    include: {
      members: {
        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
      },
      expenses: {
        orderBy: [{ happenedOn: "desc" }, { createdAt: "desc" }],
        include: {
          paidByMember: true,
          participants: {
            include: {
              member: true,
            },
            orderBy: {
              member: {
                sortOrder: "asc",
              },
            },
          },
        },
      },
    },
  });
}

export function computeGroupSummary(
  group: NonNullable<Awaited<ReturnType<typeof getGroupBySlug>>>,
) {
  const balanceMap = new Map(
    group.members.map((member) => [member.id, new Decimal(0)]),
  );

  const expenseSummaries = group.expenses.map((expense) => {
    const amount = new Decimal(expense.amount.toString());
    const participantIds = Array.from(
      new Set(
        expense.participants
          .map((entry) => entry.memberId)
          .filter((memberId) => balanceMap.has(memberId)),
      ),
    );

    if (!balanceMap.has(expense.paidByMemberId)) {
      throw new Error(`Expense ${expense.id} has an invalid payer.`);
    }

    const shares = allocateEqualShares(amount, participantIds);

    balanceMap.set(
      expense.paidByMemberId,
      balanceMap.get(expense.paidByMemberId)!.plus(amount),
    );

    for (const share of shares) {
      balanceMap.set(
        share.memberId,
        balanceMap.get(share.memberId)!.minus(share.share),
      );
    }

    return {
      ...expense,
      amountDecimal: amount,
      shares,
    };
  });

  const balances = group.members.map((member) => ({
    memberId: member.id,
    memberName: member.name,
    balance: balanceMap.get(member.id) ?? new Decimal(0),
  }));

  const totalNet = balances.reduce((sum, entry) => sum.plus(entry.balance), new Decimal(0));

  if (!totalNet.isZero()) {
    throw new Error("Group balances must net to zero.");
  }

  const settlements = buildSettlementRecommendations(balances);

  return {
    expenseSummaries,
    balances,
    settlements,
    totalExpenseAmount: expenseSummaries.reduce(
      (sum, expense) => sum.plus(expense.amountDecimal),
      new Decimal(0),
    ),
  };
}

export async function buildCsvExport(slug: string) {
  const group = await getGroupBySlug(slug);

  if (!group) {
    return null;
  }

  let summary;

  try {
    summary = computeGroupSummary(group);
  } catch {
    return null;
  }
  const currency = coerceSupportedCurrency(group.currency);
  const cols = 6;
  const pad = (row: string[]) => {
    while (row.length < cols) row.push("");
    return row;
  };

  const rows: string[][] = [
    pad(["group_name", group.name]),
    pad(["currency_code", currency]),
    pad([]),
    ["date", "title", "amount", "paid_by", "participants", "notes"],
    ...summary.expenseSummaries.map((expense) => [
      expense.happenedOn.toISOString().slice(0, 10),
      expense.title,
      formatMoneyForExport(currency, expense.amountDecimal),
      expense.paidByMember.name,
      expense.participants.map((participant) => participant.member.name).join(" | "),
      expense.notes ?? "",
    ]),
    pad([]),
    pad(["balances", "member", "net_amount"]),
    ...summary.balances.map((balance) =>
      pad(["", balance.memberName, formatMoneyForExport(currency, balance.balance)]),
    ),
    pad([]),
    pad(["settlements", "from", "to", "amount"]),
    ...summary.settlements.map((settlement) =>
      pad([
        "",
        settlement.fromMemberName,
        settlement.toMemberName,
        formatMoneyForExport(currency, settlement.amount),
      ]),
    ),
  ];

  return rows
    .map((row) =>
      row
        .map((cell = "") => `"${cell.replaceAll('"', '""')}"`)
        .join(","),
    )
    .join("\n");
}

export function prismaDecimal(value: Decimal) {
  return new Prisma.Decimal(value.toFixed(0));
}
