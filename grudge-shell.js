(function () {
  const path = window.location.pathname.replace(/\/$/, '') || '/';
  const links = [
    { href: '/', label: 'UI Kit', match: (p) => p === '/' || p === '/index.html' },
    { href: '/studio', label: 'Studio', match: (p) => p === '/studio' },
    { href: '/hotkeys', label: 'Input', match: (p) => p === '/hotkeys' },
    { href: '/main-panel', label: 'Main Panel', match: (p) => p === '/main-panel' },
    { href: '/assets', label: '3D Assets', badge: '276', match: (p) => p === '/assets' },
  ];

  const nav = document.createElement('nav');
  nav.id = 'gs-fleet-nav';
  nav.setAttribute('aria-label', 'Grudge Studio navigation');

  const brand = document.createElement('div');
  brand.className = 'gs-brand';
  brand.innerHTML = '<strong>Grudge</strong><span>UI · HYDRA</span>';
  nav.appendChild(brand);

  links.forEach((l) => {
    const a = document.createElement('a');
    a.href = l.href;
    a.textContent = l.label;
    if (l.badge) {
      const b = document.createElement('span');
      b.className = 'gs-badge';
      b.textContent = l.badge;
      a.appendChild(b);
    }
    if (l.match(path)) a.classList.add('is-active');
    nav.appendChild(a);
  });

  const spacer = document.createElement('div');
  spacer.className = 'gs-spacer';
  nav.appendChild(spacer);

  const ext = document.createElement('a');
  ext.href = 'https://grudge-studio.com';
  ext.textContent = 'Fleet Hub';
  ext.target = '_blank';
  ext.rel = 'noopener';
  nav.appendChild(ext);

  const accountWrap = document.createElement('div');
  accountWrap.className = 'gs-account-wrap';
  accountWrap.id = 'gs-account-wrap';

  const aiPill = document.createElement('button');
  aiPill.type = 'button';
  aiPill.id = 'gs-ai-pill';
  aiPill.className = 'gs-pill gs-pill--ai gs-pill--off';
  aiPill.textContent = 'Grudge';
  aiPill.title = 'Grudge ID — sign in for cloud saves';
  aiPill.setAttribute('aria-haspopup', 'menu');
  aiPill.setAttribute('aria-expanded', 'false');

  const accountMenu = document.createElement('div');
  accountMenu.id = 'gs-account-menu';
  accountMenu.className = 'gs-account-menu';
  accountMenu.hidden = true;
  accountMenu.setAttribute('role', 'menu');
  accountMenu.innerHTML =
    '<div class="gs-account-head" id="gs-account-head"></div>' +
    '<button type="button" class="gs-account-item" data-action="cloud" role="menuitem">Enable cloud saves</button>' +
    '<button type="button" class="gs-account-item" data-action="switch" role="menuitem">Switch account</button>' +
    '<button type="button" class="gs-account-item gs-account-item--danger" data-action="logout" role="menuitem">Sign out</button>';

  accountWrap.appendChild(aiPill);
  accountWrap.appendChild(accountMenu);
  nav.appendChild(accountWrap);

  let menuOpen = false;

  function closeMenu() {
    menuOpen = false;
    accountMenu.hidden = true;
    aiPill.setAttribute('aria-expanded', 'false');
  }

  function toggleMenu() {
    menuOpen = !menuOpen;
    accountMenu.hidden = !menuOpen;
    aiPill.setAttribute('aria-expanded', menuOpen ? 'true' : 'false');
  }

  document.addEventListener('click', (e) => {
    if (!accountWrap.contains(e.target)) closeMenu();
  });

  accountMenu.querySelector('[data-action="logout"]').addEventListener('click', async () => {
    closeMenu();
    if (window.GrudgeCloud?.logout) await GrudgeCloud.logout();
    await refreshAiPill();
  });

  accountMenu.querySelector('[data-action="switch"]').addEventListener('click', async () => {
    closeMenu();
    if (window.GrudgeCloud?.switchAccount) await GrudgeCloud.switchAccount();
    else if (window.GrudgeCloud?.login) GrudgeCloud.login();
    else window.location.href =
      'https://id.grudge-studio.com/api/auth/page?app=ui-editor&redirect=' + encodeURIComponent(location.href);
  });

  accountMenu.querySelector('[data-action="cloud"]').addEventListener('click', async () => {
    closeMenu();
    if (window.GrudgeCloud?.linkPuterCloud) await GrudgeCloud.linkPuterCloud();
    await refreshAiPill();
  });

  aiPill.addEventListener('click', async () => {
    if (window.GrudgeCloud?.isLoggedIn?.()) {
      toggleMenu();
      return;
    }
    if (window.GrudgeCloud?.login) window.GrudgeCloud.login();
    else if (window.GrudgeAI?.login) window.GrudgeAI.login();
    else
      window.location.href =
        'https://id.grudge-studio.com/api/auth/page?app=ui-editor&redirect=' + encodeURIComponent(location.href);
  });

  async function refreshAiPill() {
    const cloudUser = window.GrudgeCloud?.getUser?.();
    const grudgeIn = window.GrudgeCloud?.isLoggedIn?.();
    const cloudIn = window.GrudgeCloud?.isCloudReady ? await GrudgeCloud.isCloudReady() : false;
    const cloudBtn = accountMenu.querySelector('[data-action="cloud"]');
    const head = document.getElementById('gs-account-head');

    if (grudgeIn && cloudUser?.username) {
      aiPill.classList.add('gs-pill--on');
      aiPill.classList.remove('gs-pill--off');
      const short = cloudUser.username.split(' ')[0];
      aiPill.innerHTML =
        '<span class="gs-pill-name">' +
        short +
        '</span><span class="gs-cloud-dot' +
        (cloudIn ? ' gs-cloud-dot--on' : ' gs-cloud-dot--off') +
        '" title="' +
        (cloudIn ? 'Cloud saves on' : 'Cloud saves off — click menu → Enable cloud saves') +
        '"></span>';
      aiPill.title = cloudIn
        ? 'Signed in as ' + cloudUser.username + ' · cloud on'
        : 'Signed in as ' + cloudUser.username + ' · cloud off';
      if (head) {
        head.innerHTML =
          '<strong>' +
          cloudUser.username +
          '</strong>' +
          (cloudUser.grudgeId ? '<span>' + cloudUser.grudgeId + '</span>' : '') +
          '<em>' +
          (cloudIn ? 'Cloud saves enabled' : 'Local only — enable cloud in menu') +
          '</em>';
      }
      if (cloudBtn) cloudBtn.textContent = cloudIn ? 'Cloud saves on' : 'Enable cloud saves';
      if (cloudBtn) cloudBtn.disabled = !!cloudIn;
      return;
    }

    aiPill.textContent = 'Grudge · sign in';
    aiPill.classList.remove('gs-pill--on');
    aiPill.classList.add('gs-pill--off');
    aiPill.title = 'Sign in with Grudge ID';
    if (head) head.innerHTML = '<em>Not signed in</em>';
    if (cloudBtn) {
      cloudBtn.textContent = 'Enable cloud saves';
      cloudBtn.disabled = true;
    }

    if (!grudgeIn && window.GrudgeAI?.isReady?.()) {
      aiPill.classList.add('gs-pill--on');
      aiPill.classList.remove('gs-pill--off');
      aiPill.textContent = 'Grudge';
      aiPill.title = window.GrudgeAI.statusLabel();
    }
  }

  document.body.classList.add('gs-has-nav');
  document.body.insertBefore(nav, document.body.firstChild);

  window.addEventListener('grudge:auth:ready', () => refreshAiPill());
  window.addEventListener('grudge:auth:logout', () => refreshAiPill());
  window.addEventListener('grudge:auth:storage', () => refreshAiPill());
  window.addEventListener('grudge:cloud:ready', () => refreshAiPill());
  window.addEventListener('grudge:cloud:off', () => refreshAiPill());

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      refreshAiPill();
      setInterval(refreshAiPill, 20000);
    });
  } else {
    refreshAiPill();
    setInterval(refreshAiPill, 20000);
  }
})();