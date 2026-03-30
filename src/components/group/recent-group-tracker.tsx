"use client";

import { useEffect } from "react";

import { upsertRecentGroup } from "@/lib/recent-groups";

type Props = {
  locale: string;
  name: string;
  slug: string;
};

export function RecentGroupTracker({ locale, name, slug }: Props) {
  useEffect(() => {
    upsertRecentGroup({ locale, name, slug });
  }, [locale, name, slug]);

  return null;
}
