import type { Metadata } from "next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { HtmlLangSetter } from "@/components/html-lang-setter";
import { NavBar } from "@/components/nav-bar";
import { SiteFooter } from "@/components/site-footer";
import { type AppLocale, getLocalizedAppName } from "@/lib/constants";
import { routing } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    return {};
  }

  setRequestLocale(locale);
  const home = await getTranslations({ locale, namespace: "Home" });
  const appName = getLocalizedAppName(locale as AppLocale);

  return {
    title: {
      default: appName,
      template: `%s | ${appName}`,
    },
    description: home("description"),
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();
  const appName = getLocalizedAppName(locale as AppLocale);

  return (
    <NextIntlClientProvider messages={messages}>
      <HtmlLangSetter locale={locale} />
      <NavBar appName={appName} />
      {children}
      <SiteFooter />
    </NextIntlClientProvider>
  );
}
