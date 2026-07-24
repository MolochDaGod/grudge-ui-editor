/**
 * Grudge AI — shared client for ui.grudge-studio.com (UI Kit + Studio + HYDRA).
 *
 * Priority:
 *   1) AI Hub (ai.grudge-studio.com) with Grudge JWT — same-origin /api/ai when on Vercel
 *   2) Puter AI (user-pays, signed-in Puter)
 *   3) User Anthropic key (sk-ant-… in localStorage "gsk")
 *
 * Roles: ui (kits/HUD/radials), ux (flows), general, …
 */
(function (global) {
  const HUB = "https://ai.grudge-studio.com";
  const AUTH = "https://id.grudge-studio.com";
  const KEY_LS = "gsk";
  const TOKEN_LS = "grudge_auth_token";

  /** Same-origin AI proxy when hosted on Vercel (vercel.json /api/ai/*). */
  function aiBase() {
    try {
      if (global.location && /grudge-studio\.com$|\.vercel\.app$|localhost/.test(global.location.hostname)) {
        return "/api/ai";
      }
    } catch {}
    return HUB + "/v1";
  }

  function hubRoot() {
    try {
      if (global.location && /grudge-studio\.com$|\.vercel\.app$|localhost/.test(global.location.hostname)) {
        return ""; // relative /api/ai/health
      }
    } catch {}
    return HUB;
  }

  /** Pick up Grudge ID launch tokens from auth redirect (?grudge_token= / ?sso_token=). */
  function pickupAuthFromUrl() {
    try {
      const qs = new URLSearchParams(global.location.search);
      const token = qs.get("grudge_token") || qs.get("sso_token") || qs.get("token");
      if (!token) return;
      global.localStorage?.setItem(TOKEN_LS, token);
      const gid = qs.get("grudge_id");
      const un = qs.get("grudge_username") || qs.get("username");
      if (gid) global.localStorage?.setItem("grudge_id", gid);
      if (un) global.localStorage?.setItem("grudge_username", un);
      ["grudge_token", "sso_token", "token", "grudge_id", "grudge_username", "username"].forEach((k) =>
        qs.delete(k),
      );
      const tail = qs.toString();
      const clean =
        global.location.pathname + (tail ? "?" + tail : "") + (global.location.hash || "");
      global.history.replaceState({}, "", clean);
    } catch {}
  }

  pickupAuthFromUrl();

  function getUserKey() {
    try {
      return (global.localStorage?.getItem(KEY_LS) || "").trim();
    } catch {
      return "";
    }
  }

  function setUserKey(v) {
    try {
      global.localStorage?.setItem(KEY_LS, v || "");
    } catch {}
  }

  function getJwt() {
    try {
      return (global.localStorage?.getItem(TOKEN_LS) || "").trim();
    } catch {
      return "";
    }
  }

  function loggedIn() {
    if (global.GrudgeCloud?.isLoggedIn?.()) return true;
    try {
      if (typeof puter !== "undefined" && puter.auth?.isSignedIn?.()) return true;
    } catch {}
    try {
      const token = getJwt();
      if (token) {
        const p = JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
        if (p?.exp && p.exp * 1000 <= Date.now()) return false;
        return true;
      }
      return !!global.localStorage?.getItem("grudge_id");
    } catch {
      return false;
    }
  }

  function login(returnUrl) {
    const ret = returnUrl || global.location.href;
    global.location.href =
      AUTH + "/login?redirect_uri=" + encodeURIComponent(ret);
  }

  async function hubHealth() {
    try {
      const path = hubRoot() ? HUB + "/health" : "/api/ai/health";
      const h = await fetch(path, { credentials: "omit" });
      const d = await h.json();
      return d.status === "ok" || d.ok === true;
    } catch {
      return false;
    }
  }

  async function listAgents() {
    try {
      const path = hubRoot() ? HUB + "/v1/agents" : "/api/ai/agents";
      const r = await fetch(path, { credentials: "omit" });
      if (!r.ok) return [];
      const d = await r.json();
      return d.agents || [];
    } catch {
      return [];
    }
  }

  /**
   * Call AI Hub role chat.
   * @param {{ role?: string, system?: string, messages: Array, max_tokens?: number, message?: string }} opts
   */
  async function hubChat(opts) {
    const role = (opts && opts.role) || "ui";
    const token = getJwt();
    if (!token) throw new Error("No Grudge session JWT — sign in first");

    const base = aiBase(); // /api/ai or https://ai…/v1
    const url = base + "/agents/" + encodeURIComponent(role) + "/chat";

    const body = {
      max_tokens: (opts && opts.max_tokens) || 2048,
    };
    if (opts && opts.message) body.message = opts.message;
    if (opts && opts.messages) {
      // Hub role handler injects its own system prompt; user can still pass system as first msg
      body.messages = opts.system
        ? [{ role: "system", content: opts.system }, ...opts.messages]
        : opts.messages;
    } else if (opts && opts.system && opts.message) {
      body.messages = [
        { role: "system", content: opts.system },
        { role: "user", content: opts.message },
      ];
    }

    const r = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(body),
    });
    const d = await r.json().catch(() => ({}));
    if (!r.ok) {
      throw new Error(d.error || "AI Hub " + r.status);
    }
    return d.response || d.content || d.text || "";
  }

  async function anthropicChat({ system, messages, max_tokens, key }) {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
        "anthropic-dangerous-direct-browser-access": "true",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: max_tokens || 2048,
        system,
        messages,
      }),
    });
    const d = await r.json();
    if (!r.ok) throw new Error(d.error?.message || "Anthropic " + r.status);
    return d.content?.[0]?.text || "";
  }

  async function puterChat({ system, messages, max_tokens }) {
    if (typeof puter === "undefined" || !puter.ai) throw new Error("Puter SDK not loaded — sign in first");
    if (!puter.auth?.isSignedIn?.()) throw new Error("Sign in with Grudge ID for cloud AI");
    const msgs = system ? [{ role: "system", content: system }, ...messages] : messages;
    const resp = await puter.ai.chat(msgs, { model: "claude-3-5-sonnet", max_tokens: max_tokens || 2048 });
    if (typeof resp === "string") return resp;
    if (resp?.message?.content) {
      const c = resp.message.content;
      return typeof c === "string" ? c : c.map((x) => x.text || "").join("");
    }
    return resp?.text || resp?.response || "";
  }

  /**
   * Unified chat — hub (JWT) → Puter → Anthropic key.
   * @param {{ system?: string, messages?: Array, message?: string, max_tokens?: number, key?: string, role?: string }} opts
   */
  async function chat(opts) {
    opts = opts || {};
    const apiKey = (opts.key || getUserKey()).trim();
    const errs = [];
    const messages =
      opts.messages ||
      (opts.message ? [{ role: "user", content: opts.message }] : null);
    if (!messages || !messages.length) throw new Error('Provide "messages" or "message"');

    // 1) Fleet AI Hub with Grudge JWT
    if (getJwt()) {
      try {
        return await hubChat({
          role: opts.role || "ui",
          system: opts.system,
          messages,
          max_tokens: opts.max_tokens,
        });
      } catch (e) {
        errs.push("hub:" + e.message);
      }
    }

    // 2) User Anthropic key
    if (apiKey.startsWith("sk-ant")) {
      try {
        return await anthropicChat({
          system: opts.system,
          messages,
          max_tokens: opts.max_tokens,
          key: apiKey,
        });
      } catch (e) {
        errs.push("anthropic:" + e.message);
      }
    }

    // 3) Puter AI (user-pays)
    if (loggedIn()) {
      try {
        return await puterChat({
          system: opts.system,
          messages,
          max_tokens: opts.max_tokens,
        });
      } catch (e) {
        errs.push("puter:" + e.message);
      }
    }

    throw new Error(
      (getJwt() || loggedIn()
        ? "AI request failed. "
        : "Sign in with Grudge ID (or paste an Anthropic key sk-ant-…). ") + errs.join("; "),
    );
  }

  const UIKIT_SYS = `You are the Grudge UI Kit AI Director. Given a theme editor state, respond ONLY with JSON:
{"type":"uikit_patch","patch":{"theme?":"fantasy|cyberpunk|fps|rpg","overrides?":{...css vars...},"fontScale?":number,"genre?":string,"skillSet?":string,"artPreset?":string},"message":"short human summary"}
Use palette keys from the payload. No markdown fences.`;

  async function configureUIKit(payload) {
    const user =
      "Current state:\n" +
      JSON.stringify(payload.current || {}, null, 2) +
      "\n\nUser request: " +
      (payload.prompt || "");
    const text = await chat({
      role: "ui",
      system: UIKIT_SYS,
      messages: [{ role: "user", content: user }],
      max_tokens: 2048,
    });
    const jm = text.match(/\{[\s\S]*\}/);
    if (!jm) throw new Error("No JSON in AI response");
    return JSON.parse(jm[0]);
  }

  /** Generate a hold-key radial (Combat/Harvest/Mount style). */
  async function generateRadial(prompt) {
    const text = await chat({
      role: "ui",
      message:
        'Generate a radial menu JSON (type:"radial") for: ' +
        (prompt || "Combat / Harvest / Mount stance picker on hold Q"),
      max_tokens: 1024,
    });
    const jm = text.match(/\{[\s\S]*\}/);
    if (!jm) throw new Error("No JSON in AI response");
    return JSON.parse(jm[0]);
  }

  /** Generate hotkey bindings JSON. */
  async function generateHotkeys(prompt) {
    const text = await chat({
      role: "ui",
      message: 'Generate hotkeys JSON (type:"hotkeys") for: ' + (prompt || "default combat + harvest"),
      max_tokens: 1024,
    });
    const jm = text.match(/\{[\s\S]*\}/);
    if (!jm) throw new Error("No JSON in AI response");
    return JSON.parse(jm[0]);
  }

  const GrudgeAI = {
    HUB,
    AUTH,
    hubHealth,
    listAgents,
    hubChat,
    loggedIn,
    login,
    getUserKey,
    setUserKey,
    getJwt,
    chat,
    configureUIKit,
    generateRadial,
    generateHotkeys,
    async probe() {
      const ok = await hubHealth();
      const jwt = !!getJwt();
      return {
        hubOk: ok,
        loggedIn: loggedIn(),
        hasJwt: jwt,
        ready: ok && (jwt || loggedIn() || getUserKey().startsWith("sk-ant")),
        route: aiBase(),
      };
    },
    isReady() {
      return !!getJwt() || loggedIn() || getUserKey().startsWith("sk-ant");
    },
    statusLabel() {
      if (this.isReady()) return "Grudge AI ready";
      return "Sign in for Grudge AI";
    },
  };

  global.GrudgeAI = GrudgeAI;
})(typeof window !== "undefined" ? window : globalThis);
