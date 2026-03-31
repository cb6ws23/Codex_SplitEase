import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Splita",
  description: "Anonymous-first group expense sharing in English, Japanese, and Chinese.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
