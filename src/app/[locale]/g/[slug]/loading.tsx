export default function GroupLoading() {
  return (
    <main className="min-h-screen bg-[var(--page-background)] px-4 py-5">
      <div className="mx-auto flex max-w-5xl flex-col gap-4">
        <div className="h-10 w-40 animate-pulse rounded-full bg-white/70" />
        <div className="h-56 animate-pulse rounded-[32px] border border-[var(--border)] bg-white/70" />
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="h-48 animate-pulse rounded-[28px] border border-[var(--border)] bg-white/70" />
          <div className="h-48 animate-pulse rounded-[28px] border border-[var(--border)] bg-white/70" />
        </div>
        <div className="h-72 animate-pulse rounded-[28px] border border-[var(--border)] bg-white/70" />
      </div>
    </main>
  );
}
