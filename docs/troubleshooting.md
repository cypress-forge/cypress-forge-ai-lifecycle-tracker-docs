# Troubleshooting and FAQ

## The AI Lifecycle Tools menu doesn't appear

Reload and wait about 10 seconds. If it's still missing, open **Extensions > Apps Script**, pick `onOpen` and click **Run** once. Company Google Workspace accounts sometimes block scripts; ask your admin or use a personal account.

## "Google hasn't verified this app"

Expected for a script inside your own copy. Click **Advanced > Go to ... (unsafe)**. All of the code is in this repository.

## "rejected the API key (HTTP 401)"

- Use **AI Lifecycle Tools > Set API Key** and paste the key again. Copy it fresh from your provider; a missing character is the usual cause.
- Check `Settings!B3` matches the key: an OpenAI key (`sk-...`) won't work with `Gemini`, and the other way round.
- For OpenAI, make sure the account has credit under **Billing**.

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

## Where is my API key stored? Can people I share the sheet with see it?

It's stored in the script's private *User Properties* for your Google account, not in any cell. People you share the sheet with can't see it, and it isn't included when someone makes a copy. Anyone else using a shared copy needs to run **Set API Key** with their own key. To delete it, use **Remove API Key**. Setting a monthly spend limit in your OpenAI or Google account is still a good idea.

## "No API key saved yet"

Use **AI Lifecycle Tools > Set API Key**. If you're on a shared copy, the key saved by the sheet's owner doesn't carry over to you; set your own.

## I typed my key into a Settings cell

That's fine. The next time you run the menu, the script moves the key into private storage and replaces the cell with "Saved privately". If the sheet was shared while the key was visible, rotate the key in your provider's dashboard to be safe.

## Still stuck?

Open an issue with the error message, with your API key, client names and order numbers removed. Purchase questions: support@cypressforge.dev.
