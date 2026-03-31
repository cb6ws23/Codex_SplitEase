export default function GroupLoading() {
  return (
    <main className="min-h-screen bg-[var(--bg-page)] px-4 py-5">
      <div className="mx-auto flex max-w-5xl flex-col gap-4">
        <div className="h-10 w-40 animate-pulse rounded-lg bg-[var(--bg-card-hover)]" />
        <div className="h-56 animate-pulse rounded-xl border border-[var(--border-default)] bg-[var(--bg-card)]" />
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="h-48 animate-pulse rounded-xl border border-[var(--border-default)] bg-[var(--bg-card)]" />
          <div className="h-48 animate-pulse rounded-xl border border-[var(--border-default)] bg-[var(--bg-card)]" />
        </div>
        <div className="h-72 animate-pulse rounded-xl border border-[var(--border-default)] bg-[var(--bg-card)]" />
      </div>
    </main>
  );
}
