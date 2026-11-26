# Troubleshooting and FAQ

## The AI Lifecycle Tools menu doesn't appear

Reload and wait about 10 seconds. If it's still missing, open **Extensions > Apps Script**, pick `onOpen` and click **Run** once. Company Google Workspace accounts sometimes block scripts; ask your admin or use a personal account.

## "Google hasn't verified this app"

Expected for a script inside your own copy. Click **Advanced > Go to ... (unsafe)**. All of the code is in this repository.

## "rejected the API key (HTTP 401)"

Check `Settings!B2` for spaces or a cut-off key, and that `B3` matches the key's provider. OpenAI accounts need credit under **Billing**.

## "Rate limit or quota reached (HTTP 429)"

Wait a minute and run again; finished rows are kept. Free tiers and new accounts have the lowest limits.

## A row is marked Review

One of these happened:

- The client draft mentioned a price, margin, the vendor's name or the PO number, so it was removed. Write that client update by hand.
- The email had no PO #, Sales Order # or Ticket #, so it can't be matched to a deal.
- The delivery date wasn't a clear date ("mid December"), so it was left blank.
- The document type wasn't recognised.

## "No pipeline match" when applying

The parser row's PO #, Sales Order # or Ticket # isn't on **Lifecycle Pipeline**. Add the deal first, or correct the number in the parser row and apply again. `PO-88341`, `PO # 88341` and `88341` are treated as the same number.

## Some rows say "AI skipped this row"

Select them and use **Re-parse Selected Rows**.

## Can I paste a whole email thread?

Yes, but only the first 6,000 characters are read. Put the newest message on top (most email apps already do).

## Does it change my Stage, Cost or Sell Price?

No. Applying a row only fills Carrier, Tracking #, Est. Delivery, Client Update Note and Internal Tech Note, and only where the parser found a value. You move the Stage yourself.

## Does it cost API credits every time I open the sheet?

No. Results are plain values written once.

## Is my API key safe in the sheet?

It's stored in `Settings!B2` of your own copy. Anyone you share the sheet with can see it. If your team shares the tracker, give each person view-only access, or use a key with a monthly spend limit.

## Still stuck?

Open an issue with the error message, with your API key, client names and order numbers removed. Purchase questions: support@cypressforge.dev.
