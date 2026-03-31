import { NextResponse } from "next/server";

import { DEFAULT_LOCALE, LOCALES } from "@/lib/constants";

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
  return NextResponse.redirect(new URL(`/${locale}/g/${slug}`, request.url));
}
