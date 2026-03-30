import { z } from "zod";

import { LOCALES } from "@/lib/constants";

export const SLUG_PATTERN = /^[23456789abcdefghjkmnpqrstuvwxyz]{4}-[23456789abcdefghjkmnpqrstuvwxyz]{6}$/;
export const TOKEN_PATTERN = /^[A-Za-z0-9_-]{16,64}$/;

const requiredString = (maxLength: number) =>
  z
    .string()
    .trim()
    .min(1)
    .max(maxLength);

const normalizedName = (maxLength: number) =>
  requiredString(maxLength).refine(
    (value) => !/\s{2,}/.test(value),
    "Use single spaces only.",
  );

const localeSchema = z.enum(LOCALES);
const slugSchema = z.string().trim().regex(SLUG_PATTERN, "Invalid group slug.");
const memberIdSchema = z.string().trim().min(1).max(64);

function isValidDateString(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

export const createGroupSchema = z.object({
  locale: localeSchema,
  name: normalizedName(80),
  initialMembers: z
    .string()
    .max(1000)
    .default("")
    .refine((input) => memberLinesToNames(input).length <= 20, "Too many members.")
    .refine(
      (input) => memberLinesToNames(input).every((name) => name.length <= 50),
      "Member names are too long.",
    ),
});

export const addMemberSchema = z.object({
  locale: localeSchema,
  slug: slugSchema,
  name: normalizedName(50),
});

const expenseBaseSchema = z.object({
  locale: localeSchema,
  slug: slugSchema,
  title: normalizedName(100),
  notes: z.string().trim().max(400).optional().or(z.literal("")),
  amount: z
    .string()
    .trim()
    .regex(/^\d{1,9}$/, "Amount must be digits only."),
  paidByMemberId: memberIdSchema,
  happenedOn: z.string().refine(isValidDateString, "Invalid date."),
  participantIds: z
    .array(memberIdSchema)
    .min(1)
    .max(20)
    .refine((ids) => new Set(ids).size === ids.length, "Duplicate participants are not allowed."),
});

export const createExpenseSchema = expenseBaseSchema;

export const updateExpenseSchema = expenseBaseSchema.extend({
  expenseId: memberIdSchema,
});

export const deleteExpenseSchema = z.object({
  locale: localeSchema,
  slug: slugSchema,
  expenseId: memberIdSchema,
});

export const unlockAccessSchema = z.object({
  locale: localeSchema,
  slug: slugSchema,
  token: z.string().trim().regex(TOKEN_PATTERN, "Invalid write token."),
});

export function memberLinesToNames(input: string) {
  return Array.from(
    new Set(
      input
    .split(/\r?\n/)
        .map((entry) => entry.trim().replace(/\s+/g, " "))
        .filter(Boolean),
    ),
  ).slice(0, 20);
}
