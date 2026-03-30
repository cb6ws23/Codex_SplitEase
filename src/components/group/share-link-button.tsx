"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";

type Props = {
  url: string;
  copyLabel: string;
  copiedLabel: string;
};

export function ShareLinkButton({ url, copyLabel, copiedLabel }: Props) {
  const [copied, setCopied] = useState(false);

  async function onCopy() {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  }

  return (
    <Button className="w-full sm:w-auto" onClick={onCopy}>
      {copied ? copiedLabel : copyLabel}
    </Button>
  );
}
