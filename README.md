# Classic Watch Layout for YouTube

A small browser extension (Chrome, Edge, Firefox) that restores YouTube's classic desktop watch page
after the October 2026 layout test:

- Comments and description go back **under the video**
- Recommendations go back to the **right-hand column**, at normal size
- Optional: **always open videos in theater mode**
- Optional: hide Premium upsells

The popup has three switches; reload the YouTube tab after changing one.

> Not affiliated with or endorsed by YouTube or Google. "YouTube" is a trademark of Google LLC.

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

## Install from source
- **Chrome / Edge:** `chrome://extensions` or `edge://extensions` -> Developer mode -> Load unpacked -> choose `src/` after running `python build.py` and unzipping `dist/*-chromium.zip`, or load the unzipped package.
- **Firefox:** `about:debugging` -> This Firefox -> Load Temporary Add-on -> pick `manifest.json` from the unzipped `dist/*-firefox.zip`.

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
