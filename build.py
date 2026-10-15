#!/usr/bin/env python3
"""Builds store packages into dist/.

  python build.py                          -> dist/*-chromium.zip (Chrome + Edge) and dist/*-firefox.zip
  GECKO_ID=you@example.org python build.py -> sets the Firefox add-on ID

Firefox needs an add-on ID (e.g. classic-watch-layout@yourname.github.io). Pick it once and never change it.
"""
import json, os, zipfile

ROOT = os.path.dirname(os.path.abspath(__file__))
SRC, DIST = os.path.join(ROOT, "src"), os.path.join(ROOT, "dist")
GECKO_ID = os.environ.get("GECKO_ID", "classic-watch-layout@REPLACE-ME.example")

base = json.load(open(os.path.join(SRC, "manifest.base.json")))
version = base["version"]

chromium = dict(base)
chromium["minimum_chrome_version"] = "111"  # needed for content scripts with world: MAIN

firefox = json.loads(json.dumps(base))
firefox["browser_specific_settings"] = {
    "gecko": {
        "id": GECKO_ID,
        "strict_min_version": "128.0",  # content scripts with world: MAIN
        "data_collection_permissions": {"required": ["none"]},
    }
}
firefox["host_permissions"] = ["https://www.youtube.com/*", "https://m.youtube.com/*"]

def pack(name, manifest):
    os.makedirs(DIST, exist_ok=True)
    out = os.path.join(DIST, f"classic-watch-layout-{version}-{name}.zip")
    with zipfile.ZipFile(out, "w", zipfile.ZIP_DEFLATED) as z:
        z.writestr("manifest.json", json.dumps(manifest, indent=2))
        for f in sorted(os.listdir(SRC)):
            if f != "manifest.base.json":
                z.write(os.path.join(SRC, f), f)
    print("built", out)

pack("chromium", chromium)
pack("firefox", firefox)
if "REPLACE-ME" in GECKO_ID:
    print("WARNING: set GECKO_ID before submitting the Firefox package (see build.py).")
