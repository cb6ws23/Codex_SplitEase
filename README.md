# SplitEase MVP A

Anonymous-first group expense sharing for JPY-only trips and shared spending.

Project root:

```bash
/Users/kyle/Development/Codex
```

Tech stack:
- Next.js App Router
- TypeScript
- Tailwind CSS
- Prisma
- PostgreSQL
- next-intl
- Vercel Hobby
- Neon Free

## MVP A Scope

Implemented:
- Create group
- Add members
- Public group page by slug
- Unlock write access with token
- Create, edit, and delete expenses
- Equal split among selected participants only
- Per-member balances
- Greedy settlement recommendations
- CSV export
- `en`, `ja`, `zh-CN` UI

Not included:
- Login or signup
- Read-only mode
- Dashboard
- Multi-currency
- Member rename
- Member delete
- Auth providers
- Cron jobs
- Paid integrations

## Environment Setup

1. Copy the env template:

```bash
cp .env.example .env
```

2. Fill in these values:

```env
DATABASE_URL="postgresql://USER:PASSWORD@ep-example-pooler.ap-northeast-1.aws.neon.tech/splitease?sslmode=require&pgbouncer=true&connect_timeout=15"
DIRECT_URL="postgresql://USER:PASSWORD@ep-example.ap-northeast-1.aws.neon.tech/splitease?sslmode=require&channel_binding=require"
WRITE_TOKEN_PEPPER="replace-with-a-long-random-string-at-least-32-characters"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

Meaning:
- `DATABASE_URL`: Neon pooled connection used by the running app.
- `DIRECT_URL`: Neon direct connection used by Prisma migrations.
- `WRITE_TOKEN_PEPPER`: stable secret used when hashing write tokens.
- `NEXT_PUBLIC_APP_URL`: public base URL used when generating share links.

Important:
- Keep `WRITE_TOKEN_PEPPER` stable after launch or existing write tokens will stop working.
- Do not add a trailing slash to `NEXT_PUBLIC_APP_URL`.

## Neon Free Setup

1. Create a Neon project.
2. Create a database, for example `splitease`.
3. Copy the pooled connection string into `DATABASE_URL`.
4. Copy the direct connection string into `DIRECT_URL`.
5. Save both in `.env`.

## Install And Migrate

Run from the Codex root:

```bash
cd /Users/kyle/Development/Codex
npm install
```

Apply the checked-in migration:

```bash
npm run prisma:migrate:deploy
```

The checked-in initial migration is:

```text
prisma/migrations/0001_init/migration.sql
```

If you want Prisma to create a local development migration instead of only applying the checked-in one:

```bash
npm run prisma:migrate:dev -- --name init
```

## Run Locally

Start the app:

```bash
npm run dev
```

Then open:

```text
http://localhost:3000/en
```

Useful verification commands:

```bash
npm run lint
npx next build --webpack
```

## How To Test The Write-Access Flow

1. Open the app and create a group.
2. After creation, the creating browser already has write access.
3. Copy the public group link from the group page.
4. Copy the write link from the write-access panel.
5. Open the public link in a separate browser or incognito window.
6. Confirm the page is viewable without a token.
7. Paste the write token in that second browser.
8. Confirm add member / add expense / edit expense / delete expense now work there.

## Manual QA Checklist

Use the checklist in:

[`MANUAL_QA_CHECKLIST.md`](/Users/kyle/Development/Codex/MANUAL_QA_CHECKLIST.md)

## Vercel Hobby Deployment

Root directory:
- Use `Codex` as the Vercel root directory if this project is inside a larger repo.

Required environment variables in Vercel:
- `DATABASE_URL`
- `DIRECT_URL`
- `WRITE_TOKEN_PEPPER`
- `NEXT_PUBLIC_APP_URL`

Recommended production value:

```env
NEXT_PUBLIC_APP_URL="https://your-project-name.vercel.app"
```

Install command:

```bash
npm install
```

Build command:

```bash
npm run build:vercel
```

This runs:
- `prisma migrate deploy`
- `next build`

Deployment steps:

1. Push the project to the Git repository Vercel should watch.
2. Import the repository into Vercel.
3. Set the root directory to `Codex` if needed.
4. Add all four required environment variables.
5. Set build command to `npm run build:vercel`.
6. Deploy.

This MVP does not require:
- paid auth
- object storage
- cron jobs
- paid add-ons

## Runtime Notes For Real Testing

- The public group page is readable by slug alone.
- Mutation routes still require a valid write token in the browser cookie.
- CSV export is public by slug in MVP A because the group page itself is public.
- Locale routing is canonical through `en`, `ja`, and `zh-CN`.
- Prisma migrations require `DIRECT_URL` to exist in the environment.

## Known Limitations

- No member rename or delete.
- No read-only mode.
- No dashboard.
- No multi-currency.
- No auth or account recovery.
- No analytics, monitoring integrations, or background jobs.
