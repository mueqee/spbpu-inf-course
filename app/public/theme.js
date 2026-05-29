(function () {
  const STORAGE_KEY = 'ege-theme';
  const OPTIONS = ['light', 'dark', 'system'];

  function getPreference() {
    const stored = localStorage.getItem(STORAGE_KEY);
    return OPTIONS.includes(stored) ? stored : 'light';
  }

  function isDark(preference) {
    if (preference === 'dark') return true;
    if (preference === 'light') return false;
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  function apply(preference) {
    const pref = preference || getPreference();
    document.documentElement.dataset.theme = pref;
    document.documentElement.classList.toggle('theme-dark', isDark(pref));
    syncUi(pref);
  }

  function setPreference(preference) {
    localStorage.setItem(STORAGE_KEY, preference);
    apply(preference);
  }

  function syncUi(preference) {
    document.querySelectorAll('[data-theme-option]').forEach((btn) => {
      const active = btn.getAttribute('data-theme-option') === preference;
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-checked', active ? 'true' : 'false');
    });
  }

  function bindUi() {
    const root = document.querySelector('[data-theme-menu]');
    const trigger = document.querySelector('[data-theme-trigger]');
    if (!root || !trigger) return;

    trigger.addEventListener('click', (event) => {
      event.stopPropagation();
      const open = root.classList.toggle('open');
      trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    root.querySelectorAll('[data-theme-option]').forEach((btn) => {
      btn.addEventListener('click', () => {
        setPreference(btn.getAttribute('data-theme-option'));
        root.classList.remove('open');
        trigger.setAttribute('aria-expanded', 'false');
      });
    });

    document.addEventListener('click', (event) => {
      if (!root.contains(event.target)) {
        root.classList.remove('open');
        trigger.setAttribute('aria-expanded', 'false');
      }
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        root.classList.remove('open');
        trigger.setAttribute('aria-expanded', 'false');
      }
    });

    syncUi(getPreference());
  }

  window.EgeTheme = { apply, setPreference, getPreference };

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (getPreference() === 'system') apply('system');
  });

  document.addEventListener('DOMContentLoaded', bindUi);
})();
