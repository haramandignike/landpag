/* ============================================
   SCALR — Main JS
   i18n (FR/EN) · Scroll Reveal · Navbar
   Form → Formspree via fetch (no redirect)
   ============================================ */

'use strict';

/* ============================================
   i18n — LANGUAGE SYSTEM
   ============================================ */
const I18N = (function () {
  const DEFAULT_LANG = 'fr';
  let currentLang = localStorage.getItem('scalr_lang') || DEFAULT_LANG;

  function applyTranslations(lang) {
    const t = TRANSLATIONS[lang];
    if (!t) return;
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (t[key] !== undefined) el.innerHTML = t[key];
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (t[key] !== undefined) el.setAttribute('placeholder', t[key]);
    });
    document.documentElement.setAttribute('lang', lang);
    if (lang === 'fr') {
      document.title = 'Web Design Tana — Système de croissance e-commerce | Projets 25K–50K€';
    } else {
      document.title = 'Web Design Tana — E-Commerce Growth System | 25K–50K€ Projects';
    }
  }

  function updateSwitcher(lang) {
    document.querySelectorAll('.lang-btn').forEach(btn => {
      const active = btn.getAttribute('data-lang') === lang;
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-pressed', String(active));
    });
  }

  function setLanguage(lang) {
    if (!TRANSLATIONS[lang]) return;
    currentLang = lang;
    localStorage.setItem('scalr_lang', lang);
    applyTranslations(lang);
    updateSwitcher(lang);
  }

  function getLang() { return currentLang; }

  function init() {
    applyTranslations(currentLang);
    updateSwitcher(currentLang);
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const lang = btn.getAttribute('data-lang');
        if (lang !== currentLang) setLanguage(lang);
      });
    });
  }

  return { init, setLanguage, getLang };
})();


/* ============================================
   NAVBAR SCROLL
   ============================================ */
(function () {
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });
})();


/* ============================================
   REVEAL ON SCROLL
   ============================================ */
(function () {
  const revealEls = document.querySelectorAll('.reveal');
  if (!revealEls.length) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => {
    const siblings = el.parentElement.querySelectorAll('.reveal');
    if (siblings.length > 1) {
      const idx = Array.from(siblings).indexOf(el);
      el.style.transitionDelay = `${idx * 0.08}s`;
    }
    observer.observe(el);
  });
})();


/* ============================================
   SMOOTH ANCHOR SCROLLING
   ============================================ */
(function () {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const navH = document.getElementById('navbar').offsetHeight;
      const top = target.getBoundingClientRect().top + window.scrollY - navH - 16;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();


/* ============================================
   PHASE HOVER EFFECT
   ============================================ */
(function () {
  document.querySelectorAll('.phase').forEach(phase => {
    phase.style.transition = 'background 0.3s ease, border-color 0.35s ease, transform 0.3s cubic-bezier(0.16,1,0.3,1)';
    phase.addEventListener('mouseenter', () => { phase.style.transform = 'translateX(4px)'; });
    phase.addEventListener('mouseleave', () => { phase.style.transform = 'translateX(0)'; });
  });
})();


/* ============================================
   HERO PARALLAX
   ============================================ */
(function () {
  const heroBg = document.querySelector('.hero-bg-grid');
  const glow1  = document.querySelector('.glow-1');
  const glow2  = document.querySelector('.glow-2');
  if (!heroBg) return;
  window.addEventListener('scroll', () => {
    const s = window.scrollY;
    if (s > window.innerHeight) return;
    heroBg.style.transform = `translateY(${s * 0.3}px)`;
    if (glow1) glow1.style.transform = `translateY(${s * 0.15}px)`;
    if (glow2) glow2.style.transform = `translateY(${s * 0.1}px)`;
  }, { passive: true });
})();


/* ============================================
   HERO TRUST — NUMBER TICKER
   ============================================ */
(function () {
  const heroTrust = document.querySelector('.hero-trust');
  if (!heroTrust) return;
  const numEls  = [
    document.getElementById('trust-num-1'),
    document.getElementById('trust-num-2'),
    document.getElementById('trust-num-3'),
  ];
  const targets = [90, 5, null];
  let animated = false;

  function animateNumber(el, target) {
    if (target === null || !el) return;
    const startTime = performance.now();
    const duration  = 1200;
    function update(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      el.textContent = Math.round(progress * target);
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !animated) {
      animated = true;
      numEls.forEach((el, i) => animateNumber(el, targets[i]));
    }
  }, { threshold: 0.5 }).observe(heroTrust);
})();


/* ============================================
   NAV CTA — HIGHLIGHT ON APPLY SECTION
   ============================================ */
(function () {
  const applySection = document.getElementById('apply');
  const navCta = document.querySelector('.nav-cta');
  if (!applySection || !navCta) return;
  new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      navCta.style.background = 'var(--gold)';
      navCta.style.color = 'var(--black)';
    } else {
      navCta.style.background = '';
      navCta.style.color = '';
    }
  }, { threshold: 0.3 }).observe(applySection);
})();


