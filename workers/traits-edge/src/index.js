/**
 * traits.grudge.studio edge — DNS + proxy onto ui.grudge-studio.com Main Panel.
 * Not a second Trait Store. Paperdoll SSOT stays equipment-paperdoll.js.
 */
const ORIGIN = "https://ui.grudge-studio.com";
const CANONICAL_HOST = "traits.grudge.studio";

const ALIAS_HOSTS = new Set([
  "trait.grudge.studio",
  "trait.grudge-studio.com",
  "traits.grudge-studio.com",
]);

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const host = url.hostname.toLowerCase();

    if (ALIAS_HOSTS.has(host)) {
      url.hostname = CANONICAL_HOST;
      url.protocol = "https:";
      return Response.redirect(url.toString(), 301);
    }

    const out = new URL(request.url);
    out.protocol = "https:";
    out.host = "ui.grudge-studio.com";
    if (out.pathname === "/" || out.pathname === "") {
      out.pathname = "/main-panel.html";
      if (!out.searchParams.has("tab")) out.searchParams.set("tab", "equipment");
      if (!out.searchParams.has("era")) out.searchParams.set("era", "warlords");
    }

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders(request) });
    }

    if (url.pathname === "/api/health") {
      return json(
        {
          ok: true,
          service: "grudge-traits",
          host: "https://traits.grudge.studio",
          origin: ORIGIN,
          layout: "unity-trait-store",
          uuidAlgorithm: "sha1(grudge-asset:{r2Key}) RFC-4122 v5",
        },
        request,
      );
    }

    if (url.pathname === "/api/traits/lookup") {
      return lookupMesh(url, request);
    }

    const headers = new Headers(request.headers);
    headers.delete("host");
    const init = { method: request.method, headers, redirect: "manual" };
    if (request.method !== "GET" && request.method !== "HEAD") {
      init.body = request.body;
    }

    const res = await fetch(out.toString(), init);
    const outHeaders = new Headers(res.headers);
    const cors = corsHeaders(request);
    cors.forEach((v, k) => outHeaders.set(k, v));
    return new Response(res.body, {
      status: res.status,
      statusText: res.statusText,
      headers: outHeaders,
    });
  },
};

let meshIndexCache = null;
let meshIndexAt = 0;

async function loadMeshIndex() {
  if (meshIndexCache && Date.now() - meshIndexAt < 5 * 60 * 1000) return meshIndexCache;
  const res = await fetch(ORIGIN + "/data/mesh-showcase-index.json");
  if (!res.ok) throw new Error("mesh index " + res.status);
  meshIndexCache = await res.json();
  meshIndexAt = Date.now();
  return meshIndexCache;
}

async function lookupMesh(url, request) {
  const uuid = (url.searchParams.get("uuid") || "").toLowerCase();
  const meshId = (url.searchParams.get("meshId") || "").toLowerCase();
  const q = (url.searchParams.get("q") || uuid || meshId).toLowerCase();
  if (q.length < 2) {
    return json({ error: "uuid, meshId, or q (min 2 chars)", hits: [] }, request, 400);
  }
  const idx = await loadMeshIndex();
  const hits = [];
  for (const [race, rec] of Object.entries(idx.races || {})) {
    for (const it of rec.items || []) {
      const blob = `${it.defUuid} ${it.meshId} ${it.name} ${it.r2Key}`.toLowerCase();
      const exact =
        (uuid && it.defUuid.toLowerCase() === uuid) ||
        (meshId && it.meshId.toLowerCase() === meshId);
      if (exact || blob.includes(q)) hits.push({ race, ...it });
    }
  }
  return json(
    {
      q,
      total: hits.length,
      algorithm: idx.algorithm,
      hits: hits.slice(0, 80),
    },
    request,
  );
}

function json(body, request, status) {
  const h = corsHeaders(request);
  h.set("Content-Type", "application/json; charset=utf-8");
  h.set("Cache-Control", "public, max-age=60");
  return new Response(JSON.stringify(body), { status: status || 200, headers: h });
}

function corsHeaders(request) {
  const origin = request.headers.get("Origin") || "*";
  return new Headers({
    "Access-Control-Allow-Origin": origin,
    Vary: "Origin",
    "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
    "Access-Control-Allow-Headers":
      "Content-Type, Authorization, X-Grudge-Token, X-API-Key",
    "Access-Control-Allow-Credentials": origin === "*" ? "false" : "true",
  });
}
