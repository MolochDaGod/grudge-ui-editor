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
