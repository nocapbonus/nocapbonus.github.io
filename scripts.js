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

  function detectInitialLang(){
  const saved = localStorage.getItem('nocapLang');
  if (saved) return saved;
  const browserLang = (navigator.language || navigator.userLanguage || 'fr').toLowerCase();
  return browserLang.startsWith('fr') ? 'fr' : 'en';
}

function applyLanguage(lang){
  if (!translations || !translations[lang]) lang = 'fr';
  document.documentElement.lang = lang;
  const btnLabel = document.getElementById('langBtnLabel');
  if (btnLabel) btnLabel.textContent = lang.toUpperCase();

  const dict = translations[lang];
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const val = dict[el.dataset.i18n];
    if (val === undefined) return;
    if (val.includes('<')) el.innerHTML = val; else el.textContent = val;
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const val = dict[el.dataset.i18nPlaceholder];
    if (val !== undefined) el.placeholder = val;
  });
  document.querySelectorAll('[data-lang]').forEach(a => {
    a.classList.toggle('lang-active', a.dataset.lang === lang);
  });
  if (window.updateWagerSim) updateWagerSim();
  if (window.onLanguageChange) onLanguageChange(lang);
}

document.addEventListener('DOMContentLoaded', () => {
  applyLanguage(detectInitialLang());
  document.querySelectorAll('[data-lang]').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      localStorage.setItem('nocapLang', a.dataset.lang);
      applyLanguage(a.dataset.lang);
      document.querySelectorAll('.nav-item.open').forEach(i => i.classList.remove('open'));
      const switcher = document.getElementById('langSwitcher');
      if (switcher) switcher.classList.remove('open');
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

  // --- newsletter flottante ---
  const BREVO_FORM_URL = "https://689dffa5.sibforms.com/serve/MUIFADlIis0EgxRVamW0p9kkmiHQr0VPqU3v8gkr94QS4Z47qzPmV4lJqnJ_hDLD8Zr5wnfndX1Pdxg-Ma-b_Hza-OxNwd2QOMrOLSxVQ5SxYYsytponuJSWx2bKwanxHIJenoFVfvQ_aw5lV2x2sGMLNB4YthsMuEcCjKsThJuuYayfWKmCQMaDQh19arbn19kXjdfyjPNBlSiKlg==";
  const nl = document.getElementById('newsletter');
  const newsletterClose = document.getElementById('newsletterClose');
  if (newsletterClose) newsletterClose.addEventListener('click', () => nl.classList.add('hidden'));
  const newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', e => {
      e.preventDefault();
      fetch(BREVO_FORM_URL, { method: 'POST', mode: 'no-cors', body: new FormData(e.target) });
      nl.classList.add('sent');
      setTimeout(() => nl.classList.add('hidden'), 2200);
    });
  }
});