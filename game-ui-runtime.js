/**
 * Grudge Game UI Runtime — load saved fleet packs for any game.
 *
 * Usage:
 *   const ui = await GrudgeGameUI.load('warlords');
 *   ui.mount(document.getElementById('hud-root'));
 *   ui.setState('combat');
 *   ui.bindData({ pf1: { name: 'Korgath', hp: 900, hpMax: 1000 } });
 *
 * CDN: https://ui.grudge-studio.com/game-ui-runtime.js
 * Packs: https://ui.grudge-studio.com/game-ui-packs/index.json
 */
(function (global) {
  "use strict";

  const DEFAULT_BASE =
    (typeof location !== "undefined" && location.origin && location.origin.includes("grudge"))
      ? location.origin
      : "https://ui.grudge-studio.com";

  const THEME_VARS = {
    d: "--ca:#4ade80;--ct:#e2e4ef;--cb:rgba(74,222,128,.06);--slot:rgba(255,255,255,.05);--sb:rgba(74,222,128,.15)",
    f: "--ca:#d4960a;--ct:#e8d090;--cb:rgba(200,140,20,.12);--slot:rgba(5,3,1,.7);--sb:rgba(140,100,20,.4)",
    c: "--ca:#0ff;--ct:#c0f0ff;--cb:rgba(0,255,255,.08);--slot:rgba(0,3,8,.8);--sb:rgba(0,255,255,.2)",
    q: "--ca:#fff;--ct:#fff;--cb:rgba(255,255,255,.06);--slot:rgba(255,255,255,.06);--sb:rgba(255,255,255,.15)",
  };
  const THEME_BG = {
    d: "rgba(10,12,20,.92)",
    f: "rgba(12,7,3,.9)",
    c: "rgba(4,8,18,.93)",
    q: "rgba(0,0,0,.75)",
  };
  const THEME_BD = {
    d: "rgba(74,222,128,.18)",
    f: "#7a5c10",
    c: "rgba(0,255,255,.3)",
    q: "rgba(255,255,255,.18)",
  };

  function esc(s) {
    return String(s ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function compInner(c) {
    const p = c.props || {};
    switch (c.type) {
      case "player-frame":
      case "target-frame": {
        // Prefer Craftpix pack classes when craftpix-rpg-ui.css is loaded
        const hpPct = Math.min(100, ((p.hp || 0) / (p.hpMax || 1)) * 100);
        const mpPct =
          p.mpMax != null
            ? Math.min(100, ((p.mp || 0) / (p.mpMax || 1)) * 100)
            : null;
        const hpCls =
          hpPct <= 25
            ? "cpx-bar cpx-bar--hp cpx-bar--crit"
            : hpPct <= 50
              ? "cpx-bar cpx-bar--hp cpx-bar--warn"
              : "cpx-bar cpx-bar--hp";
        return `<div class="cpx-panel cpx-panel--uf ufwrap" style="display:flex;gap:8px;min-width:240px;padding:4px 8px"><div class="ufface" style="width:48px;height:48px;display:flex;align-items:center;justify-content:center;font-size:22px;background:rgba(0,0,0,.4);border-radius:4px">⚔</div><div class="ufinfo" style="flex:1;min-width:0"><div class="ufname" style="font-weight:800;color:var(--cpx-ink,#f4e6c8);text-shadow:1px 1px 0 #000">${esc(p.name || "Hero")} <span class="uflvl">Lv.${esc(p.level || 1)}</span></div><div class="${hpCls}"><i style="width:${hpPct}%"></i></div>${mpPct != null ? `<div class="cpx-bar" style="margin-top:2px"><i style="width:${mpPct}%;background:var(--cpx-pb-fill-2) left center / auto 100% repeat-x"></i></div>` : ""}</div></div>`;
      }
      case "ally-frame": {
        const hpPct = Math.min(100, ((p.hp || 0) / (p.hpMax || 1)) * 100);
        return `<div class="cpx-panel cpx-panel--uf afwrap" style="display:flex;gap:6px;min-width:160px;padding:4px 6px"><div class="afface">●</div><div class="afinfo" style="flex:1"><div class="afname">${esc(p.name || "Ally")}</div><div class="cpx-bar cpx-bar--hp"><i style="width:${hpPct}%"></i></div></div></div>`;
      }
      case "healthbar":
      case "manabar":
      case "xp-bar": {
        const pct = Math.min(100, ((p.value || 0) / (p.max || 1)) * 100);
        const kind =
          c.type === "xp-bar"
            ? "cpx-bar cpx-bar--phase"
            : c.type === "manabar"
              ? "cpx-bar"
              : "cpx-bar cpx-bar--hp";
        return `<div class="bwrap"><div class="brow"><span class="blbl">${esc(p.label || "")}</span><span class="bval">${esc(p.value)}/${esc(p.max)}</span></div><div class="${kind}"><i style="width:${pct}%"></i></div></div>`;
      }
      case "hotbar":
      case "hotbar-2row": {
        const n = p.slots || 8;
        const slots = Array.from(
          { length: n },
          (_, i) =>
            `<div class="cpx-slot cpx-slot--sm hbsl" style="width:${p.slotSize || 48}px;height:${p.slotSize || 48}px"><span class="hbnum">${i + 1}</span></div>`,
        ).join("");
        return c.type === "hotbar-2row"
          ? `<div class="hb2wrap"><div class="hbrow" style="display:flex;gap:6px">${slots}</div></div>`
          : `<div class="hbrow" style="display:flex;gap:6px">${slots}</div>`;
      }
      case "inventory-grid": {
        const cols = p.cols || 5;
        const rows = p.rows || 5;
        const gap = p.gap || 4;
        let cells = "";
        for (let i = 0; i < cols * rows; i++)
          cells += `<div class="cpx-slot gslot"></div>`;
        return `<div class="gtitle">${esc(p.label || "Bag")}</div><div class="sgrid" style="display:grid;grid-template-columns:repeat(${cols},1fr);gap:${gap}px">${cells}</div>`;
      }
      case "equipment-slots":
      case "paperdoll-equipment": {
        // Tactical paperdoll (portrait + left/right slots) — Warlords era SSOT.
        const title = esc(p.label || p.title || "Equipment");
        const race = esc(p.race || "Hero");
        const portrait = esc(
          p.portraitUrl ||
            "https://client.grudge-studio.com/images/portraits/human.png",
        );
        const left = ["Helmet", "Chest", "Gloves", "Legs", "Boots"];
        const right = ["Main", "Off", "Amulet", "Belt", "Cloak"];
        return `<div class="pdwrap">
          <div class="pdtitle">${title}</div>
          <div class="pdrace">${race}</div>
          <div class="pdgrid">
            <div class="pdcol">${left.map((n) => `<div class="eqsl"><i>◇</i><span class="eqn">${n}</span></div>`).join("")}</div>
            <div class="pdport"><img src="${portrait}" alt="" /></div>
            <div class="pdcol">${right.map((n) => `<div class="eqsl"><i>◇</i><span class="eqn">${n}</span></div>`).join("")}</div>
          </div>
        </div>`;
      }
      case "minimap":
        return `<div class="mmwrap" style="border-radius:${p.shape === "circle" ? "50%" : "8px"}"><div class="mmbg"></div><div class="mmgrid"></div><div class="mmdot"></div><div class="mmbd" style="border-radius:inherit"></div></div>`;
      case "currency-display":
        return `<div class="cwrap"><span class="camt">${esc(p.amount || "0")}</span><span class="clbl">${esc(p.label || "")}</span></div>`;
      case "menu-dock": {
        const btns = String(p.buttons || "Menu").split(",");
        return `<div class="mdwrap">${btns.map((b) => `<div class="mdbtn"><i>▣</i>${esc(b.trim())}</div>`).join("")}</div>`;
      }
      case "objectives":
      case "quest-tracker":
        return `<div class="qtwrap"><div class="qtitle">${esc(p.title || p.label || "Objectives")}</div><div class="qtobj">${esc(p.objective || "—")}</div></div>`;
      case "chat-window":
        return `<div class="chatwrap"><div class="chatmsgs"><div class="chatmsg"><span class="chatu">System:</span> <span class="chatt">Connected</span></div></div><div class="chatinp"><div class="chatfake"></div></div></div>`;
      case "combat-log":
        return `<div class="clwrap"><div class="clmsgs"><div class="clm sys">Combat ready</div></div></div>`;
      case "shop-panel":
        return `<div class="shwrap"><div class="gtitle">${esc(p.label || "Panel")}</div><div class="shitems"><div class="shitem"><div class="shico">◆</div><div class="shnm">Item A</div><div class="shpr">—</div></div><div class="shitem"><div class="shico">◇</div><div class="shnm">Item B</div><div class="shpr">—</div></div></div><div class="shbuy">Select</div></div>`;
      case "attr-panel":
        return `<div class="gtitle">${esc(p.label || "Attributes")}</div><div class="attrlist">${["STR", "VIT", "DEX", "TAC", "INT", "WIL", "LCK", "CHA"].map((a) => `<div class="attrow"><span class="attn">${a}</span><span class="attv">10</span></div>`).join("")}</div>`;
      case "skill-tree":
        return `<div class="gtitle">${esc(p.label || "Skills")}</div><div class="stwrap"><div class="stnode on" style="left:40%;top:30%">★</div></div>`;
      case "weapon-selector":
        return `<div class="wswrap"><div class="wsbtn on">Main</div><div class="wsbtn">2nd</div><span style="font-size:.5rem;color:var(--ct);margin-left:6px">${esc(p.label || "")}</span></div>`;
      case "interaction-prompt":
        return `<div class="ipwrap"><div class="ipkey">${esc(p.key || "F")}</div><div class="ipact">${esc(p.action || "Use")}</div></div>`;
      case "dialogue-box":
        return `<div class="dlgwrap"><div class="dlgspk">${esc(p.speaker || "")}</div><div class="dlgtxt">${esc(p.text || "")}</div></div>`;
      case "alert-banner":
        return `<div class="albwrap" style="border-color:var(--ca)"><span class="albtxt">${esc(p.text || "")}</span></div>`;
      case "crosshair":
        return `<div class="xhwrap"><div class="xhdot"></div></div>`;
      case "text-label":
        return `<div class="txwrap"><span class="txin" style="font-size:${p.size || 14}px;text-align:${p.align || "left"};width:100%">${esc(p.text || "")}</span></div>`;
      case "health-orb":
      case "mana-orb":
      case "action-orb":
        return `<div class="orbwrap"><div class="orbval" style="color:${esc(p.color || "var(--ca)")}">${esc(p.value ?? 0)}</div><div class="orblbl">${esc(p.label || "")}</div></div>`;
      case "portrait":
        return `<div class="pwrap"><div class="pface">☺</div><div class="pname">${esc(p.name || "")}</div><div class="plvl">Lv.${esc(p.level || 1)}</div></div>`;
      case "cast-bar": {
        const pct = Math.min(100, Math.max(0, Number(p.progress ?? p.value ?? 0)));
        const label = esc(p.label || p.spell || "Casting…");
        return `<div class="cpx-castbar sb-cast"><div class="sb-cast-ico" style="background-image:url(${esc(p.iconUrl || "")})"></div><div class="sb-cast-body"><div class="sb-cast-name">${label}</div><div class="cpx-bar cpx-bar--phase"><i style="width:${pct}%"></i></div></div></div>`;
      }
      case "spellbook":
      case "spell-book": {
        // Craftpix Spell Book chrome — tabs + spell grid (Warlords / grudge6 SSOT)
        const tabs = Array.isArray(p.tabs)
          ? p.tabs
          : ["Weapon", "Class", "Magic", "Utility"];
        const active = Math.min(tabs.length - 1, Math.max(0, Number(p.activeTab || 0)));
        const spells = Array.isArray(p.spells)
          ? p.spells
          : Array.from({ length: p.slots || 12 }, (_, i) => ({
              id: `spell_${i}`,
              name: p[`spell${i}Name`] || `Ability ${i + 1}`,
              iconUrl: p[`spell${i}Icon`] || "",
              rank: p[`spell${i}Rank`] || 1,
              locked: false,
            }));
        const tabHtml = tabs
          .map(
            (t, i) =>
              `<button type="button" class="sb-tab${i === active ? " is-active" : ""}" data-tab="${i}">${esc(typeof t === "string" ? t : t.label || t.id || "Tab")}</button>`,
          )
          .join("");
        const grid = spells
          .map((s) => {
            const name = esc(s.name || s.id || "—");
            const ico = s.iconUrl
              ? `style="background-image:url(${esc(s.iconUrl)})"`
              : "";
            const lock = s.locked ? " is-locked" : "";
            return `<div class="sb-slot cpx-slot${lock}" data-spell="${esc(s.id || name)}" title="${name}"><div class="sb-ico" ${ico}></div><span class="sb-name">${name}</span><span class="sb-rank">R${esc(s.rank ?? 1)}</span></div>`;
          })
          .join("");
        return `<div class="sb-root cpx-panel"><div class="sb-header"><span class="sb-title">${esc(p.title || "Spellbook")}</span><span class="sb-sub">${esc(p.subtitle || "Abilities · B")}</span></div><div class="sb-tabs">${tabHtml}</div><div class="sb-grid">${grid}</div></div>`;
      }
      case "action-bar": {
        // Single craftpix action bar row with optional icons
        const n = p.slots || 8;
        const icons = Array.isArray(p.icons) ? p.icons : [];
        const labels = Array.isArray(p.labels) ? p.labels : [];
        const slots = Array.from({ length: n }, (_, i) => {
          const ico = icons[i]
            ? `style="background-image:url(${esc(icons[i])})"`
            : "";
          const lab = labels[i] ? `<span class="hb-lbl">${esc(labels[i])}</span>` : "";
          return `<div class="cpx-slot cpx-slot--sm hbsl hbsl--icon" style="width:${p.slotSize || 48}px;height:${p.slotSize || 48}px"><div class="hb-ico" ${ico}></div>${lab}<span class="hbnum">${i + 1}</span></div>`;
        }).join("");
        return `<div class="cpx-actionbar hbrow" style="display:flex;gap:6px;align-items:center">${slots}</div>`;
      }
      default:
        return `<div class="gtitle">${esc(c.type)}</div>`;
    }
  }

  function injectCss(doc) {
    if (doc.getElementById("grudge-game-ui-css")) return;
    const style = doc.createElement("style");
    style.id = "grudge-game-ui-css";
    style.textContent = `
.ggui-root{position:relative;width:100%;height:100%;overflow:hidden;pointer-events:none;font-family:Inter,system-ui,sans-serif}
.ggui-root *{box-sizing:border-box}
.ggui-comp{position:absolute;pointer-events:auto}
.ggui-comp[data-hidden="1"]{display:none!important}
.ggui-inner{width:100%;height:100%;overflow:hidden}
.gtitle{font-size:.57rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--ca);padding:4px 6px 3px;border-bottom:1px solid var(--sb)}
.sgrid{display:grid;padding:5px}.gslot{background:var(--slot);border:1px solid var(--sb);border-radius:3px}
.hbrow{display:flex;gap:3px;padding:5px;align-items:center;justify-content:center;height:100%}
.hbsl{background:var(--slot);border:1px solid var(--sb);border-radius:3px;display:flex;align-items:flex-end;justify-content:flex-end;padding:2px;flex-shrink:0}
.hbnum{font-size:.46rem;color:var(--ca)}.hb2wrap{display:flex;flex-direction:column;gap:3px;padding:4px;height:100%;justify-content:center}
.bwrap{padding:5px 7px;display:flex;flex-direction:column;gap:3px;height:100%;justify-content:center}
.brow{display:flex;justify-content:space-between}.blbl{font-size:.57rem;font-weight:700;color:var(--ca)}.bval{font-size:.55rem;color:var(--ct)}
.btrack{background:rgba(0,0,0,.5);border:1px solid var(--sb);border-radius:20px;overflow:hidden;height:8px}
.bfill{height:100%;border-radius:20px}
.mmwrap{width:100%;height:100%;position:relative;overflow:hidden}
.mmbg{position:absolute;inset:0;background:radial-gradient(circle,rgba(30,60,40,.6),rgba(5,15,10,.9))}
.mmgrid{position:absolute;inset:0;background-image:linear-gradient(rgba(74,222,128,.07) 1px,transparent 1px),linear-gradient(90deg,rgba(74,222,128,.07) 1px,transparent 1px);background-size:18px 18px}
.mmdot{width:5px;height:5px;border-radius:50%;background:#4ade80;position:absolute;top:45%;left:50%;transform:translate(-50%,-50%);box-shadow:0 0 4px #4ade80;z-index:2}
.mmbd{position:absolute;inset:0;border:1px solid var(--sb)}
.cwrap{display:flex;align-items:center;gap:5px;padding:3px 7px;height:100%}.camt{font-size:.76rem;font-weight:700;color:var(--ca)}.clbl{font-size:.53rem;color:var(--ct)}
.chatwrap,.clwrap,.shwrap,.qtwrap{display:flex;flex-direction:column;height:100%}
.chatmsgs,.clmsgs,.shitems{flex:1;padding:3px 5px;display:flex;flex-direction:column;gap:2px;overflow:hidden;justify-content:flex-end}
.chatmsg{font-size:.51rem;line-height:1.4}.chatu{color:var(--ca);font-weight:600}.chatt{color:var(--ct)}
.chatinp{display:flex;gap:3px;padding:3px 5px;border-top:1px solid var(--sb)}.chatfake{flex:1;height:15px;background:var(--slot);border:1px solid var(--sb);border-radius:3px}
.eqgrid{display:grid;grid-template-columns:1fr 1fr 1fr;grid-template-rows:repeat(4,1fr);gap:3px;padding:5px;height:calc(100% - 22px)}
.eqsl{background:var(--slot);border:1px solid var(--sb);border-radius:3px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;font-size:.5rem;color:var(--ca)}
.eqn{font-size:.38rem;color:rgba(255,255,255,.4)}
.pdwrap{display:flex;flex-direction:column;height:100%;background:linear-gradient(180deg,rgba(28,25,23,.95),rgba(12,10,9,.98))}
.pdtitle{font-size:.55rem;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--ca);text-align:center;padding:6px;border-bottom:1px solid var(--sb)}
.pdrace{font-size:.5rem;letter-spacing:.1em;text-transform:uppercase;color:var(--ct);text-align:center;padding:4px;opacity:.85}
.pdgrid{flex:1;display:grid;grid-template-columns:minmax(40px,56px) 1fr minmax(40px,56px);gap:4px;padding:6px;min-height:0}
.pdcol{display:flex;flex-direction:column;gap:3px;justify-content:space-between}
.pdcol .eqsl{flex:1;min-height:0}
.pdport{position:relative;border-radius:6px;overflow:hidden;border:1px solid var(--sb);background:#000}
.pdport img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center 62%;transform:scale(1.45)}
.ufwrap,.afwrap{display:flex;align-items:center;gap:6px;padding:4px 6px;height:100%}
.ufface,.afface{border-radius:4px;background:var(--slot);border:2px solid var(--ca);display:flex;align-items:center;justify-content:center;color:var(--ca);flex-shrink:0}
.ufface{width:40px;height:40px}.afface{width:26px;height:26px;border-width:1px}
.ufinfo,.afinfo{flex:1;display:flex;flex-direction:column;gap:2px}
.ufname,.afname{font-size:.6rem;font-weight:700;color:#e0e2f0}.uflvl{font-size:.52rem;color:var(--ca)}
.ufbar,.afbar{height:7px;background:rgba(0,0,0,.5);border-radius:4px;overflow:hidden}
.ufhp,.afhp{height:100%;background:linear-gradient(90deg,#e11d48,#f87171);border-radius:4px}
.ufmp{height:100%;background:linear-gradient(90deg,#2563eb,#60a5fa);border-radius:4px}
.mdwrap{display:flex;align-items:center;gap:3px;padding:3px;height:100%;justify-content:center}
.mdbtn{display:flex;flex-direction:column;align-items:center;gap:2px;padding:3px 8px;border-radius:5px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);font-size:.46rem;color:rgba(255,255,255,.5);flex:1}
.qtitle{padding:3px 6px;font-size:.65rem;font-weight:700;color:var(--ca)}.qtobj{padding:0 6px;font-size:.6rem;color:#9496b0;line-height:1.5}
/* Spellbook + cast bar (craftpix Spell Book pack) */
.sb-root{display:flex;flex-direction:column;height:100%;padding:6px 8px;background:rgba(12,8,4,.92);border:1px solid var(--sb);border-radius:8px}
.sb-header{display:flex;justify-content:space-between;align-items:baseline;padding:2px 2px 6px;border-bottom:1px solid var(--sb)}
.sb-title{font-size:.7rem;font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:var(--ca)}
.sb-sub{font-size:.5rem;color:var(--ct);opacity:.75}
.sb-tabs{display:flex;gap:4px;padding:6px 0;flex-wrap:wrap}
.sb-tab{pointer-events:auto;cursor:pointer;border:1px solid var(--sb);background:rgba(0,0,0,.35);color:var(--ct);font-size:.52rem;font-weight:700;letter-spacing:.06em;text-transform:uppercase;padding:4px 8px;border-radius:4px}
.sb-tab.is-active,.sb-tab:hover{border-color:var(--ca);color:var(--ca);background:var(--cb)}
.sb-grid{flex:1;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:6px;overflow:auto;padding:4px 0;min-height:0}
.sb-slot{display:flex;flex-direction:column;align-items:center;justify-content:flex-end;gap:2px;min-height:64px;padding:4px;position:relative}
.sb-ico{position:absolute;inset:6px 6px 22px;background:center/contain no-repeat;opacity:.95}
.sb-name{font-size:.42rem;color:var(--ct);text-align:center;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;z-index:1}
.sb-rank{font-size:.38rem;color:var(--ca);z-index:1}
.sb-slot.is-locked{opacity:.4;filter:grayscale(.8)}
.sb-cast{display:flex;gap:8px;align-items:center;padding:6px 8px;height:100%}
.sb-cast-ico{width:36px;height:36px;border-radius:4px;background:var(--slot) center/cover no-repeat;border:1px solid var(--sb);flex-shrink:0}
.sb-cast-body{flex:1;min-width:0;display:flex;flex-direction:column;gap:3px}
.sb-cast-name{font-size:.58rem;font-weight:700;color:var(--ct)}
.hbsl--icon{position:relative;align-items:flex-end}
.hb-ico{position:absolute;inset:4px 4px 12px;background:center/contain no-repeat}
.hb-lbl{position:absolute;bottom:10px;left:0;right:0;text-align:center;font-size:.36rem;color:var(--ct);z-index:1;pointer-events:none}
.cpx-actionbar{padding:4px 6px}
.shitem{display:flex;align-items:center;gap:4px;padding:3px 4px;border-radius:3px;background:var(--slot);border:1px solid var(--sb)}
.shico{width:17px;height:17px;border-radius:3px;background:var(--cb);display:flex;align-items:center;justify-content:center;font-size:.56rem}
.shnm{flex:1;font-size:.54rem;color:var(--ct)}.shpr{font-size:.54rem;font-weight:700;color:var(--ca)}
.shbuy{margin:3px 5px 4px;padding:3px;border-radius:4px;text-align:center;background:var(--cb);border:1px solid var(--sb);font-size:.54rem;font-weight:700;color:var(--ca)}
.attrlist{padding:2px 4px;display:flex;flex-direction:column;gap:1px;height:calc(100% - 22px);justify-content:space-around}
.attrow{display:flex;align-items:center;gap:5px;padding:2px 4px;border-radius:4px;background:rgba(255,255,255,.02)}
.attn{flex:1;font-size:.58rem;font-weight:600;color:#9496b0;letter-spacing:.06em}.attv{font-size:.62rem;font-weight:700;color:var(--ca)}
.wswrap{display:flex;align-items:center;gap:3px;padding:3px 5px;height:100%}
.wsbtn{padding:3px 8px;border-radius:5px;border:1px solid rgba(255,255,255,.08);background:rgba(255,255,255,.03);font-size:.54rem;color:#9496b0}
.wsbtn.on{background:rgba(74,222,128,.1);border-color:rgba(74,222,128,.3);color:var(--ca)}
.ipwrap{display:flex;align-items:center;gap:8px;height:100%;padding:0 12px}
.ipkey{width:28px;height:28px;border-radius:5px;border:2px solid rgba(255,255,255,.35);background:rgba(255,255,255,.08);display:flex;align-items:center;justify-content:center;font-size:.72rem;font-weight:700;color:#fff}
.ipact{font-size:.7rem;font-weight:600;color:var(--ct)}
.dlgwrap{display:flex;flex-direction:column;height:100%;padding:8px 12px;gap:5px}
.dlgspk{font-size:.65rem;font-weight:700;color:var(--ca);letter-spacing:.05em;text-transform:uppercase}
.dlgtxt{flex:1;font-size:.68rem;line-height:1.6;color:var(--ct)}
.albwrap{display:flex;align-items:center;justify-content:center;gap:8px;height:100%;padding:0 14px;border:1px solid;border-radius:inherit}
.albtxt{font-size:.75rem;font-weight:700;letter-spacing:.08em;color:var(--ct)}
.xhwrap{display:flex;align-items:center;justify-content:center;height:100%;color:var(--ca);position:relative}
.xhwrap::before,.xhwrap::after{content:'';position:absolute;background:currentColor;border-radius:1px}
.xhwrap::before{width:11px;height:1.5px}.xhwrap::after{width:1.5px;height:11px}
.xhdot{width:3px;height:3px;border-radius:50%;border:1px solid currentColor;position:absolute}
.txwrap{display:flex;align-items:center;height:100%;padding:0 5px}.txin{color:var(--ct);font-weight:600}
.orbwrap{position:relative;width:100%;height:100%;display:flex;align-items:center;justify-content:center}
.orbval{position:absolute;font-size:.72rem;font-weight:700}
.orblbl{position:absolute;bottom:10%;font-size:.47rem;letter-spacing:.1em;text-transform:uppercase;color:rgba(255,255,255,.45)}
.pwrap{display:flex;flex-direction:column;align-items:center;padding:5px;gap:3px;height:100%;justify-content:center}
.pface{flex:1;width:100%;background:var(--slot);border:1px solid var(--sb);border-radius:3px;display:flex;align-items:center;justify-content:center;font-size:1.5rem;color:var(--ca)}
.stwrap{position:relative;width:100%;height:calc(100% - 22px)}.stnode{position:absolute;width:28px;height:28px;border-radius:50%;background:var(--slot);border:2px solid var(--sb);display:flex;align-items:center;justify-content:center;color:var(--ca)}
.stnode.on{background:var(--cb);border-color:var(--ca)}
.clm{font-size:.52rem;line-height:1.4;color:#9496b0}.clm.sys{font-style:italic}
`;
    doc.head.appendChild(style);
  }

  /** Production Craftpix on R2 CDN first; client / same-origin fallback. */
  function injectCraftpixCss(doc) {
    if (doc.getElementById("ggui-craftpix-rpg-css")) return;
    const candidates = [
      "https://assets.grudge-studio.com/ui/craftpix-rpg/craftpix-rpg-ui.css",
      "https://client.grudge-studio.com/ui/craftpix-rpg/craftpix-rpg-ui.css",
      "/ui/craftpix-rpg/craftpix-rpg-ui.css",
    ];
    const link = doc.createElement("link");
    link.id = "ggui-craftpix-rpg-css";
    link.rel = "stylesheet";
    link.href = candidates[0];
    let i = 0;
    link.onerror = function () {
      i += 1;
      if (i < candidates.length) link.href = candidates[i];
    };
    doc.head.appendChild(link);
    if (doc.documentElement) doc.documentElement.classList.add("cpx-theme");
  }

  class GameUIInstance {
    constructor(pack, baseUrl) {
      this.pack = pack;
      this.baseUrl = baseUrl;
      this.state = (pack.meta && pack.meta.usageStates && pack.meta.usageStates[0]) || "hud";
      this.root = null;
      this._data = {};
    }

    mount(el, opts) {
      opts = opts || {};
      const doc = el.ownerDocument || document;
      injectCss(doc);
      injectCraftpixCss(doc);
      const th = this.pack.theme || "f";
      const res = this.pack.resolution || { w: 1920, h: 1080 };
      const scale = opts.scale !== false;

      const root = doc.createElement("div");
      root.className = "ggui-root";
      root.dataset.gameId = this.pack.gameId || this.pack.id || "";
      root.dataset.state = this.state;
      root.style.cssText = THEME_VARS[th] || THEME_VARS.f;
      if (scale) {
        root.style.width = res.w + "px";
        root.style.height = res.h + "px";
        root.style.transformOrigin = "top left";
        // Fit parent
        const fit = () => {
          const pw = el.clientWidth || res.w;
          const ph = el.clientHeight || res.h;
          const s = Math.min(pw / res.w, ph / res.h);
          root.style.transform = `scale(${s})`;
        };
        fit();
        if (typeof ResizeObserver !== "undefined") {
          this._ro = new ResizeObserver(fit);
          this._ro.observe(el);
        }
      }

      const comps = this.pack.comps || [];
      comps.forEach((c) => {
        const node = doc.createElement("div");
        node.className = "ggui-comp";
        node.dataset.id = c.id;
        node.dataset.type = c.type;
        if (c.groups) node.dataset.groups = c.groups.join(",");
        node.style.left = c.x + "px";
        node.style.top = c.y + "px";
        node.style.width = c.w + "px";
        node.style.height = c.h + "px";
        node.style.opacity = c.op != null ? c.op : 1;
        node.style.transform = `rotate(${c.rot || 0}deg)`;
        if (c.shd) node.style.filter = "drop-shadow(0 4px 14px rgba(0,0,0,.65))";

        const inner = doc.createElement("div");
        inner.className = "ggui-inner";
        inner.style.borderRadius = (c.br || 6) + "px";
        inner.style.background = THEME_BG[th] || THEME_BG.f;
        inner.style.border = "1px solid " + (THEME_BD[th] || THEME_BD.f);
        inner.innerHTML = compInner(c);
        node.appendChild(inner);
        root.appendChild(node);
      });

      el.innerHTML = "";
      el.appendChild(root);
      this.root = root;
      this.applyState(this.state);
      return this;
    }

    applyState(stateName) {
      this.state = stateName;
      if (!this.root) return;
      this.root.dataset.state = stateName;
      const states = this.pack.states || {};
      const cfg = states[stateName] || null;
      const nodes = this.root.querySelectorAll(".ggui-comp");
      nodes.forEach((node) => {
        const groups = (node.dataset.groups || "hud").split(",");
        let show = true;
        if (cfg) {
          const hide = cfg.hide || [];
          const showG = cfg.show || [];
          if (hide.some((g) => groups.includes(g))) show = false;
          if (showG.length && !showG.some((g) => groups.includes(g))) {
            // if component only has groups not in show list, hide — but always keep pure hud if show includes hud
            if (!groups.some((g) => showG.includes(g))) show = false;
          }
        }
        node.dataset.hidden = show ? "0" : "1";
      });
      return this;
    }

    setState(stateName) {
      return this.applyState(stateName);
    }

    /** Merge props into components by id, re-render inner HTML */
    bindData(map) {
      if (!this.root || !map) return this;
      Object.keys(map).forEach((id) => {
        const comp = (this.pack.comps || []).find((c) => c.id === id);
        const node = this.root.querySelector(`.ggui-comp[data-id="${id}"]`);
        if (!comp || !node) return;
        comp.props = Object.assign({}, comp.props || {}, map[id]);
        const inner = node.querySelector(".ggui-inner");
        if (inner) inner.innerHTML = compInner(comp);
      });
      this._data = Object.assign({}, this._data, map);
      return this;
    }

    getMeta() {
      return this.pack.meta || {};
    }

    getStates() {
      return (this.pack.meta && this.pack.meta.usageStates) || Object.keys(this.pack.states || {});
    }

    unmount() {
      if (this._ro) this._ro.disconnect();
      if (this.root && this.root.parentNode) this.root.parentNode.removeChild(this.root);
      this.root = null;
    }
  }

  async function fetchJson(url) {
    const r = await fetch(url, { credentials: "omit" });
    if (!r.ok) throw new Error("Failed " + url + " " + r.status);
    return r.json();
  }

  const GrudgeGameUI = {
    baseUrl: DEFAULT_BASE,

    async list(base) {
      const b = (base || this.baseUrl).replace(/\/$/, "");
      return fetchJson(b + "/game-ui-packs/index.json");
    },

    async load(packId, base) {
      const b = (base || this.baseUrl).replace(/\/$/, "");
      const index = await this.list(b);
      const entry = (index.packs || []).find(
        (p) => p.id === packId || p.gameId === packId,
      );
      if (!entry) throw new Error("Unknown pack: " + packId);
      const pack = await fetchJson(b + "/game-ui-packs/" + entry.id + ".json");
      return new GameUIInstance(pack, b);
    },

    async loadFromUrl(url) {
      const pack = await fetchJson(url);
      return new GameUIInstance(pack, this.baseUrl);
    },

    GameUIInstance,
  };

  global.GrudgeGameUI = GrudgeGameUI;
})(typeof window !== "undefined" ? window : globalThis);
