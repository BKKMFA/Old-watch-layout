// Classic Watch Layout for YouTube: applies user settings as attributes on <html>; content.css does the rest.
const DEFAULTS = {
  classicWatch: true, // comments under video, recommendations on the right
  autoTheater: true,  // start videos in theater mode
  hidePremium: false  // hide Premium upsells
};

function apply(s) {
  const root = document.documentElement;
  ["classicWatch", "autoTheater", "hidePremium"].forEach((k) => {
    root.toggleAttribute("data-ytc-" + k, !!s[k]);
  });
  // Mirror for the page-world script (storage.sync is async, localStorage is instant)
  try {
    localStorage.setItem("ytc-settings", JSON.stringify({ classicWatch: !!s.classicWatch, autoTheater: !!s.autoTheater }));
  } catch (e) {}
}

chrome.storage.sync.get(DEFAULTS, apply);
chrome.storage.onChanged.addListener(() => chrome.storage.sync.get(DEFAULTS, apply));
