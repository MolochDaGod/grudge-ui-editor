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

  const pill = document.createElement('span');
  pill.className = 'gs-pill';
  pill.textContent = 'Live';
  nav.appendChild(pill);

  document.body.classList.add('gs-has-nav');
  document.body.insertBefore(nav, document.body.firstChild);
})();