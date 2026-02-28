// ─── Shared light/dark mode switching ───
(function () {
  const root = document.documentElement;
  const modes = ['light', 'dark'];

  function osPrefersDark() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  function applyMode(mode) {
    root.classList.remove('light', 'dark', 'dmt');
    root.classList.add(mode);
    document.querySelectorAll('.mode-switcher button').forEach(b =>
      b.classList.toggle('active', b.dataset.mode === mode)
    );
    localStorage.setItem('theme', mode);
  }

  // Restore saved or detect OS preference
  const saved = localStorage.getItem('theme');
  // Sub-pages only support light/dark — remap dmt to dark
  const initial = (saved && modes.includes(saved)) ? saved
    : (saved === 'dmt') ? 'dark'
    : osPrefersDark() ? 'dark' : 'light';
  applyMode(initial);

  // Wire up switcher buttons
  document.addEventListener('click', e => {
    const btn = e.target.closest('.mode-switcher button');
    if (!btn) return;
    applyMode(btn.dataset.mode);
  });

  // OS preference change
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (!root.classList.contains('light') && !root.classList.contains('dark')) {
      applyMode(osPrefersDark() ? 'dark' : 'light');
    }
  });
})();
