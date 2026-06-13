# Release process

Source of truth is this repo; the store package is built from a tagged commit. There's
no build system — just a clean zip.

## Versioning

`manifest.json` `version` is canonical and **must strictly increase** on every store
update. Mirror it to a git tag (`vX.Y.Z`) and a GitHub Release.

- Bug fix → patch (`1.0.1`)
- New user-facing capability (e.g. bulk set-billable) → minor (`1.1.0`)

## Checklist

1. Bump `version` in `extension/manifest.json`.
2. Update the README / changelog notes.
3. Commit; tag `vX.Y.Z`; push the tag.
4. Build the package — zip the **contents of `extension/`** so `manifest.json` is at the
   zip root. It must contain only the `extension/` contents (manifest, content.js,
   icons/). It must **never** include `html/`, `reports/`, or `Screenshots/` — those live
   outside `extension/` and are gitignored.
5. Upload the zip to the Chrome Web Store dashboard → submit for review.
6. Upload the same zip to Microsoft Edge Add-ons (Partner Center) → submit.
7. Create a GitHub Release for the tag and attach the zip, so load-unpacked users can grab
   a pinned build.
8. Once approved, update the "Add to Chrome / Edge" links in the README if the listing
   URLs changed.

## Packaging command

From the repo root (PowerShell):

```powershell
Compress-Archive -Path extension\* -DestinationPath billable-checker-for-scoro-vX.Y.Z.zip -Force
```

`extension\*` puts the manifest at the zip root. Generated zips are gitignored.
