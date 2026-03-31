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
    <div className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-card)] p-5 sm:p-6">
      <h2 className="text-lg font-semibold text-[var(--text-primary)]">{title}</h2>
      <p className="mt-1 text-sm leading-6 text-[var(--text-secondary)]">{description}</p>
      <div className="mt-4">
        {groups.length === 0 ? (
          <div className="rounded-lg border border-dashed border-[var(--border-default)] bg-[var(--bg-page)] px-4 py-6 text-sm leading-6 text-[var(--text-secondary)]">
            {empty}
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {groups.map((group) => (
              <div
                key={group.slug}
                className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-page)] px-4 py-4 transition-colors hover:bg-[var(--bg-card-hover)]"
              >
                <div className="flex items-start justify-between gap-3">
                  <Link
                    href={`/g/${group.slug}`}
                    locale={group.locale}
                    className="min-w-0 flex-1 rounded-lg outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[var(--border-brand)]"
                  >
                    <p className="truncate text-sm font-semibold text-[var(--text-primary)] sm:text-base">
                      {group.name}
                    </p>
                    <p className="mt-1 flex items-center gap-2 text-xs text-[var(--text-muted)]">
                      <Clock3 className="h-3.5 w-3.5" />
                      <span>{new Date(group.visitedAt).toLocaleString(group.locale)}</span>
                    </p>
                  </Link>
                  <button
                    aria-label={`${removeLabel}: ${group.name}`}
                    className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[var(--border-default)] bg-[var(--bg-page)] text-[var(--text-muted)] transition-colors hover:bg-[var(--bg-card-hover)] hover:text-[var(--text-primary)]"
                    onClick={() => removeRecentGroup(group.slug)}
                    title={removeHint}
                    type="button"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="mt-3 flex items-center justify-between gap-3">
                  <span className="text-xs leading-5 text-[var(--text-muted)]">
                    {removeHint}
                  </span>
                  <Link
                    href={`/g/${group.slug}`}
                    locale={group.locale}
                    className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-[var(--bg-card-hover)] px-2.5 py-1 text-xs font-medium text-[var(--text-secondary)]"
                  >
                    <FolderOpen className="h-3.5 w-3.5" />
                    {openLabel}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
