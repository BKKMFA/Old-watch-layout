# Publishing checklist

## 0. Before you start (once)
1. Put your real name (or handle) in `LICENSE`.
2. In `THIRD_PARTY_NOTICES.md`, replace the copyright line with the exact one from
   https://github.com/davidluttrull/youtube-classic-watch-layout (LICENSE file).
3. Create a public GitHub repo, push this folder, and add the repo URL to the store reviewer notes.
   Enable GitHub Pages or just link `PRIVACY.md` for the privacy policy URL.
4. Choose your Firefox add-on ID, e.g. `classic-watch-layout@yourname.github.io`. It cannot change later.
5. Test the packages in each browser (below).
6. Build: `GECKO_ID=classic-watch-layout@yourname.github.io python3 build.py`

## 1. Chrome Web Store (also reaches Brave, Opera, Vivaldi)
- One-time $5 developer registration fee.
- https://chrome.google.com/webstore/devconsole -> register -> New item -> upload
  `dist/classic-watch-layout-1.0.0-chromium.zip`.
- Fill in the Store listing, Privacy practices, and Distribution tabs using `store/LISTING.md`.
- Add screenshots, then Submit for review (a few days is typical; the first review can take longer).

## 2. Microsoft Edge Add-ons
- Free. Register at Partner Center (Microsoft Edge program); you can sign in with a personal GitHub account.
- Upload the **same** `-chromium.zip` and reuse the listing text.
- Edge also has a convenience route to import from the Chrome Web Store, but uploading the zip is simplest.

## 3. Firefox (addons.mozilla.org)
- Free. https://addons.mozilla.org/developers/ -> Submit a New Add-on.
- Choose "On this site" (listed). Upload `dist/classic-watch-layout-1.0.0-firefox.zip`.
- New extensions must declare data collection in the manifest; the build already sets `"required": ["none"]`.
- Run `npx web-ext lint --source-dir <unzipped firefox package>` first to catch errors.
- When asked about source code: the code is not minified or generated, so no separate source upload is needed.
- Test on Firefox 128 or later.

## 4. Updating later
Bump `version` in `src/manifest.base.json`, add a CHANGELOG line, run `python3 build.py`, and upload the
new zips to each store. Tag the release in GitHub (`git tag v1.0.1 && git push --tags`).

## Things that commonly cause rejection
- Name that looks like it's from YouTube/Google: keep the "for YouTube" naming and the disclaimer.
- Vague permission justifications: use the text in `store/LISTING.md`.
- Missing privacy policy or screenshots.
- Unpacked code that differs from the repo: always build the zip from `src/`.
