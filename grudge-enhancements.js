/**
 * Runtime enhancements for ui.grudge-studio.com
 * — Tactical Infinity equipment styling + race portraits
 * — Crafting grid class hooks
 */
(function () {
  const RACES = {
    human: 'https://tactical-infinity.replit.app/assets/human_1777036154781-BQPXB4iK.png',
    barbarian: 'https://tactical-infinity.replit.app/assets/Barbarian_1777036154778-D1yd9ddH.png',
    dwarf: 'https://tactical-infinity.replit.app/assets/Dwarf_1777036154779-7VQfUCY3.png',
    elf: 'https://tactical-infinity.replit.app/assets/Elf_1777036154780-DJEQzQzJ.png',
    orc: 'https://tactical-infinity.replit.app/assets/Orc_1777036154782-DB-Xb4Eg.png',
    undead: 'https://tactical-infinity.replit.app/assets/Undead_1777036154776-BqtCvSJQ.png',
  };

  let activeRace = 'human';

  function getActiveSystem() {
    const tab = document.querySelector('.topbar__tab.is-active, [class*="tab"].is-active');
    return tab?.textContent?.trim().toLowerCase() || '';
  }

  function injectRaceBar(root) {
    if (root.querySelector('.gk-equip-race-bar')) return;
    const bar = document.createElement('div');
    bar.className = 'gk-equip-race-bar';
    Object.keys(RACES).forEach((race) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'gk-equip-race-btn' + (race === activeRace ? ' is-active' : '');
      btn.textContent = race;
      btn.addEventListener('click', () => {
        activeRace = race;
        bar.querySelectorAll('.gk-equip-race-btn').forEach((b) => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        applyPortrait(root);
      });
      bar.appendChild(btn);
    });
    root.prepend(bar);
  }

  function applyPortrait(root) {
    const inset = root.querySelector('.gk-panel.gk-panel--inset');
    if (!inset) return;
    let img = inset.querySelector('img.gk-equip-portrait');
    if (!img) {
      img = document.createElement('img');
      img.className = 'gk-equip-portrait';
      img.alt = activeRace + ' portrait';
      inset.appendChild(img);
      const svg = inset.querySelector('svg');
      if (svg) svg.style.opacity = '0.15';
    }
    img.src = RACES[activeRace];
  }

  function enhanceEquipment(stage) {
    stage.classList.add('gk-equip-tactical');
    injectRaceBar(stage);
    applyPortrait(stage);
  }

  function clearEquipment(stage) {
    stage.classList.remove('gk-equip-tactical');
    stage.querySelector('.gk-equip-race-bar')?.remove();
    stage.querySelector('img.gk-equip-portrait')?.remove();
  }

  function tick() {
    const system = getActiveSystem();
    const stage = document.querySelector('.stage__center, .stage__bleed, .stage');
    if (!stage) return;

    if (system === 'equipment') {
      enhanceEquipment(stage);
    } else {
      clearEquipment(stage);
    }

    document.querySelectorAll('.gk-bench-grid').forEach((g) => {
      g.setAttribute('data-grid', '8x8');
    });
    document.querySelectorAll('.gk-pixgrid[style*="repeat(4"]').forEach((g) => {
      g.setAttribute('data-grid', '4x4');
    });
  }

  const obs = new MutationObserver(() => tick());
  function selectSystemTab(label) {
    const want = label.toLowerCase();
    document.querySelectorAll('button, [role="tab"]').forEach((el) => {
      const t = (el.textContent || '').trim().toLowerCase();
      if (t === want) el.click();
    });
  }

  function boot() {
    tick();
    const root = document.getElementById('root');
    if (root) obs.observe(root, { childList: true, subtree: true, attributes: true });
    document.addEventListener('click', () => setTimeout(tick, 50));

    const path = location.pathname.replace(/\/$/, '') || '/';
    if (path === '/equipment') {
      setTimeout(() => selectSystemTab('equipment'), 600);
      setTimeout(() => selectSystemTab('equipment'), 1400);
    }
    if (path === '/main-panel' || location.hash === '#mainpanel') {
      setTimeout(() => selectSystemTab('main panel'), 600);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();