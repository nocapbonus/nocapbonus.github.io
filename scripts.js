  window.dataLayer = window.dataLayer || [];

  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-GWM3C3YN6W', {
    anonymize_ip: true,
    send_page_view: true
  });

  document.addEventListener('DOMContentLoaded', function () {
    document.body.addEventListener('click', function (event) {
      var target = event.target.closest('a, button');
      if (!target) return;

      var label = (target.innerText || target.getAttribute('aria-label') || target.value || target.title || target.dataset.label || '').trim();
      var href = target.href || target.getAttribute('data-href') || '';
      var type = target.tagName.toLowerCase();

      gtag('event', 'site_click', {
        event_category: 'interaction',
        event_label: label || 'click',
        link_url: href || window.location.href,
        link_type: type
      });
    });
  });

document.addEventListener('DOMContentLoaded', () => {
  // --- sélecteur de langue : liens réels vers l'autre version, on retient juste le choix ---
  document.querySelectorAll('[data-lang]').forEach(a => {
    a.addEventListener('click', () => {
      localStorage.setItem('nocapLang', a.dataset.lang);
    });
  });
  const langBtn = document.getElementById('langBtn');
  const langSwitcher = document.getElementById('langSwitcher');
  if (langBtn && langSwitcher) {
    langBtn.addEventListener('click', e => {
      e.stopPropagation();
      langSwitcher.classList.toggle('open');
    });
  }
  document.addEventListener('click', () => {
    if (langSwitcher) langSwitcher.classList.remove('open');
  });

  // --- bandeau "View this site in English?" (pages françaises uniquement) ---
  const langBanner = document.getElementById('langBanner');
  if (langBanner) {
    const enUrl = langBanner.dataset.enUrl;
    const saved = localStorage.getItem('nocapLang');
    const floatingNewsletter = document.getElementById('newsletter');
    if (saved === 'en' && enUrl) {
      window.location.href = enUrl;
    } else if (saved !== 'fr') {
      const browserLang = (navigator.language || navigator.userLanguage || 'fr').toLowerCase();
      if (!browserLang.startsWith('fr')) {
        langBanner.classList.add('visible');
        // évite le chevauchement avec la fenêtre Newsletter sur mobile (toutes deux en bas de l'écran)
        if (floatingNewsletter) floatingNewsletter.classList.add('hidden');
      }
    }
    const dismissBanner = () => {
      localStorage.setItem('nocapLang', 'fr');
      langBanner.classList.remove('visible');
      if (floatingNewsletter) floatingNewsletter.classList.remove('hidden');
    };
    const switchLink = document.getElementById('langBannerSwitch');
    if (switchLink) {
      switchLink.addEventListener('click', () => {
        localStorage.setItem('nocapLang', 'en');
      });
    }
    const closeBtn = document.getElementById('langBannerClose');
    if (closeBtn) closeBtn.addEventListener('click', dismissBanner);
    const stayBtn = document.getElementById('langBannerStay');
    if (stayBtn) stayBtn.addEventListener('click', dismissBanner);
  }

  // --- newsletter flottante : mémorisation du choix (toutes pages FR/EN) ---
  const NL_KEY = 'nocapNewsletter';
  const NL_DAYS = 1;
  function nlShouldShow(){
    try {
      const raw = localStorage.getItem(NL_KEY);
      if (!raw) return true;
      const data = JSON.parse(raw);
      if (data.state === 'subscribed') return false;
      if (data.state === 'closed') return (Date.now() - data.at) > NL_DAYS * 864e5;
    } catch (e) {}
    return true;
  }
  function nlRemember(state){
    try { localStorage.setItem(NL_KEY, JSON.stringify({ state, at: Date.now() })); } catch (e) {}
  }
  window.nlRemember = nlRemember;

  const BREVO_FORM_URL = "https://689dffa5.sibforms.com/serve/MUIFADlIis0EgxRVamW0p9kkmiHQr0VPqU3v8gkr94QS4Z47qzPmV4lJqnJ_hDLD8Zr5wnfndX1Pdxg-Ma-b_Hza-OxNwd2QOMrOLSxVQ5SxYYsytponuJSWx2bKwanxHIJenoFVfvQ_aw5lV2x2sGMLNB4YthsMuEcCjKsThJuuYayfWKmCQMaDQh19arbn19kXjdfyjPNBlSiKlg==";
  const nl = document.getElementById('newsletter');
  if (nl && !nlShouldShow()) nl.classList.add('hidden');
  const newsletterClose = document.getElementById('newsletterClose');
  if (newsletterClose) {
    newsletterClose.addEventListener('click', () => {
      nlRemember('closed');
      nl.classList.add('hidden');
    });
  }
  const newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', e => {
      e.preventDefault();
      fetch(BREVO_FORM_URL, { method: 'POST', mode: 'no-cors', body: new FormData(e.target) });
      nlRemember('subscribed');
      nl.classList.add('sent');
      setTimeout(() => nl.classList.add('hidden'), 2200);
    });
  }
});
