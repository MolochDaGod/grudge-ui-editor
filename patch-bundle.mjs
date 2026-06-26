/**
 * Surgical patches for the dist-only UI kit bundle.
 * Run: node patch-bundle.mjs
 */
import fs from 'fs';
import path from 'path';

const BUNDLE = path.resolve('assets/index-CvSnJIJG.js');
let s = fs.readFileSync(BUNDLE, 'utf8');
const patches = [];

function replace(oldStr, newStr, label) {
  if (!s.includes(oldStr)) {
    console.error(`MISSING PATCH: ${label}`);
    process.exitCode = 1;
    return;
  }
  s = s.replace(oldStr, newStr);
  patches.push(label);
}

// ── Cyberpunk crafting window: 4×4 recipe grid (was 5-col auto-rows) ──────────
replace(
  'gridTemplateColumns:"repeat(5, 1fr)",gridAutoRows:"1fr",gap:4,height:"100%"',
  'gridTemplateColumns:"repeat(4, 1fr)",gridTemplateRows:"repeat(4, 1fr)",gap:4,height:"100%"',
  'crafting pixel grid 4x4'
);



// ── Bench crafting: inject 8×8 material table before forge button ─────────────
const benchAnchor =
  'c.jsxs(Je,{variant:"primary",block:!0,disabled:!m,onClick:v,children:[c.jsx(Ne,{name:"craft",size:14})," ",g?"Forging...":m?"Craft":"Missing Materials"]})';
const benchGrid =
  'c.jsxs("div",{className:"gk-panel",style:{marginBottom:14},children:[c.jsx("div",{className:"gk-titlebar",children:c.jsx("span",{className:"gk-title",style:{fontSize:13},children:"Bench Storage"})}),c.jsx("div",{className:"gk-panel__body",children:c.jsx("div",{className:"gk-grid gk-bench-grid",style:{"--gk-cols":8,"--gk-slot-size":"38px"},children:Array.from({length:64},(b,k)=>c.jsx("div",{className:"gk-slot",title:`Bench slot ${k+1}`},k))})})]}),' +
  benchAnchor;

replace(benchAnchor, benchGrid, 'bench 8x8 storage grid');

// ── Add Main Panel to showcase tabs ───────────────────────────────────────────
replace(
  '{id:"hud",label:"HUD",fullBleed:!0,Component:_x},{id:"inventory",label:"Inventory",Component:Yx}',
  '{id:"hud",label:"HUD",fullBleed:!0,Component:_x},{id:"mainpanel",label:"Main Panel",Component:wk},{id:"inventory",label:"Inventory",Component:Yx}',
  'main panel tab entry'
);

// ── Main Panel iframe component (mini grudge-game panel) ─────────────────────
const mpComponent =
  'function wk(){return c.jsx("iframe",{src:"./main-panel.html",title:"Grudge Main Panel",style:{width:"100%",height:"100%",minHeight:640,border:"none",borderRadius:8,background:"#0a0705"}})}';
const mpInsertPoint = 'function Kx(){return we(r=>r.theme)==="cyberpunk"?c.jsx(Ix,{}):c.jsx(Px,{})}';
replace(
  mpInsertPoint,
  mpComponent + mpInsertPoint,
  'main panel component wk'
);

// ── AI Director: Grudge AI client instead of broken /api/ai/configure ────────
const aiDirectorOld =
  'const T=await fetch("/api/ai/configure",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({prompt:y,current:{theme:i,overrides:r,fontScale:s,activeSystem:o},themes:np.map(A=>({id:A,label:Dt[A].label})),systems:uf.map(A=>({id:A.id,label:A.label})),paletteKeys:bk})});if(!T.ok)throw new Error(`AI request failed (${T.status})`);const _=await T.json();_.patch&&d(_.patch),x(_.message??"Updated the UI.")';
const aiDirectorNew =
  'let _;if(window.GrudgeAI?.configureUIKit){if(!GrudgeAI.isReady())throw new Error("Sign in with Grudge ID (nav) or add an Anthropic key");_=await GrudgeAI.configureUIKit({prompt:y,current:{theme:i,overrides:r,fontScale:s,activeSystem:o}})}else{const T=await fetch("/api/ai/configure",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({prompt:y,current:{theme:i,overrides:r,fontScale:s,activeSystem:o},themes:np.map(A=>({id:A,label:Dt[A].label})),systems:uf.map(A=>({id:A.id,label:A.label})),paletteKeys:bk})});if(!T.ok)throw new Error(`AI request failed (${T.status})`);_=await T.json()}_.patch&&d(_.patch),x(_.message??"Updated the UI.")';
replace(aiDirectorOld, aiDirectorNew, 'AI Director grudge-ai fallback');

fs.writeFileSync(BUNDLE, s);
console.log('Applied patches:', patches.join(', '));