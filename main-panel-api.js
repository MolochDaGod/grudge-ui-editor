/**
 * Grudge Main Panel API — era slots, tabs, icons, chrome.
 *
 * Static JSON on ui.grudge-studio.com (no Node). Fleet games load this file:
 *   <script src="https://ui.grudge-studio.com/main-panel-api.js"></script>
 *   const era = await GrudgeMainPanelApi.loadEra("warlords");
 *
 * Endpoints:
 *   GET /api/eras              → eras/index.json
 *   GET /api/main-panel        → data/main-panel-contract.json
 *   GET /api/main-panel/:era   → eras/:era.json
 */
(function (global) {
  "use strict";

  var CDN = "https://assets.grudge-studio.com";
  var HOST = "https://ui.grudge-studio.com";
  var SEP = " · ";
  var EMPTY = "—";

  var indexCache = null;
  var eraCache = Object.create(null);

  function urlsFor(path) {
    var rel = path.charAt(0) === "/" ? path : "/" + path;
    var out = [rel, HOST + rel];
    if (typeof location !== "undefined" && location.origin && location.origin.indexOf("grudge-studio.com") !== -1) {
      out.unshift(location.origin + rel);
    }
    return out;
  }

  async function fetchFirst(paths) {
    var lastErr = null;
    for (var i = 0; i < paths.length; i++) {
      try {
        var res = await fetch(paths[i], { credentials: "omit" });
        if (res.ok) return await res.json();
        lastErr = new Error(paths[i] + " " + res.status);
      } catch (e) {
        lastErr = e;
      }
    }
    throw lastErr || new Error("main-panel-api: fetch failed");
  }

  async function loadIndex() {
    if (indexCache) return indexCache;
    indexCache = await fetchFirst(urlsFor("/api/eras").concat(urlsFor("/eras/index.json")));
    if (indexCache && indexCache.chrome) {
      if (indexCache.chrome.separator) SEP = indexCache.chrome.separator;
      if (indexCache.chrome.empty) EMPTY = indexCache.chrome.empty;
    }
    return indexCache;
  }

  async function loadEra(id) {
    var key = String(id || "warlords").toLowerCase().trim();
    if (eraCache[key]) return eraCache[key];
    var data = await fetchFirst(
      urlsFor("/api/main-panel/" + key).concat(urlsFor("/eras/" + key + ".json")),
    );
    eraCache[key] = data;
    return data;
  }

  async function loadContract() {
    try {
      return await fetchFirst(urlsFor("/api/main-panel").concat(urlsFor("/data/main-panel-contract.json")));
    } catch (e) {
      return { version: "1.1.0", defaultEra: "warlords", chrome: { separator: SEP, empty: EMPTY } };
    }
  }

  function iconUrl(slotOrPath) {
    if (!slotOrPath) return CDN + "/icons/pack/misc/Effect.png";
    var p = typeof slotOrPath === "string" ? slotOrPath : slotOrPath.icon;
    if (!p) return CDN + "/icons/pack/misc/Effect.png";
    if (/^(https?:|data:|blob:)/i.test(p)) return p;
    return CDN + (p.charAt(0) === "/" ? p : "/" + p);
  }

  function listSlots(eraDoc) {
    var s = (eraDoc && eraDoc.slots) || {};
    return [].concat(s.left || [], s.right || [], s.bottom || []);
  }

  function join() {
    var parts = [];
    for (var i = 0; i < arguments.length; i++) {
      var v = arguments[i];
      if (v != null && String(v).trim()) parts.push(String(v).trim());
    }
    return parts.join(SEP);
  }

  global.GrudgeMainPanelApi = {
    CDN: CDN,
    HOST: HOST,
    separator: function () {
      return SEP;
    },
    empty: function () {
      return EMPTY;
    },
    loadIndex: loadIndex,
    loadEra: loadEra,
    loadContract: loadContract,
    iconUrl: iconUrl,
    listSlots: listSlots,
    join: join,
  };
})(typeof window !== "undefined" ? window : globalThis);
