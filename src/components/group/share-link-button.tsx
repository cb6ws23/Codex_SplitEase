"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";

type Props = {
  url: string;
  copyLabel: string;
  copiedLabel: string;
  /** When true, render the URL text + icon-only copy button inside a combined box. */
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
    window.setTimeout(() => setCopied(false), 2000);
  }

  if (inline) {
    return (
      <div className="share-url-box">
        <span className="share-url-text">{url}</span>
        <button
          aria-label={copied ? copiedLabel : copyLabel}
          onClick={onCopy}
          type="button"
          style={{
            width: 36,
            height: 36,
            flexShrink: 0,
            borderRadius: 8,
            border: "1px solid rgba(10, 37, 64, 0.1)",
            background: "var(--surface)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "background-color 150ms",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "var(--surface-muted)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "var(--surface)";
          }}
        >
          {copied ? (
            <Check size={16} color="var(--success)" />
          ) : (
            <Copy size={16} color="var(--text-soft)" />
          )}
        </button>
      </div>
    );
  }

  return (
    <Button className="w-full sm:w-auto" onClick={onCopy}>
      {copied ? copiedLabel : copyLabel}
    </Button>
  );
}
