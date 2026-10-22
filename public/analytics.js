(() => {
  const tagId = 'AW-1014492058';
  const storageKey = 'fsz-analytics-consent-v1';
  const dialog = document.getElementById('analytics-consent');
  let consent = null;
  let started = false;
  try { consent = localStorage.getItem(storageKey); } catch { /* Ask again if storage is unavailable. */ }

  function gtag() { window.dataLayer.push(arguments); }

  function start() {
    if (started || consent !== 'granted') return;
    started = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = gtag;
    gtag('consent', 'default', {
      analytics_storage: 'denied', ad_storage: 'denied',
      ad_user_data: 'denied', ad_personalization: 'denied',
    });
    gtag('consent', 'update', { analytics_storage: 'granted' });
    gtag('js', new Date());
    gtag('set', { allow_google_signals: false, allow_ad_personalization_signals: false });
    // Avoid sending query strings, fragments or referring URLs containing visitor input.
    gtag('config', tagId, {
      page_location: location.origin + location.pathname,
      page_referrer: '',
    });
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + tagId;
    document.head.appendChild(script);
  }

  function choose(value) {
    consent = value;
    try { localStorage.setItem(storageKey, value); } catch { /* Choice still applies to this page. */ }
    dialog.close();
    if (value === 'granted') {
      start();
    } else if (started) {
      // Reload removes the running Google script; the saved refusal prevents reloading it.
      window['ga-disable-' + tagId] = true;
      for (const cookie of document.cookie.split(';')) {
        const name = cookie.trim().split('=')[0];
        if (!/^(_ga|_gid|_gat|_gcl)(_|$)/.test(name)) continue;
        const parts = location.hostname.split('.');
        document.cookie = name + '=; Max-Age=0; path=/';
        for (let i = 0; i < parts.length - 1; i++) {
          document.cookie = name + '=; Max-Age=0; path=/; domain=' + parts.slice(i).join('.');
        }
      }
      location.reload();
    }
  }

  document.getElementById('analytics-accept').addEventListener('click', () => choose('granted'));
  document.getElementById('analytics-reject').addEventListener('click', () => choose('denied'));
  document.getElementById('analytics-settings').addEventListener('click', () => dialog.showModal());
  document.addEventListener('click', (event) => {
    if (!started || consent !== 'granted') return;
    const link = event.target instanceof Element ? event.target.closest('a[href]') : null;
    if (!link) return;
    const href = link.getAttribute('href');
    const name = href.startsWith('tel:') ? 'phone_click'
      : href.startsWith('mailto:') ? 'email_click'
      : link.hash === '#kapcsolat' && link.origin === location.origin && link.pathname === location.pathname
        ? 'contact_click' : null;
    if (name) gtag('event', name, { send_to: tagId, transport_type: 'beacon' });
  });

  if (consent === 'granted') start();
  else if (consent !== 'denied') dialog.showModal();
})();
