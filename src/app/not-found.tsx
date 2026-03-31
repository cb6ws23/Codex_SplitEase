import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--bg-page)] px-4 py-10">
      <div className="w-full max-w-md rounded-xl border border-[var(--border-default)] bg-[var(--bg-card)] p-6 text-center">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-[var(--text-muted)]">
          404
        </p>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-[var(--text-primary)]">
          Group or page not found
        </h1>
        <p className="mt-3 text-sm leading-6 text-[var(--text-secondary)]">
          Check the link and try again. If you expected this group to exist, ask
          the person who shared it to confirm the slug.
        </p>
        <Link
          href="/"
          className="mt-5 inline-flex h-11 items-center justify-center rounded-lg bg-[var(--brand-primary)] px-5 text-sm font-semibold text-[var(--text-on-brand)] hover:bg-[var(--brand-primary-hover)]"
        >
          Go home
        </Link>
      </div>
    </main>
  );
}
