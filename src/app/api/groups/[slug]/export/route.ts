import { NextResponse } from "next/server";

import { buildCsvExport } from "@/lib/groups";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const csv = await buildCsvExport(slug);

  if (!csv) {
    return new NextResponse("Not found", { status: 404 });
  }

  const BOM = "\uFEFF";

  return new NextResponse(BOM + csv, {
    status: 200,
    headers: {
      "Cache-Control": "no-store",
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${slug}.csv"`,
      "X-Content-Type-Options": "nosniff",
    },
  });
}
