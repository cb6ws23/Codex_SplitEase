"use client";

import { Clock3, FolderOpen, X } from "lucide-react";
import { useEffect, useState } from "react";

import { Link } from "@/i18n/navigation";
import {
  readRecentGroups,
  removeRecentGroup,
  subscribeRecentGroups,
  type RecentGroupRecord,
} from "@/lib/recent-groups";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type Props = {
  title: string;
  description: string;
  empty: string;
  openLabel: string;
  removeLabel: string;
  removeHint: string;
};

export function RecentGroupsSection({
  title,
  description,
  empty,
  openLabel,
  removeLabel,
  removeHint,
}: Props) {
  const [groups, setGroups] = useState<RecentGroupRecord[]>(() => readRecentGroups());

  useEffect(() => {
    return subscribeRecentGroups(() => {
      setGroups(readRecentGroups());
    });
  }, []);

  return (
    <Card className="overflow-hidden border-[var(--border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(255,250,243,0.98))] shadow-[0_18px_50px_rgba(15,23,42,0.05)]">
      <CardHeader className="gap-2 border-b border-[var(--border)]/70 bg-white/70">
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription className="max-w-2xl">{description}</CardDescription>
      </CardHeader>
      <CardContent className="p-4 sm:p-5">
        {groups.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-[var(--border)] bg-white px-4 py-6 text-sm leading-6 text-[var(--muted-foreground)]">
            {empty}
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {groups.map((group) => (
              <div
                key={group.slug}
                className="rounded-3xl border border-[var(--border)] bg-white px-4 py-4 transition-all hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(15,23,42,0.06)]"
              >
                <div className="flex items-start justify-between gap-3">
                  <Link
                    href={`/g/${group.slug}`}
                    locale={group.locale}
                    className="min-w-0 flex-1 rounded-2xl outline-none transition-colors hover:text-[var(--foreground)] focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
                  >
                    <p className="truncate text-sm font-semibold text-[var(--foreground)] sm:text-base">
                      {group.name}
                    </p>
                    <p className="mt-1 flex items-center gap-2 text-xs text-[var(--muted-foreground)]">
                      <Clock3 className="h-3.5 w-3.5" />
                      <span>{new Date(group.visitedAt).toLocaleString(group.locale)}</span>
                    </p>
                  </Link>
                  <button
                    aria-label={`${removeLabel}: ${group.name}`}
                    className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[var(--border)] bg-white text-[var(--muted-foreground)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
                    onClick={() => removeRecentGroup(group.slug)}
                    title={removeHint}
                    type="button"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="mt-3 flex items-center justify-between gap-3">
                  <span className="text-xs leading-5 text-[var(--muted-foreground)]">
                    {removeHint}
                  </span>
                  <Link
                    href={`/g/${group.slug}`}
                    locale={group.locale}
                    className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[var(--muted)] px-2.5 py-1 text-xs font-medium text-[var(--muted-foreground)]"
                  >
                    <FolderOpen className="h-3.5 w-3.5" />
                    {openLabel}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