/* ============================================
   FORM — VALIDATION + FORMSPREE SUBMIT
   ============================================ */
(function () {
  const form      = document.getElementById('apply-form');
  const successEl = document.getElementById('form-success');
  if (!form) return;

  /* --- Inject error styles --- */
  const style = document.createElement('style');
  style.textContent = `
    .form-group.has-error input,
    .form-group.has-error select,
    .form-group.has-error textarea {
      border-color: rgba(220,80,80,0.7) !important;
      background: rgba(220,80,80,0.05) !important;
      box-shadow: 0 0 0 3px rgba(220,80,80,0.08) !important;
    }
    .field-error {
      display: block;
      font-size: 11px;
      color: #d06060;
      font-weight: 400;
      letter-spacing: 0.02em;
      margin-top: 5px;
    }
    .btn-submit:disabled {
      opacity: 0.65;
      cursor: not-allowed;
    }
  `;
  document.head.appendChild(style);

  /* --- Messages par langue --- */
  const msg = {
    fr: { required: 'Ce champ est obligatoire.', sending: 'Envoi en cours…', error: 'Erreur réseau. Veuillez réessayer.' },
    en: { required: 'This field is required.', sending: 'Submitting…', error: 'Network error. Please try again.' }
  };
  function t(key) { return (msg[I18N.getLang()] || msg.fr)[key]; }

  /* --- Validation helpers --- */
  function getError(field) {
    const v = field.value.trim();
    if (!v) return t('required');
    if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) {
      return I18N.getLang() === 'fr' ? 'Email invalide.' : 'Invalid email address.';
    }
    return null;
  }

  function showError(field, msg) {
    const group = field.closest('.form-group');
    if (!group) return;
    group.classList.add('has-error');
    let el = group.querySelector('.field-error');
    if (!el) { el = document.createElement('span'); el.className = 'field-error'; group.appendChild(el); }
    el.textContent = msg;
  }

  function clearError(field) {
    const group = field.closest('.form-group');
    if (!group) return;
    group.classList.remove('has-error');
    const el = group.querySelector('.field-error');
    if (el) el.remove();
  }

  /* --- Live validation on blur/change --- */
  form.querySelectorAll('input, select, textarea').forEach(field => {
    field.addEventListener('blur', () => {
      if (!field.required) return;
      const err = getError(field);
      if (err) showError(field, err); else clearError(field);
    });
    field.addEventListener('change', () => {
      if (field.classList.contains('has-error') || field.closest('.form-group')?.classList.contains('has-error')) {
        const err = getError(field);
        if (err) showError(field, err); else clearError(field);
      }
    });
  });

  /* --- Submit → Formspree via fetch --- */
  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    /* Validate all required fields */
    let hasErrors = false;
    form.querySelectorAll('[required]').forEach(field => {
      const err = getError(field);
      if (err) { showError(field, err); hasErrors = true; }
      else clearError(field);
    });

    if (hasErrors) {
      const firstErr = form.querySelector('.has-error');
      if (firstErr) {
        const top = firstErr.getBoundingClientRect().top + window.scrollY - 120;
        window.scrollTo({ top, behavior: 'smooth' });
      }
      return;
    }

    /* Animate button */
    const btn = form.querySelector('.btn-submit');
    const originalHTML = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = t('sending');

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        /* Success — show success state */
        form.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
        form.style.opacity = '0';
        form.style.transform = 'translateY(-12px)';
        setTimeout(() => {
          form.style.display = 'none';
          if (successEl) {
            successEl.style.display = 'block';
            successEl.style.opacity = '0';
            successEl.style.transform = 'translateY(20px)';
            requestAnimationFrame(() => {
              successEl.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
              successEl.style.opacity = '1';
              successEl.style.transform = 'translateY(0)';
            });
          }
        }, 400);
      } else {
        /* Server error */
        btn.disabled = false;
        btn.innerHTML = originalHTML;
        const errNote = form.querySelector('.form-note');
        if (errNote) {
          errNote.style.color = '#d06060';
          errNote.textContent = t('error');
        }
      }
    } catch (_) {
      /* Network error */
      btn.disabled = false;
      btn.innerHTML = originalHTML;
      const errNote = form.querySelector('.form-note');
      if (errNote) {
        errNote.style.color = '#d06060';
        errNote.textContent = t('error');
      }
    }
  });
})();


/* ============================================
   INIT
   ============================================ */
document.addEventListener('DOMContentLoaded', () => {
  I18N.init();
});
