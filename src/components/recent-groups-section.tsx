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
    <div className="app-card p-5 sm:p-6">
      <div className="stack-sm">
        <h2 className="section-title !mb-0 text-[22px]">{title}</h2>
        <p className="max-w-[34rem] text-sm leading-6 text-[var(--text-soft)]">{description}</p>
      </div>
      <div className="mt-4">
        {groups.length === 0 ? (
          <div className="recent-card border-dashed bg-[var(--surface-soft)] text-sm leading-6 text-[var(--text-soft)] shadow-none">
            {empty}
          </div>
        ) : (
          <div className="recent-grid sm:grid-cols-2">
            {groups.map((group) => (
              <div
                key={group.slug}
                className="recent-card transition-colors hover:bg-[var(--surface-soft)]"
              >
                <div className="flex items-start justify-between gap-3">
                  <Link
                    href={`/g/${group.slug}`}
                    locale={group.locale}
                    className="min-w-0 flex-1 rounded-lg outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[var(--border-brand)]"
                  >
                    <p className="truncate text-sm font-semibold tracking-[-0.02em] text-[var(--text)] sm:text-base">
                      {group.name}
                    </p>
                    <p className="recent-meta mt-1.5 flex items-center gap-2">
                      <Clock3 className="h-3.5 w-3.5" />
                      <span>{new Date(group.visitedAt).toLocaleString(group.locale)}</span>
                    </p>
                  </Link>
                  <button
                    aria-label={`${removeLabel}: ${group.name}`}
                    className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-[var(--radius-xs)] border border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)] transition-colors hover:bg-[var(--surface-muted)] hover:text-[var(--text)]"
                    onClick={() => removeRecentGroup(group.slug)}
                    title={removeHint}
                    type="button"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="mt-4 flex items-center justify-between gap-3">
                  <span className="text-xs leading-5 text-[var(--text-muted)]">
                    {removeHint}
                  </span>
                  <Link
                    href={`/g/${group.slug}`}
                    locale={group.locale}
                    className="inline-flex shrink-0 items-center gap-2 rounded-[var(--radius-xs)] bg-[var(--surface-muted)] px-3 py-1.5 text-xs font-medium text-[var(--text-soft)]"
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
