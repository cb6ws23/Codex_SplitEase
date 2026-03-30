import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--page-background)] px-4 py-10">
      <div className="w-full max-w-md rounded-[28px] border border-[var(--border)] bg-white p-6 text-center shadow-[0_12px_40px_rgba(15,23,42,0.06)]">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
          404
        </p>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-[var(--foreground)]">
          Group or page not found
        </h1>
        <p className="mt-3 text-sm leading-6 text-[var(--muted-foreground)]">
          Check the link and try again. If you expected this group to exist, ask
          the person who shared it to confirm the slug.
        </p>
        <Link
          href="/"
          className="mt-5 inline-flex h-11 items-center justify-center rounded-full bg-[var(--foreground)] px-5 text-sm font-semibold text-white"
        >
          Go home
        </Link>
      </div>
    </main>
  );
}
