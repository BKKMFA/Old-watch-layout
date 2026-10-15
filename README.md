# Classic Watch Layout for YouTube

A small browser extension (Chrome, Edge, Firefox) that restores YouTube's classic desktop watch page
after the October 2026 layout test:

- Comments and description go back **under the video**
- Recommendations go back to the **right-hand column**, at normal size
- Optional: **always open videos in theater mode**
- Optional: hide Premium upsells

The popup has three switches; reload the YouTube tab after changing one.

> Not affiliated with or endorsed by YouTube or Google. "YouTube" is a trademark of Google LLC.

## Install

Pick your browser. After installing, **reload your YouTube tab** (Ctrl+Shift+R), click the extension's
icon, and check the three switches. "Always theater mode" is worth turning on if you want a bigger player.

> Until the extension is listed in a browser's add-on store, you install it manually from a downloaded
> zip. That is safe if you trust the source, and you can read every line of code in this repo.

### Microsoft Edge
1. Go to the [Releases](../../releases) page and download `classic-watch-layout-...-chromium.zip`.
2. **Unzip it into a folder you will keep**, for example `Documents\ClassicWatchLayout`. Do not delete or
   move this folder later, or the extension will stop working.
3. Open `edge://extensions` and turn on **Developer mode** (the toggle in the left sidebar).
4. Click **Load unpacked** and select the folder that contains `manifest.json`.
5. Open the puzzle-piece icon in the toolbar and pin the extension if you want quick access.

### Google Chrome (also Brave, Vivaldi, Opera)
1. Download and unzip the same `...-chromium.zip` into a folder you will keep.
2. Open `chrome://extensions` and turn on **Developer mode** (top right).
3. Click **Load unpacked** and select the folder that contains `manifest.json`.
4. Pin the extension from the puzzle-piece menu if you like.

Brave, Vivaldi and Opera use the same steps with their own address (for example `brave://extensions`).

### Firefox (temporary install)
Requires Firefox 128 or newer.
1. Download and unzip `...-firefox.zip` from the Releases page.
2. Open `about:debugging#/runtime/this-firefox`.
3. Click **Load Temporary Add-on** and select the `manifest.json` file inside the unzipped folder.

Firefox removes temporary add-ons **every time it restarts**, so you would repeat these steps each time.
A permanent, signed version is needed for everyday use; see the Releases page for whether one is available.

### What to expect (warnings and limits)
- **Developer-mode warnings.** Chrome and Edge may show a notice about extensions running in developer
  mode, and may occasionally ask you to turn them off. Choose to keep the extension.
- **No automatic updates.** To update, download the new zip, replace the contents of your folder, then
  click the reload icon on the extension's card in `chrome://extensions` / `edge://extensions`.
- **Keep the folder.** The browser loads the extension from that folder every time it starts.
- **YouTube changes things.** This patches an experimental layout. If YouTube renames its internals, it can
  stop working until it is updated. Please [open an issue](../../issues).
- **Privacy.** It runs only on youtube.com, collects nothing, and makes no network requests.
  See [PRIVACY.md](PRIVACY.md).

### Not working?
1. Hard-refresh the YouTube tab (Ctrl+Shift+R).
2. Make sure the extension is turned on and "Classic watch page" is enabled in its popup.
3. Check that you selected the folder containing `manifest.json`, not a parent folder.
4. If the old layout still isn't back, open an issue with a screenshot and the output of the snippet in
   the Contributing section below.

### Uninstall
Open the extensions page (`edge://extensions` or `chrome://extensions`), find the extension, and click
**Remove**. You can then delete the folder.

## How it works
YouTube controls the new layout with server-side experiment flags. A script in the page's own JS
world (`src/watch-layout.js`) switches those flags off before the page is built, moves the sections
back if needed, and can click the theater-mode button. `src/content.css` removes leftover pieces.
There is no network access, no tracking, and no remote code. See [PRIVACY.md](PRIVACY.md).

It also lowers the height YouTube reserves under the player (a flag override plus one CSS variable) so
the default-size player can be larger on short windows.

## Limitations
- This is a patch on someone else's site. YouTube can rename flags or elements at any time, and the
  extension will need updating. If the layout test is rolled back, the extension does little.
- It is tested on Chromium-based browsers. Firefox 128+ is targeted but less tested.

## Run from source (developers)
The `src/` folder alone is not loadable, because its manifest is generated per browser. Run
`python3 build.py`, unzip a package from `dist/`, and load that folder as described above.

## Build
```
python3 build.py                                  # writes dist/*.zip
GECKO_ID=classic-watch-layout@you.github.io python3 build.py   # set your Firefox add-on ID
```

## Contributing
Issues and pull requests are welcome. If YouTube changes something, the most useful bug report includes
a screenshot and the output of this snippet pasted into the DevTools console on a watch page:

```js
Object.keys(yt.config_.EXPERIMENT_FLAGS).filter(k => /watch|grid|theater|panel|rail/.test(k) && yt.config_.EXPERIMENT_FLAGS[k])
```

## License
MIT. See [LICENSE](LICENSE) and [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).
