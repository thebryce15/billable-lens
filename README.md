# Billable Lens

*See billable vs non-billable hours at a glance on Scoro timesheets.*

> **Unofficial community tool.** Not affiliated with, endorsed by, or supported by
> Scoro Software OÜ. "Scoro" is a trademark of its respective owner and is used here
> only to describe compatibility.

A lightweight Chrome / Edge extension that adds a billable-status indicator to the
Scoro timesheet — a color-coded ✓ / ✗ / 🔒 badge on each time entry — so you can see at
a glance whether hours are billable **without clicking into every entry**. Scoro removed
this indicator; this restores it.

## Features

- **Per-entry billable badge** on the timesheet week view:
  - **✓ green** — all hours billable
  - **✗ red** — non-billable, but the task *can* be billable (worth a look)
  - **✓ gray** — non-billable by task policy (e.g. overhead) — expected, not a problem
  - **◐ orange** — partially billable (hover for the split, e.g. "4h of 6h")
  - **🔒 lock** — Scoro did not allow the entry details to be opened; commonly invoiced / billed entries
  - **· gray** — time off or status unavailable
- **Read-only and session-based** — no API key, no configuration. Badges refresh
  automatically after you edit an entry.

## Install

1. Download the `billable-lens-v1.1.0.zip` asset from the
   [v1.1.0 release](https://github.com/thebryce15/billable-lens/releases/tag/v1.1.0).
2. Extract the ZIP into a permanent folder on your computer. Keep that folder after installation.
3. Open `chrome://extensions` (or `edge://extensions`) and enable **Developer mode**.
4. Click **Load unpacked** and select the extracted folder containing `manifest.json`.
5. Sign into Scoro with your own account. Open **Timesheet**, click an employee's name
   to open their **individual week view**, and refresh the page. Indicators appear beside
   individual time entries at `/tasks/timesheet/view/...`.

No API key or configuration is required. The toolbar icon has no menu; the indicators
appear directly on the timesheet. If your company disables Developer mode or Load
unpacked, ask your IT administrator about installing the extension.

If you download or clone the source repository instead, select its `extension/` folder
in step 4. This extension is currently distributed through GitHub, not a browser store.

## How it works

The billable status isn't present in the timesheet grid — Scoro only loads it when you
open an entry. The extension runs in the page's own context and calls Scoro's existing
in-page request (the same one a click fires) to fetch each entry's data, reads the
billable fields, and paints a badge. Requests use your existing authenticated Scoro
session and its permissions. The extension does not change or save time entries.

## Privacy

Billable Lens has no server, analytics, or third-party data collection. It requests
entry details only from your Scoro tenant through your existing session. Parsed status
is cached in page memory until the page is reloaded; it is not saved to browser storage.
No credentials or API keys are bundled with the extension.

## Scope / limitations

- Works on individual time entries in the per-user timesheet **week view**.
- The team overview and all-staff full-list view are not decorated. Open an employee's
  individual timesheet to see indicators.
- Scoro does not provide billable details for every entry. A lock is not independent
  proof that an invoice exists.
- Depends on Scoro's page structure. If indicators are missing, unavailable, or stale,
  refresh the timesheet. A Scoro update may require an extension update.

## Compatibility

Current Chrome and Chromium-based Edge (Manifest V3). The extension runs on timesheet
pages hosted at `https://*.scoro.com` and uses the account already signed into Scoro.

## Updating

Download and extract a newer release into the same installation folder, click the
extension's reload button at `chrome://extensions` (or `edge://extensions`), and refresh
Scoro. Unpacked installations do not update automatically.

## Contributing

Plain JavaScript, no build step. See [CONTRIBUTING.md](CONTRIBUTING.md).

## Maintenance status

Built for an internal need and shared with the community as-is. Active maintenance may
wind down over time; **forks and contributors are welcome** — it's MIT licensed.

## License

[MIT](LICENSE).
