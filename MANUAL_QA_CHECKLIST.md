# Manual QA Checklist

Run from:

```bash
cd /Users/kyle/Development/Codex
```

Start the app:

```bash
npm run dev
```

Recommended test browsers:
- one normal browser window
- one incognito/private window
- one mobile viewport in browser devtools

## Setup

- Confirm `.env` is present with valid Neon values.
- Confirm `npm run prisma:migrate:deploy` succeeded.
- Confirm `/en` loads.

## Group Creation

- Open `/en/groups/new`.
- Create a group with only a group name and the default `JPY` currency.
- Confirm redirect to `/en/groups/created?slug={slug}` and then continue into `/en/g/{slug}`.
- Confirm the created page and the new group page both render without errors.
- Create another group with a different currency such as `USD` or `EUR`.
- Add initial members one by one with the chips input.
- Confirm all initial members appear on the group page.
- Confirm the selected currency is shown on the created page and group page.

## Public Group Page

- Copy the group link.
- Open it in an incognito/private window.
- Confirm the group page is readable and collaborative without login or token entry.
- Confirm add member, add expense, balances, settlement, and export actions are visible.

## Add Member

- Add a new member after group creation.
- Confirm the member appears in the member list immediately after redirect.
- Confirm balances and settlement pages still render after the member is added.

## Create Expense

- Create an expense with:
  - valid title
  - valid amount in the selected group currency
  - valid payer
  - valid date
  - one or more participants
- Confirm redirect back to the group page.
- Confirm the expense appears in the expense list.
- Confirm total balances update.
- Confirm settlement page updates.

## Edit Expense

- Open an existing expense edit page.
- Change title, amount, payer, date, notes, and participants.
- Save.
- Confirm the updated expense appears correctly on the group page.
- Confirm balances change accordingly.
- Confirm settlement recommendations change accordingly.

## Delete Expense

- Delete an existing expense from the edit page.
- Confirm redirect back to the group page.
- Confirm the deleted expense no longer appears on the group page.
- Confirm balances and settlement update accordingly.

## Settlement Page

- Open `/en/g/{slug}/settlement`.
- Confirm three sections are readable:
  - raw expense records
  - balances
  - recommended transfers
- Confirm the empty settlement state is shown when no transfer is needed.
- Confirm transfers are readable on mobile width.

## CSV Export

- Export CSV from the group page.
- Confirm the response downloads as `{slug}.csv`.
- Open the CSV file.
- Confirm it includes:
  - group metadata
  - `currency_code`
  - expenses
  - balances
  - settlements
- Confirm amount columns are generic currency columns rather than JPY-only columns.

## Locale Switching

- Switch between `en`, `ja`, and `zh-CN`.
- Confirm localized UI text changes.
- Confirm user-entered expense titles/notes are not translated.
- Confirm links stay within the same group when switching locale from a group page.

## Mobile Responsiveness

- Test group page in a narrow mobile viewport.
- Confirm buttons remain tappable.
- Confirm long share links wrap instead of breaking layout.
- Confirm expense cards remain readable.
- Confirm settlement page remains readable.

## Invalid Slug / Not Found

- Open a clearly invalid slug URL such as `/en/g/abcd-zzzzzz` if it does not exist.
- Confirm the not-found page appears.

## Malformed Input Handling

- Try to submit:
  - blank group name
  - missing currency selection if you force the field empty in devtools
  - blank member name
  - zero amount
  - non-numeric amount
  - invalid date
  - expense with no participants
- Confirm each case shows a clear error or blocks submission appropriately.

## Multi-Currency Regression Checks

- Create at least one zero-decimal group such as `JPY` or `KRW`.
- Create at least one decimal-currency group such as `USD`, `EUR`, `GBP`, or `CNY`.
- Confirm decimal amounts such as `12.34` are accepted for decimal currencies.
- Confirm zero-decimal groups reject decimal input.
- Confirm balances, settlement, and CSV export stay in the selected group currency.

## Regression Checks

- Refresh the group page after each successful mutation.
- Confirm data stays consistent.
- Confirm deleted expenses do not reappear.
- Confirm settlement and balances still match the visible expense records.
