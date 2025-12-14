
/**
 * BizimPOS Docsify - Version Switcher
 * - Reads ./versions.json
 * - Detects version from route like: #/v1.0.0/...
 * - If no version in URL, redirects to stored version (or latest)
 * - When switching versions, tries to keep same page path
 */

(function () {
  const STORAGE_KEY = 'docs_version';
  const VERSIONS_URL = './versions.json';

  function parseRoute() {
    const hash = window.location.hash || '';
    // Example: #/v1.0.0/modules/pos
    const m = hash.match(/^#\/v(\d+\.\d+\.\d+)(\/.*)?$/);
    if (!m) return { version: null, rest: null };
    return { version: m[1], rest: m[2] || '/README' };
  }

  function buildRoute(version, rest) {
    // Ensure rest starts with '/'
    const safeRest = rest && rest.startsWith('/') ? rest : ('/' + (rest || 'README'));
    return '#/v' + version + safeRest;
  }

  function replaceVersionInHash(targetVersion, fallbackToReadme = false) {
    const { version, rest } = parseRoute();
    if (!version) {
      // no version in route; go to README for target
      window.location.hash = buildRoute(targetVersion, '/README');
      return;
    }
    if (fallbackToReadme) {
      window.location.hash = buildRoute(targetVersion, '/README');
      return;
    }
    window.location.hash = buildRoute(targetVersion, rest);
  }

  function injectSwitcher(versionsData) {
    const nav = document.querySelector('.app-nav') || document.querySelector('nav.app-nav');
    if (!nav) return;

    // Prevent duplicates
    if (document.getElementById('version-switcher')) return;

    const wrap = document.createElement('div');
    wrap.id = 'version-switcher';

    const label = document.createElement('span');
    label.className = 'vs-label';
    label.innerText = 'Sürüm:';

    const select = document.createElement('select');
    select.setAttribute('aria-label', 'Dokümantasyon sürümü seç');

    versionsData.versions.forEach(v => {
      const opt = document.createElement('option');
      opt.value = v;
      opt.textContent = 'v' + v;
      select.appendChild(opt);
    });

    const current = (parseRoute().version) || localStorage.getItem(STORAGE_KEY) || versionsData.latest;
    select.value = current;

    select.addEventListener('change', function () {
      const v = select.value;
      localStorage.setItem(STORAGE_KEY, v);
      // Try to keep same page, but if it 404s, user can hit README quickly.
      replaceVersionInHash(v, false);
    });

    wrap.appendChild(label);
    wrap.appendChild(select);

    // Put it on the right side of nav (Docsify nav is a UL; we’ll append a flexible container)
    // If structure differs, append to nav anyway.
    nav.appendChild(wrap);
  }

  function ensureVersionInUrl(versionsData) {
    const { version } = parseRoute();
    if (version) {
      localStorage.setItem(STORAGE_KEY, version);
      return;
    }

    const stored = localStorage.getItem(STORAGE_KEY);
    const target = (stored && versionsData.versions.includes(stored)) ? stored : versionsData.latest;

    // Redirect to selected version home
    window.location.hash = buildRoute(target, '/README');
  }

  function init() {
    fetch(VERSIONS_URL, { cache: 'no-store' })
      .then(r => r.json())
      .then(data => {
        // Wait until Docsify renders nav, then inject
        const tryInject = () => {
          injectSwitcher(data);
          if (!document.getElementById('version-switcher')) {
            setTimeout(tryInject, 120);
          }
        };
        tryInject();

        ensureVersionInUrl(data);

        // Keep dropdown in sync on navigation
        window.addEventListener('hashchange', () => {
          const sel = document.querySelector('#version-switcher select');
          const ver = parseRoute().version;
          if (sel && ver) sel.value = ver;
        });
      })
      .catch(err => {
        // If versions.json missing, do nothing
        console.warn('Version switcher failed:', err);
      });
  }

  // start
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
