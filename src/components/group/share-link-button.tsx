"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";

type Props = {
  url: string;
  copyLabel: string;
  copiedLabel: string;
  /** When true, render the URL text + copy button inside a combined box. */
  inline?: boolean;
};

export function ShareLinkButton({
  url,
  copyLabel,
  copiedLabel,
  inline,
}: Props) {
  const [copied, setCopied] = useState(false);

  async function onCopy() {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  }

  if (inline) {
    return (
      <div className="share-url-box">
        <span className="share-url-text">{url}</span>
        <Button
          onClick={onCopy}
          size="sm"
          variant="outline"
        >
          {copied ? copiedLabel : copyLabel}
        </Button>
      </div>
    );
  }

  return (
    <Button className="w-full sm:w-auto" onClick={onCopy}>
      {copied ? copiedLabel : copyLabel}
    </Button>
  );
}
