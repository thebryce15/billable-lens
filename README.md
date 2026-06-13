# Billable Lens

*See billable vs non-billable hours at a glance on Scoro timesheets.*

> **Unofficial community tool.** Not affiliated with, endorsed by, or supported by
> Scoro Software OÜ. "Scoro" is a trademark of its respective owner and is used here
> only to describe compatibility.

A lightweight Chrome / Edge extension that adds a billable-status indicator to the
Scoro timesheet — a green ✓ / red ✗ / orange ✗ (partial) / gray · (unknown) badge on
each time entry — so you can see at a glance whether hours are billable **without
clicking into every entry**. Scoro removed this indicator; this restores it.

<!-- TODO: add a sanitized before/after screenshot here (assets/) -->

## Features

- **Per-entry billable badge** on the timesheet week view:
  - **✓ green** — all time billable
  - **✗ red** — non-billable
  - **✗ orange** — partially billable (hover for the split, e.g. "4h of 6h")
  - **· gray** — couldn't be determined (e.g. time-off entries, fetch error)
- **Read-only and session-based** — no API key, no configuration. Badges refresh
  automatically after you edit an entry.
- *(Coming soon)* an optional, opt-in **"set all hours billable for this week"** action
  with a preview-and-confirm step.

## Install

### One-click (recommended)

- **Chrome:** *Chrome Web Store link — coming soon*
- **Edge:** *Edge Add-ons link — coming soon*

### Developer install (load unpacked)

For contributors, or before the store listing is live:

1. Download or clone this repo.
2. Open `chrome://extensions` (or `edge://extensions`).
3. Enable **Developer mode** (top right).
4. Click **Load unpacked** and select the `extension/` folder.
5. Open or refresh your timesheet at `https://<your-company>.scoro.com/tasks/timesheet`.

## How it works

The billable status isn't present in the timesheet grid — Scoro only loads it when you
open an entry. The extension runs in the page's own context and calls Scoro's existing
in-page request (the same one a click fires) to fetch each entry's data, reads the
billable fields, and paints a badge. Everything happens within your authenticated
session. **No data is collected, stored, or transmitted anywhere** — only your browser
and your own Scoro tenant are involved.

## Privacy

This extension has no servers, no analytics, and makes no third-party calls. It does not
collect, store, or transmit any data off your device. It reads (and, in a forthcoming
opt-in feature, writes) time-entry data only within your own authenticated Scoro session,
at your direction.

## Scope / limitations

- Works on the per-user timesheet **week view** (`/tasks/timesheet*`).
- The all-staff full-list view isn't decorated — its cells are per-day aggregates; doing
  that well would need the Scoro API rather than per-entry fetches.
- Depends on Scoro's current page internals, so a Scoro update could break it. When that
  happens, badges fail soft to gray dots rather than erroring.

## Compatibility

Chrome and Chromium-based Edge (Manifest V3). Works for any Scoro tenant
(`https://*.scoro.com`).

## Contributing

Plain JavaScript, no build step. See [CONTRIBUTING.md](CONTRIBUTING.md).

## Maintenance status

Built for an internal need and shared with the community as-is. Active maintenance may
wind down over time; **forks and contributors are welcome** — it's MIT licensed.

## License

[MIT](LICENSE).
