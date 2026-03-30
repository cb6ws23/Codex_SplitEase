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
- Create a group with only a group name.
- Confirm redirect to `/en/g/{slug}`.
- Confirm the new group page renders without errors.
- Create another group with initial members entered one per line.
- Confirm all initial members appear on the group page.

## Public Group Page

- Copy the public group link.
- Open it in an incognito/private window.
- Confirm the group page is readable without any token.
- Confirm balances, expenses section, and settlement button are visible.

## Write Access Unlock

- In the original browser, copy the write link.
- In the incognito/private window, paste only the write token into the unlock form.
- Confirm the page reloads successfully.
- Confirm add member and add expense actions are now available.
- Try an invalid token.
- Confirm the page shows a clear invalid-access message and remains readable.

## Add Member

- Add a new member after group creation.
- Confirm the member appears in the member list immediately after redirect.
- Confirm balances and settlement pages still render after the member is added.

## Create Expense

- Create an expense with:
  - valid title
  - valid JPY amount
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
  - expenses
  - balances
  - settlements

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
  - blank member name
  - zero amount
  - non-numeric amount
  - invalid date
  - expense with no participants
- Confirm each case shows a clear error or blocks submission appropriately.

## Regression Checks

- Refresh the group page after each successful mutation.
- Confirm data stays consistent.
- Confirm deleted expenses do not reappear.
- Confirm settlement and balances still match the visible expense records.
