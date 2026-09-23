# Release process

Source of truth is this repo; the download package is built from a tagged commit. There's
no build system — just a clean zip.

## Versioning

`extension/manifest.json` `version` is canonical and **must strictly increase** for each
new extension release. Mirror it to a git tag (`vX.Y.Z`) and a GitHub Release. The first
publication of an existing local version uses that version.

- Bug fix → patch (`1.0.1`)
- New user-facing capability → minor (`1.1.0`)

## Checklist

1. Set the release version in `extension/manifest.json` and update the README download link.
2. Validate the manifest and JavaScript, and check the indicators on an individual timesheet.
3. Review the tracked files and commit the release to `main`.
4. Build the package from that commit — zip the **contents of `extension/`** so `manifest.json` is at the
   zip root. It must contain only the `extension/` contents (manifest, content.js,
   icons/). It must **never** include `html/`, `reports/`, or `Screenshots/` — those live
   outside `extension/` and are gitignored.
5. Inspect the ZIP file list and verify its contents match `extension/` at the release commit.
6. Tag that commit `vX.Y.Z`, push the tag, and create a GitHub Release with the ZIP attached.
7. Download the published asset and verify it matches the local ZIP.

Browser-store publication is a separate step if a store listing is created later.

## Packaging command

From the repo root at the release commit (PowerShell):

```powershell
git archive --format=zip --output=billable-lens-vX.Y.Z.zip HEAD:extension
```

`HEAD:extension` includes only committed extension files and puts the manifest at the
ZIP root. Generated ZIPs are gitignored.
