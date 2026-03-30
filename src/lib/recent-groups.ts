export const RECENT_GROUPS_STORAGE_KEY = "splitease-recent-groups";
const MAX_RECENT_GROUPS = 6;

export type RecentGroupRecord = {
  name: string;
  slug: string;
  locale: string;
  visitedAt: string;
};

function isRecentGroupRecord(value: unknown): value is RecentGroupRecord {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  return (
    typeof candidate.name === "string" &&
    typeof candidate.slug === "string" &&
    typeof candidate.locale === "string" &&
    typeof candidate.visitedAt === "string"
  );
}

export function readRecentGroups() {
  if (typeof window === "undefined") {
    return [] as RecentGroupRecord[];
  }

  try {
    const raw = window.localStorage.getItem(RECENT_GROUPS_STORAGE_KEY);

    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(isRecentGroupRecord).slice(0, MAX_RECENT_GROUPS);
  } catch {
    return [];
  }
}

export function writeRecentGroups(groups: RecentGroupRecord[]) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(
    RECENT_GROUPS_STORAGE_KEY,
    JSON.stringify(groups.slice(0, MAX_RECENT_GROUPS)),
  );
}

export function upsertRecentGroup(group: Omit<RecentGroupRecord, "visitedAt">) {
  const currentGroups = readRecentGroups();
  const nextGroup: RecentGroupRecord = {
    ...group,
    visitedAt: new Date().toISOString(),
  };

  const deduped = currentGroups.filter((entry) => entry.slug !== group.slug);
  writeRecentGroups([nextGroup, ...deduped]);
}
