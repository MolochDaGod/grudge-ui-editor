/**
 * UI Kit editor-state cloud sync + deferred bundle boot (index.html only).
 * Mirrors gameuikit:editor-state / gameuikit:profiles → Puter KV via GrudgeCloud.
 */
(function (global) {
  const PREFIX = 'gameuikit:';
  const SLICES = new Set(['editor-state', 'profiles']);
  let syncTimer = null;

  const nativeSet = Storage.prototype.setItem;
  Storage.prototype.setItem = function (key, value) {
    nativeSet.call(this, key, value);
    if (!key.startsWith(PREFIX)) return;
    const slice = key.slice(PREFIX.length);
    if (!SLICES.has(slice)) return;
    clearTimeout(syncTimer);
    syncTimer = setTimeout(async () => {
      if (!global.GrudgeCloud?.saveUIKitSlice) return;
      try {
        const data = JSON.parse(value);
        await GrudgeCloud.saveUIKitSlice(slice, data);
        nativeSet.call(this, PREFIX + '_meta:' + slice, JSON.stringify({ savedAt: Date.now() }));
      } catch {}
    }, 1200);
  };

  async function bootIndexPage() {
    if (global.GrudgeCloud?.bootstrapAuth) await GrudgeCloud.bootstrapAuth();
    if (global.GrudgeCloud?.restoreUIKitFromCloud) await GrudgeCloud.restoreUIKitFromCloud();
    await import('./assets/index-CvSnJIJG.js');
  }

  if (global.document?.getElementById('root')) {
    bootIndexPage().catch((e) => console.error('[UIKitPersist] boot failed', e));
  }

  global.addEventListener('grudge:uikit:storage', (e) => {
    const key = e.detail?.key || '';
    if (key.includes('editor-state') && global.location.pathname.match(/^\/(|index\.html)?$/)) {
      global.location.reload();
    }
  });
})(typeof window !== 'undefined' ? window : globalThis);