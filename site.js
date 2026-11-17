// ─── Shared theme switching (light / dark, plus "dmt" on pages that offer it) ───
// The theme class is first applied by a tiny inline script in <head> to avoid a
// flash of the wrong theme; this file wires up the switcher and keeps it in sync.
// Pages can react to changes by listening for the "themechange" event on document.
(function () {
  const root = document.documentElement;
  const ALL = ['light', 'dark', 'dmt'];
  const mq = window.matchMedia('(prefers-color-scheme: dark)');
  const buttons = () => document.querySelectorAll('.mode-switcher button');
  const available = () => Array.from(buttons(), b => b.dataset.mode);

  function stored() {
    try { return localStorage.getItem('theme'); } catch (e) { return null; }
  }

  function resolve() {
    const s = stored();
    if (s && available().includes(s)) return s;
    if (s === 'dmt') return 'dark'; // page without the DMT mode
    return mq.matches ? 'dark' : 'light';
  }

  function apply(mode, save) {
    root.classList.remove(...ALL);
    root.classList.add(mode);
    buttons().forEach(b => {
      const on = b.dataset.mode === mode;
      b.classList.toggle('active', on);
      b.setAttribute('aria-pressed', String(on));
    });
    if (save) {
      try { localStorage.setItem('theme', mode); } catch (e) { /* private mode */ }
    }
    document.dispatchEvent(new CustomEvent('themechange', { detail: { mode } }));
  }

  // Don't persist the initial choice, so visitors who never touch the switcher
  // keep following their OS setting.
  apply(resolve(), false);

  document.addEventListener('click', e => {
    const btn = e.target.closest('.mode-switcher button');
    if (btn) apply(btn.dataset.mode, true);
  });

  mq.addEventListener('change', () => {
    if (!stored()) apply(resolve(), false);
  });
})();
