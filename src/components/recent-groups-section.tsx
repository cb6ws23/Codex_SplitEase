"use client";

import { Clock3, FolderOpen } from "lucide-react";
import { useSyncExternalStore } from "react";

import { Link } from "@/i18n/navigation";
import { readRecentGroups, type RecentGroupRecord } from "@/lib/recent-groups";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type Props = {
  title: string;
  description: string;
  empty: string;
  openLabel: string;
};

export function RecentGroupsSection({
  title,
  description,
  empty,
  openLabel,
}: Props) {
  const groups = useSyncExternalStore(
    () => () => {},
    () => readRecentGroups(),
    () => [] as RecentGroupRecord[],
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {groups.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[var(--border)] px-4 py-5 text-sm text-[var(--muted-foreground)]">
            {empty}
          </div>
        ) : (
          <div className="space-y-3">
            {groups.map((group) => (
              <Link
                key={group.slug}
                href={`/g/${group.slug}`}
                locale={group.locale}
                className="block rounded-2xl border border-[var(--border)] bg-white px-4 py-4 transition-colors hover:bg-[var(--muted)]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-[var(--foreground)]">
                      {group.name}
                    </p>
                    <p className="mt-1 flex items-center gap-2 text-xs text-[var(--muted-foreground)]">
                      <Clock3 className="h-3.5 w-3.5" />
                      <span>{new Date(group.visitedAt).toLocaleString(group.locale)}</span>
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-2 text-xs font-medium text-[var(--muted-foreground)]">
                    <FolderOpen className="h-3.5 w-3.5" />
                    {openLabel}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
