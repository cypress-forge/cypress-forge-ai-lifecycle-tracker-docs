# Setup

Takes about 5 minutes. You need a Google account and an API key from OpenAI or Google.

## 1. Make your copy

Open the link in the PDF from your purchase. Google asks **Make a copy?**. Click **Make a copy**. The copy is private to you.

## 2. Get an API key

**OpenAI:** go to [platform.openai.com/api-keys](https://platform.openai.com/api-keys), click **Create new secret key** and copy it (starts with `sk-`). Add a few dollars of credit under **Billing**.

**Google Gemini:** go to [aistudio.google.com/apikey](https://aistudio.google.com/apikey), click **Create API key** and copy it. The free tier works for light use.

## 3. Fill in Settings

| Cell | What to enter |
| --- | --- |
| `B3` | `OpenAI` or `Gemini` |
| `B4` | Your default target margin (starts at 25%) |
| Stages | Rename any of the 8 lifecycle stages to match how your shop works |
| Carriers (`C8:C13`) | The 6 carriers you use. The parser matches carrier names to this list. |

![Settings tab](../assets/settings.png)

## 4. Authorize the script and save your key (one time)

1. Reload the sheet. After a few seconds an **AI Lifecycle Tools** menu appears to the right of **Help**.
2. Click **AI Lifecycle Tools > Set API Key**.
3. Google shows **Authorization required**. Click **Continue** and pick your account.
4. You may see **Google hasn't verified this app**. That's normal for a script that lives inside your own sheet. Click **Advanced**, then **Go to AI Lifecycle Tracker (unsafe)**.
5. Review the permissions and click **Allow**.
6. Click **Set API Key** again, paste your key and click **OK**. It's saved privately to your account, not in a cell.
7. Click **Test API Connection**. You should see "OpenAI is connected" (or Gemini).

![Authorization screens](../assets/authorize.gif)

The script can only reach this spreadsheet and your chosen AI provider. The full permission list is in [`src/appsscript.json`](../src/appsscript.json).

## About your API key

The key is never typed into a cell. **Set API Key** saves it in the script's private storage for your Google account (Apps Script *User Properties*). That means:

- Nobody you share the sheet with can see it, and each person who uses a shared copy sets their own key.
- It isn't copied when someone makes a copy of the sheet.
- **Remove API Key** deletes it. You can also delete or rotate the key at any time from your OpenAI or Google account.

## 5. Daily use

1. Add each new deal to **Lifecycle Pipeline** with at least a Ticket #, and the PO # or Sales Order # once you have one.
2. When a vendor or carrier email arrives, paste the whole email into a new row of **AI Email & Note Parser**, column B.
3. Click **AI Lifecycle Tools > Parse Unprocessed Emails / Updates**.
4. Read the drafts. Rows marked `Review` need a closer look.
5. Select the rows you're happy with and click **Apply Selected Rows to Pipeline**.
6. Move the deal's **Stage** yourself. **Pipeline Dashboard** updates on its own.

![Parse and apply](../assets/parse-demo.gif)

## Installing the script in your own sheet (open-source route)

1. In any Google Sheet, open **Extensions > Apps Script**.
2. Replace `Code.gs` with [`src/Code.gs`](../src/Code.gs), add a file named `AiClient` with [`src/AiClient.gs`](../src/AiClient.gs).
3. In **Project Settings**, tick **Show "appsscript.json" manifest file** and replace it with [`src/appsscript.json`](../src/appsscript.json).
4. Create the tabs described in the README, or change the column numbers at the top of `Code.gs` to match yours.
