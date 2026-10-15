const DEFAULTS = { classicWatch: true, autoTheater: true, hidePremium: false };

chrome.storage.sync.get(DEFAULTS, (s) => {
  Object.keys(DEFAULTS).forEach((id) => {
    const el = document.getElementById(id);
    el.checked = !!s[id];
    el.addEventListener("change", () => chrome.storage.sync.set({ [id]: el.checked }));
  });
});
