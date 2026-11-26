# AI Quote, PO & Shipping Lifecycle Tracker for Google Sheets

Track every order from ticket to invoice in one sheet, and stop retyping vendor emails. Paste a distributor confirmation, tracking email or backorder notice, click one menu item, and get the PO, tracking number, ETA and two draft notes: one safe to send to your client, one for your techs.

Built for MSPs, IT resellers, field service shops, contractors and small procurement teams.

This repository holds the open-source Apps Script behind the sheet, the setup guide and the troubleshooting FAQ. The ready-made workbook (pipeline, dashboard, formulas and formatting) is sold separately at **[cypressforge.dev](https://cypressforge.dev)** for $49, one time.

![Parsing a shipping email](assets/parse-demo.gif)
<!-- GIF placeholder: see assets/README.md -->

## What it does

| Tab | What happens there |
| --- | --- |
| **Start Here** | The 8-stage lifecycle, a four-step quickstart and Google's one-time authorization notes. |
| **Settings** | API key (`B2`), provider (`OpenAI` or `Gemini` in `B3`), default target margin (`B4`, 25%), 8 editable lifecycle stages from `1 - Ticket / Intake` to `8 - Invoiced / Closed`, and 6 approved carriers. |
| **Lifecycle Pipeline** | The 16-column master tracker: Ticket #, Client / Account, Project / Item Summary, Stage, Quote #, Sales Order #, PO #, Vendor, Cost, Sell Price, Margin, Carrier, Tracking #, Est. Delivery, Client Update Note, Internal Tech Note. |
| **AI Email & Note Parser** | Paste raw emails into column B, then **AI Lifecycle Tools > Parse Unprocessed Emails / Updates**. |
| **Pipeline Dashboard** | Active deals, pipeline revenue, gross margin, shipments in transit or on backorder, a stage-by-stage rollup and a watchlist of open POs. |

What the parser writes for each email:

| Column | Field |
| --- | --- |
| A | Status: `Parsed`, `Review`, `Applied` or `Error` |
| C | Doc Type: Quote, Order Confirmation, Shipping Notification, Delivery Confirmation, Backorder Notice, Invoice, Other |
| D-F | Ticket / Ref #, Quote / SO #, PO # |
| G-H | Vendor, Carrier (matched to your approved carrier list) |
| I-J | Tracking #, Est. Delivery (`YYYY-MM-DD`, left blank rather than guessed) |
| K | **Draft Client Ticket Update:** a short, polite status update |
| L | **Draft Internal Tech Note:** PO, items, carrier, tracking, ETA and any action needed |

Then select the rows you've checked and use **Apply Selected Rows to Pipeline**. The script finds the matching deal by PO #, Sales Order # or Ticket # and fills in Carrier, Tracking #, Est. Delivery and both notes. It never changes Cost, Sell Price, Margin or Stage.

## The client note never shows your cost

Distributor emails are full of your buy price. The client draft is written with strict instructions to leave out cost, pricing, margin, discounts, the distributor's name and internal PO numbers, and then the script checks it. If the draft contains a dollar amount, words like "margin" or "our cost", the vendor's name or the PO number, the draft is deleted, the row is marked `Review`, and the tech note says to write the client update by hand.

## Bring your own key

You use your own OpenAI or Google Gemini API key. No subscription, no per-seat pricing.

| Provider | Model | Rough cost per 1,000 emails* |
| --- | --- | --- |
| OpenAI | `gpt-4o-mini` | about $0.35 |
| Google Gemini | `gemini-2.5-flash` | about $1.00 (or $0 on Gemini's free tier, within its limits) |

\*Estimated from list prices when this was written, for a typical email of about 1,500 tokens. Check [OpenAI pricing](https://openai.com/api/pricing/) and [Gemini pricing](https://ai.google.dev/gemini-api/docs/pricing) for current rates.

## How the script works

- **25 emails per request**, with results written after each batch.
- **Stays under Google's 6-minute limit.** It stops itself at about 4.5 minutes; run the menu again to continue.
- **Static values, not formulas.** Nothing re-runs or costs credits when the sheet recalculates.
- **Only new rows.** Rows with anything in Status (column A) are skipped. Use **Re-parse Selected Rows** to redo one.
- **No invented data.** Missing fields stay blank. Unclear dates are dropped and the row is marked `Review`.
- **Long threads are trimmed** to the first 6,000 characters to keep requests cheap. Paste the newest message on top.

## Where your data goes

- Email text is sent only to the AI provider you pick in `Settings!B3`, using your key. Nothing is sent to Cypress Forge.
- Permissions are limited to this one spreadsheet, outside requests to the AI provider, and menus. See [`src/appsscript.json`](src/appsscript.json).
- Remove anything you don't want sent (customer addresses, phone numbers) before pasting, if your policies require it.

## Files

```
src/
  Code.gs          Menu, parser, client-note check, pipeline matching
  AiClient.gs      OpenAI and Gemini calls, retries, JSON parsing
  appsscript.json  Manifest with the permission list
docs/
  setup.md            Step-by-step setup
  troubleshooting.md  FAQ and error messages
assets/            Preview GIFs and screenshots
```

## Using the script without the paid workbook

The code is MIT licensed. Paste `Code.gs` and `AiClient.gs` into any sheet with `Settings`, `AI Email & Note Parser` and `Lifecycle Pipeline` tabs laid out as above. Column positions are set at the top of `Code.gs` (`PARSER_COLS`, `PIPELINE_COLS`, `CARRIERS_RANGE`) if yours differ. The paid workbook saves you building the pipeline, dashboard, stage rollups and formatting.

## Support

Read [troubleshooting](docs/troubleshooting.md) first. Bugs in the script: open an issue here. Purchase questions: support@cypressforge.dev.
