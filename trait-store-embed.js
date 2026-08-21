/**
 * Fleet helper — embed Trait Store + look up mesh definition UUIDs.
 *   <script src="https://traits.grudge.studio/trait-store-embed.js"></script>
 *   GrudgeTraitStore.embedUrl({ era: "warlords", characterId })
 *   await GrudgeTraitStore.lookup("WK_weapon_spear")
 */
(function (global) {
  "use strict";

  var HOST = "https://traits.grudge.studio";
  if (typeof location !== "undefined" && /traits?\.grudge(-studio)?\.(studio|com)$/i.test(location.hostname)) {
    HOST = location.origin;
  }

  function getJson(path) {
    return fetch(HOST + path, { cache: "no-cache", credentials: "omit" }).then(function (r) {
      if (!r.ok) throw new Error(path + " " + r.status);
      return r.json();
    });
  }

  function embedUrl(opts) {
    opts = opts || {};
    var u = new URL(HOST + "/");
    if (opts.embed !== false) u.searchParams.set("embed", "1");
    u.searchParams.set("tab", opts.tab || "equipment");
    u.searchParams.set("era", opts.era || "warlords");
    u.searchParams.set("layout", opts.layout || "unity");
    if (opts.characterId) u.searchParams.set("characterId", String(opts.characterId));
    if (opts.from) u.searchParams.set("from", opts.from);
    return u.toString();
  }

  function iframeHtml(opts) {
    var src = embedUrl(opts);
    var h = (opts && opts.height) || 720;
    return (
      '<iframe src="' +
      src.replace(/"/g, "&quot;") +
      '" title="Grudge Trait Store" style="width:100%;height:' +
      h +
      'px;border:0;background:#0a0705" allow="fullscreen"></iframe>'
    );
  }

  global.GrudgeTraitStore = {
    HOST: HOST,
    embedUrl: embedUrl,
    iframeHtml: iframeHtml,
    contract: function () {
      return getJson("/api/traits");
    },
    health: function () {
      return getJson("/api/health");
    },
    meshes: function () {
      return getJson("/api/traits/meshes");
    },
    sockets: function () {
      return getJson("/api/traits/sockets");
    },
    lookup: function (q) {
      var u = "/api/traits/lookup?q=" + encodeURIComponent(String(q || ""));
      return getJson(u);
    },
    lookupUuid: function (uuid) {
      return getJson("/api/traits/lookup?uuid=" + encodeURIComponent(String(uuid || "")));
    },
  };
})(typeof window !== "undefined" ? window : globalThis);
