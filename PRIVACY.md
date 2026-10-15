# Privacy policy: Classic Watch Layout for YouTube

**This extension does not collect, transmit, sell, or share any personal data.**

- It runs only on youtube.com pages and changes how the watch page is laid out.
- It has no servers, no analytics, no tracking, and makes no network requests of its own.
- It loads no remote code. All code ships inside the extension and is open source.

**What it stores**
- Your three on/off settings (classic watch page, always theater mode, hide Premium upsells), saved
  with the browser's extension storage (`storage.sync`). If your browser account has sync turned on,
  the browser itself may sync them across your devices. The developer never receives them.
- A copy of two of those settings in the youtube.com page's `localStorage` under the key
  `ytc-settings`, so the page script can read them instantly. It contains only true/false values.

**What it can access**
- Pages on youtube.com, to apply the layout changes. It does not read your account, watch history,
  comments, or video data.

Questions: open an issue at the project's GitHub repository.
Last updated: October 2026.
