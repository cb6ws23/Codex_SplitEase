# Splita

Splita is a lightweight web app for splitting shared expenses without asking
every person in a temporary group to install an app or create an account.

**Live product:** [https://www.split-a.com/en](https://www.split-a.com/en)

## Product thesis

The arithmetic of splitting a bill is rarely the hardest part. The real problem
is coordination: choosing a tool, getting everyone into it, recording expenses
consistently, and agreeing on how to settle.

Splita reduces that coordination cost:

1. One person creates a group.
2. They share one link.
3. Everyone with the link can add members and expenses.
4. Splita keeps balances current and suggests the transfers needed to settle.

No download, login, or account is required.

## Current product

- Single-link collaboration
- Group creation with optional initial members
- Six supported currencies: JPY, USD, EUR, GBP, CNY, and KRW
- One currency per group, used consistently across the full workflow
- Create, edit, and delete expenses
- Equal split among selected participants
- Per-member balances and settlement recommendations
- CSV export
- English, Japanese, and Simplified Chinese interfaces
- Mobile-first responsive layout

## Deliberate product choices

- **One link instead of accounts:** minimizes onboarding friction for temporary
  groups, with the explicit tradeoff that the link must be treated like a
  password.
- **One currency per group:** avoids hidden foreign-exchange assumptions while
  keeping calculations and exports predictable.
- **Suggestions instead of payments:** Splita explains who should pay whom but
  does not move money or position itself as a financial service.
- **No automatic translation of user content:** the interface is localized,
  while names, notes, and expense descriptions remain exactly as entered.

## Evidence and limitations

Splita is used repeatedly by its creator, friends, and people who discovered it
through those friends for trips and group dining. This is qualitative evidence
of organic adoption; the product does not yet have analytics that support
reliable quantitative usage claims.

Current limitations include no account recovery, read-only access, member
rename/delete, mixed-currency expenses, exchange-rate conversion, settlement
status tracking, or production analytics and monitoring.

## Technology

- Next.js App Router
- React and TypeScript
- Tailwind CSS
- Prisma
- PostgreSQL on Neon
- next-intl
- Vercel

The product was developed iteratively with AI-assisted research, implementation,
copy review, and testing. Product scope, tradeoffs, acceptance decisions, and
final validation remain human-owned.

## Local setup

Requirements:

- Node.js and npm
- A PostgreSQL database

Install dependencies and create the local environment file:

```bash
npm install
cp .env.example .env
```

Fill in:

```env
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

Apply the checked-in migration and start the app:

```bash
npm run prisma:migrate:deploy
npm run dev
```

Open `http://localhost:3000/en`.

## Verification

```bash
npm test
npm run lint
npx tsc --noEmit --incremental false
npm run build
```

The pure money-allocation and settlement algorithms are covered by automated
unit tests. End-to-end behavior is checked with
[`MANUAL_QA_CHECKLIST.md`](./MANUAL_QA_CHECKLIST.md), including multi-browser,
mobile, locale, currency, editing, settlement, CSV, and malformed-input cases.

## Deployment

Production requires:

- `DATABASE_URL`
- `DIRECT_URL`
- `NEXT_PUBLIC_APP_URL`

Vercel uses:

```bash
npm run build:vercel
```

This applies database migrations and builds the Next.js application.
