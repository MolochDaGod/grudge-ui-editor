/**
 * Grudge AI — shared client for ui.grudge-studio.com (UI Kit + Studio).
 * Fallback: user API key → Puter (signed-in) → Grudge hub (server key via proxy path).
 */
(function (global) {
  const HUB = "https://ai.grudge-studio.com";
  const AUTH = "https://id.grudge-studio.com";
  const KEY_LS = "gsk";

  /** Pick up Grudge ID launch tokens from auth redirect (?grudge_token= / ?sso_token=). */
  function pickupAuthFromUrl() {
    try {
      const qs = new URLSearchParams(global.location.search);
      const token = qs.get("grudge_token") || qs.get("sso_token") || qs.get("token");
      if (!token) return;
      global.localStorage?.setItem("grudge_auth_token", token);
      const gid = qs.get("grudge_id");
      const un = qs.get("grudge_username") || qs.get("username");
      if (gid) global.localStorage?.setItem("grudge_id", gid);
      if (un) global.localStorage?.setItem("grudge_username", un);
      ["grudge_token", "sso_token", "token", "grudge_id", "grudge_username", "username"].forEach((k) =>
        qs.delete(k)
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

  function loggedIn() {
    if (global.GrudgeCloud?.isLoggedIn?.()) return true;
    try {
      if (typeof puter !== "undefined" && puter.auth?.isSignedIn?.()) return true;
    } catch {}
    try {
      const token = global.localStorage?.getItem("grudge_auth_token");
      if (token) {
        const p = JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
        if (p?.exp && p.exp * 1000 <= Date.now()) return false;
      }
      return !!(token || global.localStorage?.getItem("grudge_id"));
    } catch {
      return false;
    }
  }

  function login(returnUrl) {
    const ret = returnUrl || global.location.href;
    global.location.href =
      AUTH + "/api/auth/page?app=ui-editor&redirect=" + encodeURIComponent(ret);
  }

  async function hubHealth() {
    try {
      const h = await fetch(HUB + "/health", { credentials: "omit" });
      const d = await h.json();
      return d.status === "ok";
    } catch {
      return false;
    }
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

  async function chat({ system, messages, max_tokens, key }) {
    const apiKey = (key || getUserKey()).trim();
    const errs = [];

    if (apiKey.startsWith("sk-ant")) {
      try {
        return await anthropicChat({ system, messages, max_tokens, key: apiKey });
      } catch (e) {
        errs.push("anthropic:" + e.message);
      }
    }

    if (loggedIn()) {
      try {
        return await puterChat({ system, messages, max_tokens });
      } catch (e) {
        errs.push("puter:" + e.message);
      }
    }

    throw new Error(
      (loggedIn() ? "AI request failed. " : "Sign in with Grudge ID or paste an Anthropic key (sk-ant-…). ") +
        errs.join("; ")
    );
  }

  const UIKIT_SYS = `You are the Grudge UI Kit AI Director. Given a theme editor state, respond ONLY with JSON:
{"patch":{"theme?":"fantasy|cyberpunk|fps|rpg","overrides?":{...css vars...},"fontScale?":number,"genre?":string,"skillSet?":string,"artPreset?":string},"message":"short human summary"}
Use palette keys from the payload. No markdown fences.`;

  async function configureUIKit(payload) {
    const user = "Current state:\n" + JSON.stringify(payload.current || {}, null, 2) +
      "\n\nUser request: " + (payload.prompt || "");
    const text = await chat({
      system: UIKIT_SYS,
      messages: [{ role: "user", content: user }],
      max_tokens: 2048,
    });
    const jm = text.match(/\{[\s\S]*\}/);
    if (!jm) throw new Error("No JSON in AI response");
    return JSON.parse(jm[0]);
  }

  const GrudgeAI = {
    HUB,
    AUTH,
    hubHealth,
    loggedIn,
    login,
    getUserKey,
    setUserKey,
    chat,
    configureUIKit,
    async probe() {
      const ok = await hubHealth();
      return { hubOk: ok, loggedIn: loggedIn(), ready: ok && loggedIn() };
    },
    isReady() {
      return loggedIn() || !!getUserKey().startsWith("sk-ant");
    },
    statusLabel() {
      if (this.isReady()) return "Grudge AI ready";
      return "Sign in for Grudge AI";
    },
  };

  global.GrudgeAI = GrudgeAI;
})(typeof window !== "undefined" ? window : globalThis);