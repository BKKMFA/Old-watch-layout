// Classic Watch Layout for YouTube: watch-page layout restorer. Runs in the PAGE's own JS world
// (needed to reach YouTube's flags and element properties).
// Approach adapted from the MIT-licensed "YouTube Classic Watch Layout" by David Luttrull:
// https://github.com/davidluttrull/youtube-classic-watch-layout
(function () {
  if (window.__ytcWatchLayout) return;
  window.__ytcWatchLayout = true;

  const html = document.documentElement;
  const DEFAULTS = { classicWatch: true, autoTheater: true };

  // Settings mirror written by content.js (storage.sync is async; localStorage is instant).
  function on(name) {
    try {
      const c = JSON.parse(localStorage.getItem("ytc-settings"));
      if (c && name in c) return !!c[name];
    } catch (e) {}
    return DEFAULTS[name];
  }

  const OFF_FLAGS = [
    // layout / side rail
    "web_watch_split_scroll", "swatcheroo_split_scroll", "web_watch_fixed_default_panels",
    "web_fixed_panel_watch_next", "web_fixed_panel_watch_next_grid_swap", "enable_web_side_rail",
    "web_side_rail_dismissible_panels", "web_side_rail_default_dismissed_panels", "web_side_rail_with_border",
    // big recommendation grid under the player
    "web_watch_eligible_to_switch_to_grid", "web_watch_enable_single_column_grid_view", "web_watch_hero_list",
    "web_live_chat_panel_watch_next_grid_swap",
    // description/comments moved into the side panel
    "web_engagement_panel_show_description", "web_watch_move_summary_to_sd",
    "kevlar_watch_hide_comments_while_panel_open",
    // theater button removal
    "disable_theater_mode"
  ];

  // Numeric flags to override. YouTube reserves this many px under the player when sizing it
  // (default 232), which caps the default-view player on short windows.
  const NUM_FLAGS = { kevlar_watch_flexy_metadata_height: 100 };

  function patchFlagObj(flags) {
    if (!flags || typeof flags !== "object" || !on("classicWatch")) return;
    for (const k in NUM_FLAGS) {
      try { Object.defineProperty(flags, k, { configurable: true, enumerable: true, get() { return NUM_FLAGS[k]; }, set() {} }); } catch (e) {}
    }
    for (const k of OFF_FLAGS) {
      try {
        if (!flags[k]) continue;
        (window.__ytcForced = window.__ytcForced || []).push(k);
        Object.defineProperty(flags, k, { configurable: true, enumerable: true, get() { return false; }, set() {} });
      } catch (e) { try { flags[k] = false; } catch (e2) {} }
    }
  }

  function patchFlags() {
    try { if (window.ytcfg && ytcfg.get) patchFlagObj(ytcfg.get("EXPERIMENT_FLAGS")); } catch (e) {}
    try { if (window.yt && yt.config_) patchFlagObj(yt.config_.EXPERIMENT_FLAGS); } catch (e) {}
  }

  // ---- Earliest possible hook: flip the flags BEFORE YouTube builds the page/player ----
  function wrapCfg(cfg) {
    try {
      if (!cfg || typeof cfg.set !== "function" || cfg.__ytcWrapped) return;
      const orig = cfg.set;
      cfg.set = function (a, b) {
        try {
          if (a && typeof a === "object" && a.EXPERIMENT_FLAGS) patchFlagObj(a.EXPERIMENT_FLAGS);
          else if (a === "EXPERIMENT_FLAGS") patchFlagObj(b);
        } catch (e) {}
        return orig.apply(this, arguments);
      };
      cfg.__ytcWrapped = true;
    } catch (e) {}
  }
  try {
    if (window.ytcfg) wrapCfg(window.ytcfg);
    else {
      let v;
      Object.defineProperty(window, "ytcfg", {
        configurable: true, enumerable: true,
        get() { return v; },
        set(x) { v = x; wrapCfg(x); }
      });
    }
  } catch (e) {}


  // Watch a property: run cb on the current value and on every later assignment.
  function watch(obj, key, cb) {
    try {
      let val = obj[key];
      const d = Object.getOwnPropertyDescriptor(obj, key);
      if (!d || d.configurable) {
        Object.defineProperty(obj, key, {
          configurable: true, enumerable: true,
          get() { return val; },
          set(v) { val = v; if (v && typeof v === "object") { try { cb(v); } catch (e) {} } }
        });
      }
      if (val && typeof val === "object") cb(val);
    } catch (e) {}
  }
  watch(window, "yt", (yt) =>
    watch(yt, "config_", (cfg) =>
      watch(cfg, "EXPERIMENT_FLAGS", (flags) => patchFlagObj(flags))));

  let switched = false;
  const nudge = () => setTimeout(() => window.dispatchEvent(new Event("resize")), 100);

  function showComments() {
    const c = document.querySelector("ytd-watch-flexy ytd-comments#comments");
    if (c && c.hidden && c.data) { c.hidden = false; nudge(); }
  }

  function fixFlexy() {
    if (!on("classicWatch")) return;
    const f = document.querySelector("ytd-watch-flexy");
    if (!f) return;
    if (switched) showComments();

    const isNewLayout =
      f.fixedDefaultPanels || f.sideRailDismissiblePanels || f.fixedPanelWatchNext ||
      f.splitScroll || f.showFixedSideMenu || f.fixedSideMenu ||
      f.hasAttribute("split-scroll") || f.hasAttribute("show-fixed-side-menu");
    if (!isNewLayout) return;
    switched = true;

    try {
      f.sideRailDismissiblePanels = false;
      f.fixedPanelWatchNext = false;
      f.fixedDefaultPanels = false;
      f.fixedSideMenu = null; // removes the Description / Comments / Ask strip
      if (typeof f._setProperty === "function") f._setProperty("splitScroll", false);
      else f.splitScroll = false;
    } catch (e) { console.warn("[YouTube Classic]", e); }

    ["split-scroll", "using-fixed-panel", "fixed-default-panels", "show-fixed-side-menu",
     "side-rail-dismissible-panels", "fixed-panel-watch-next", "side-rail-with-border"]
      .forEach((a) => f.removeAttribute(a));

    try { if (typeof f.updateWatchFeedLocation === "function") f.updateWatchFeedLocation(f.isTwoColumns_); } catch (e) {}
    const related = document.querySelector("ytd-watch-flexy #related");
    const inner = document.querySelector("ytd-watch-flexy #secondary-inner");
    if (f.isTwoColumns_ && related && inner && !inner.contains(related)) inner.appendChild(related);

    document.querySelectorAll(
      'ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-comments-section"],' +
      'ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-structured-description"]'
    ).forEach((p) => p.setAttribute("visibility", "ENGAGEMENT_PANEL_VISIBILITY_HIDDEN"));

    showComments();
    nudge();
  }

  // ---- Theater mode by default (works even if the size button is missing) ----
  const theater = { url: "", done: false, tries: 0 };
  function autoTheater() {
    if (!on("autoTheater") || location.pathname !== "/watch") return;
    const f = document.querySelector("ytd-watch-flexy");
    if (!f) return;
    if (theater.url !== location.href) { theater.url = location.href; theater.done = false; theater.tries = 0; }
    if (f.hasAttribute("theater")) { theater.done = true; return; }
    if (theater.done || theater.tries >= 15 || !document.querySelector("#movie_player")) return;
    theater.tries++;

    const btn = document.querySelector(".ytp-size-button");
    if (btn) { btn.click(); return; }
    // No button: ask YouTube directly
    try {
      const detail = { enabled: true };
      document.dispatchEvent(new CustomEvent("yt-set-theater-mode-enabled", { detail, bubbles: true, composed: true }));
      const app = document.querySelector("ytd-app");
      if (app) app.dispatchEvent(new CustomEvent("yt-set-theater-mode-enabled", { detail, bubbles: true, composed: true }));
    } catch (e) {}
    try {
      if (!f.hasAttribute("theater")) {
        if (typeof f.set === "function") f.set("theaterRequested_", true);
        else f.theaterRequested_ = true;
      }
    } catch (e) {}
    nudge();
  }

  function run() { patchFlags(); fixFlexy(); autoTheater(); }

  let ticks = 0;
  const early = setInterval(() => { run(); if (++ticks > 400) clearInterval(early); }, 50);
  setInterval(autoTheater, 700);

  ["yt-navigate-start", "yt-navigate-finish", "yt-page-data-updated"].forEach((ev) =>
    document.addEventListener(ev, () => { run(); setTimeout(run, 500); setTimeout(run, 1500); })
  );

  let queued = false;
  const runSoon = () => { if (queued) return; queued = true; requestAnimationFrame(() => { queued = false; run(); }); };
  new MutationObserver(runSoon).observe(html, {
    subtree: true, attributes: true,
    attributeFilter: ["split-scroll", "show-fixed-side-menu", "using-fixed-panel", "hidden", "theater"]
  });
})();
