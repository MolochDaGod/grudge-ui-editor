/**
 * CraftPix usage + swap resolver for ui.grudge-studio.com
 *
 * Loads /data/craftpix-usage.json and exposes:
 *   CraftpixSwaps.url(rel)
 *   CraftpixSwaps.layers(hydraType)
 *   CraftpixSwaps.applySwaps(hydraType, swapChoices)
 *   CraftpixSwaps.renderSlot(el, opts)  // correct layer stack + pixelated
 *   CraftpixSwaps.renderBar(el, pct, opts)
 *   CraftpixSwaps.loadUsage()
 *
 * CDN: same origin /assets/craftpix/  (323 PNGs)
 */
(function (global) {
  "use strict";

  var BASE = "/assets/craftpix/";
  /** Prefer API rewrite (vercel), then static data path. */
  var USAGE_URLS = ["/api/craftpix/usage", "/data/craftpix-usage.json"];
  var usageCache = null;

  function encodePath(rel) {
    return String(rel || "")
      .replace(/^\/+/, "")
      .split("/")
      .map(function (s) {
        return encodeURIComponent(s);
      })
      .join("/");
  }

  function url(rel) {
    if (!rel) return "";
    if (/^https?:\/\//i.test(rel)) return rel;
    if (rel.indexOf("/assets/") === 0) return rel;
    return BASE + encodePath(rel);
  }

  function loadUsage() {
    if (usageCache) return Promise.resolve(usageCache);
    function tryUrl(i) {
      if (i >= USAGE_URLS.length) {
        return Promise.reject(new Error("craftpix usage missing"));
      }
      return fetch(USAGE_URLS[i], { credentials: "omit" }).then(function (r) {
        if (!r.ok) return tryUrl(i + 1);
        return r.json();
      });
    }
    return tryUrl(0).then(function (j) {
      usageCache = j;
      if (j.baseUrl) BASE = j.baseUrl;
      return j;
    });
  }

  function resolveType(type, data) {
    var map = (data && data.hydraToLayers) || {};
    var node = map[type];
    if (!node) return null;
    if (node.extends && map[node.extends]) {
      var parent = map[node.extends];
      return {
        role: node.role || parent.role,
        layers: Object.assign({}, parent.layers || {}, node.layers || {}),
        swaps: Object.assign({}, parent.swaps || {}, node.swaps || {}),
        defaultSwaps: Object.assign(
          {},
          parent.defaultSwaps || {},
          node.defaultSwaps || {},
        ),
        usage: node.usage || parent.usage,
      };
    }
    return node;
  }

  function applySwaps(hydraType, swapChoices) {
    return loadUsage().then(function (data) {
      var node = resolveType(hydraType, data);
      if (!node) return { type: hydraType, layers: {}, usage: null };
      var layers = Object.assign({}, node.layers || {});
      var choices = Object.assign({}, node.defaultSwaps || {}, swapChoices || {});
      var swaps = node.swaps || {};
      Object.keys(choices).forEach(function (key) {
        var want = choices[key];
        var list = swaps[key] || [];
        for (var i = 0; i < list.length; i++) {
          if (list[i].id === want) {
            if (list[i].path != null) {
              if (key === "slotStyle" || key === "bg") layers.bg = list[i].path || layers.bg;
              else if (key === "border" && list[i].path) layers.border = list[i].path;
              else if (key === "hpFill") layers.hpFill = list[i].path;
              else if (key === "mpFill") layers.mpFill = list[i].path;
              else if (key === "fill") layers.fill = list[i].path;
              else if (list[i].path) layers[key] = list[i].path;
            }
            if (list[i].css) layers._css = (layers._css || "") + list[i].css + ";";
            break;
          }
        }
      });
      return {
        type: hydraType,
        layers: layers,
        usage: node.usage || null,
        role: node.role || null,
        urls: Object.keys(layers).reduce(function (acc, k) {
          if (k.indexOf("_") === 0) return acc;
          acc[k] = url(layers[k]);
          return acc;
        }, {}),
      };
    });
  }

  function layers(hydraType) {
    return applySwaps(hydraType, {});
  }

  /** Correct hotbar slot: bg → icon → overlay → cooldown → press */
  function renderSlot(el, opts) {
    opts = opts || {};
    return applySwaps("hotbar", opts.swaps).then(function (res) {
      var L = res.layers;
      var icon = opts.iconUrl || "";
      var cd = Math.max(0, Math.min(1, opts.cooldown || 0));
      el.classList.add("cpx-slot");
      el.style.cssText =
        "position:relative;width:" +
        (opts.size || 56) +
        "px;height:" +
        (opts.size || 56) +
        "px;image-rendering:pixelated;overflow:hidden";
      el.innerHTML =
        '<img class="cpx-slot__bg" alt="" src="' +
        url(L.bg) +
        '" style="position:absolute;inset:0;width:100%;height:100%;object-fit:fill;image-rendering:pixelated;pointer-events:none"/>' +
        (icon
          ? '<img class="cpx-slot__icon" alt="" src="' +
            icon +
            '" style="position:absolute;left:15%;top:15%;width:70%;height:70%;object-fit:contain;image-rendering:pixelated;pointer-events:none"/>'
          : "") +
        (L.overlay
          ? '<img class="cpx-slot__overlay" alt="" src="' +
            url(L.overlay) +
            '" style="position:absolute;inset:0;width:100%;height:100%;object-fit:fill;image-rendering:pixelated;pointer-events:none;opacity:.9"/>'
          : "") +
        (cd > 0 && L.cooldown
          ? '<img class="cpx-slot__cd" alt="" src="' +
            url(L.cooldown) +
            '" style="position:absolute;inset:8%;width:84%;height:84%;object-fit:fill;image-rendering:pixelated;pointer-events:none;opacity:' +
            (0.35 + cd * 0.55) +
            '"/>'
          : "") +
        (opts.key
          ? '<span style="position:absolute;right:2px;bottom:1px;font:700 10px/1 JetBrains Mono,monospace;color:#f4e6c8;text-shadow:1px 1px 0 #000">' +
            String(opts.key) +
            "</span>"
          : "");
      return res;
    });
  }

  function renderBar(el, pct, opts) {
    opts = opts || {};
    var type = opts.type || "healthbar";
    pct = Math.max(0, Math.min(100, Number(pct) || 0));
    return applySwaps(type, opts.swaps).then(function (res) {
      var L = res.layers;
      var fill = L.fill || L.hpFill || L.mpFill;
      el.classList.add("cpx-bar-wrap");
      el.style.cssText =
        "position:relative;width:100%;height:" +
        (opts.height || 14) +
        "px;overflow:hidden;image-rendering:pixelated;background:rgba(0,0,0,.45);border-radius:2px";
      el.innerHTML =
        (L.bg || L.track
          ? '<img alt="" src="' +
            url(L.bg || L.track) +
            '" style="position:absolute;inset:0;width:100%;height:100%;object-fit:fill;image-rendering:pixelated"/>'
          : "") +
        '<div style="position:absolute;left:0;top:0;bottom:0;width:' +
        pct +
        '%;overflow:hidden">' +
        (fill
          ? '<img alt="" src="' +
            url(fill) +
            '" style="height:100%;width:' +
            (10000 / Math.max(pct, 0.01)) +
            '%;max-width:none;object-fit:fill;image-rendering:pixelated' +
            (L._css ? ";" + L._css : "") +
            '"/>'
          : '<div style="height:100%;background:#c44"></div>') +
        "</div>";
      return res;
    });
  }

  function listUsageOptions() {
    return loadUsage().then(function (d) {
      return d.usageOptions || [];
    });
  }

  function listHydraTypes() {
    return loadUsage().then(function (d) {
      return Object.keys(d.hydraToLayers || {});
    });
  }

  global.CraftpixSwaps = {
    BASE: BASE,
    url: url,
    loadUsage: loadUsage,
    layers: layers,
    applySwaps: applySwaps,
    renderSlot: renderSlot,
    renderBar: renderBar,
    listUsageOptions: listUsageOptions,
    listHydraTypes: listHydraTypes,
  };
})(typeof window !== "undefined" ? window : globalThis);
