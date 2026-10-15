# Store listing text (copy and paste)

## Name
Classic Watch Layout for YouTube

## Short description (max 132 characters)
Restores the classic YouTube watch page: comments below the video, recommendations on the right, and theater mode.

## Detailed description
YouTube is testing a new desktop watch page that moves comments and the description into a side panel,
shows oversized recommendations under the player, and shrinks the video. This extension puts the
classic layout back.

What it does
- Comments and description sit under the video again
- Recommendations return to the right-hand column at normal size
- Removes the Description / Comments / Ask side strip
- Optional: always open videos in theater mode
- Optional: hide Premium upsells

How to use
Install it, then reload YouTube. Click the extension icon to turn any of the three options on or off.

Privacy
No data is collected or sent anywhere. It only runs on youtube.com and has no servers, tracking, or
remote code. The source code is open (MIT).

Note
YouTube changes its site often, so this may need updates. If it stops working, please open an issue on
the project page.

Not affiliated with or endorsed by YouTube or Google. YouTube is a trademark of Google LLC.

## Category suggestions
Chrome: Productivity (or Fun).  Edge: Productivity.  Firefox: Appearance (or Other).

## Chrome Web Store "Privacy practices" tab
- Single purpose: Restores the classic layout of the YouTube watch page.
- storage: Saves the user's three on/off settings.
- Host permission (youtube.com): The extension's scripts and styles must run on YouTube pages to change
  the watch page layout. It does not read account data, history, or comments.
- Remote code: No. All code is packaged in the extension.
- Data usage: Collects none of the listed data types. Certify that data is not sold, not used for
  unrelated purposes, and not used for creditworthiness.
- Privacy policy URL: link to PRIVACY.md in your GitHub repository (the web view of the file).

## Notes for reviewers (Chrome, Edge, Firefox)
This extension changes the layout of a YouTube experiment that only some accounts are enrolled in, so
reviewers may not see the new layout. The code is plain, unminified JavaScript. `src/watch-layout.js`
runs in the page's own JavaScript context (content script `world: MAIN`) because YouTube's layout
flags and the watch page element's properties are not reachable from the isolated content-script
world. It only sets a few YouTube experiment flags to false, adjusts the watch page element, and can
click the player's theater-mode button. It makes no network requests and loads no remote code.
Settings are passed to it through a small `ytc-settings` key in the page's localStorage.
Source: <your GitHub repository URL>. No build step: the zip is the `src/` folder plus a generated manifest.

## Screenshots to take (you must do these yourself)
1. Before/after of the watch page (new layout vs classic). 1280x800 for Chrome/Edge.
2. The popup with the three switches.
Crop out your account avatar and any personal info. Check each store dashboard for any
additional promo-image sizes it asks for.
