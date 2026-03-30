import { NextResponse } from "next/server";

import { validateUnlockRequest } from "@/lib/actions";
import { DEFAULT_LOCALE, LOCALES } from "@/lib/constants";
import { getWriteAccessCookieName, writeTokenMatches } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const url = new URL(request.url);
  const localeParam = url.searchParams.get("locale");
  const locale = LOCALES.includes(localeParam as (typeof LOCALES)[number])
    ? localeParam
    : DEFAULT_LOCALE;
  const destination = new URL(`/${locale}/g/${slug}`, request.url);
  const parsed = await validateUnlockRequest({
    locale,
    slug,
    token: url.searchParams.get("token"),
  });

  if (!parsed.success) {
    destination.searchParams.set("status", "invalidAccess");
    return NextResponse.redirect(destination);
  }

  const { token } = parsed.data;

  const group = await prisma.group.findUnique({
    where: { slug },
    select: { writeTokenHash: true },
  });

  if (!group || !writeTokenMatches(token, group.writeTokenHash)) {
    destination.searchParams.set("status", "invalidAccess");
    return NextResponse.redirect(destination);
  }

  const response = NextResponse.redirect(destination);
  response.cookies.set(getWriteAccessCookieName(slug), token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
  return response;
}
