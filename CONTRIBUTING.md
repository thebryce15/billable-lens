# Contributing to Billable Lens

Thanks for your interest. This is a small, plain-JavaScript Chrome / Edge extension —
no build step, no dependencies.

## Project layout

- `extension/manifest.json` — Manifest V3 config.
- `extension/content.js` — the content script. Runs in the page's MAIN world so it can
  call Scoro's own `window.scoro.submitAjax`.
- `extension/icons/` — toolbar / store icons.

## Dev setup

1. Clone the repo.
2. `chrome://extensions` → enable **Developer mode** → **Load unpacked** → select `extension/`.
3. Open a Scoro timesheet (`https://<your-company>.scoro.com/tasks/timesheet`).
4. Edit `content.js`, then click the reload icon on the extension card to apply changes.

## Conventions

- Plain ES2017+ JavaScript. No transpiler, no bundler — keep it dependency-free.
- Match the existing style in `content.js`: small functions, terse comments.
- The extension stays **read-only by default**. Any write capability must be explicitly
  user-initiated and gated behind a preview + confirm step — never an automatic mutation.

## The Scoro DOM contract (where things break)

The extension depends on Scoro internals that can change without notice:

- Time-entry anchors: `a.js-open-time-entry[data-time-entry-id]`
- The per-entry modal, fetched via
  `scoro.submitAjax('tasks/timesheet/view', cb, {act:'popup', modalName:'timeEntry', args:{timeEntryId}})`
- Hidden fields in that modal: `billable_time_type`, `billable_duration`, and
  `select[name="duration"] option[selected]`

If Scoro changes these, badges fail soft to gray dots — that's the first place to look.

## Reporting issues

Open a GitHub issue with your Scoro region/version (if known) and a screenshot.
**Do not include real client or employee data** in issues or screenshots.
