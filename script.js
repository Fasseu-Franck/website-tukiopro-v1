/**
 * TUKIO PRO — Home Page Scripts
 * Vanilla JS: menu mobile, FAQ accordion, scroll reveal, compteur animé
 */

(function () {
  'use strict';

  /* ── NAVBAR SCROLL EFFECT ── */
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    navbar.style.background = window.scrollY > 40
      ? 'rgba(10,10,10,0.98)'
      : 'rgba(10,10,10,0.92)';
  }, { passive: true });

  /* ── MENU HAMBURGER MOBILE ── */
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', isOpen);
      mobileMenu.classList.toggle('open', isOpen);
      mobileMenu.setAttribute('aria-hidden', !isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Fermer au clic sur un lien
    mobileMenu.querySelectorAll('.mobile-nav-link').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        mobileMenu.classList.remove('open');
        mobileMenu.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      });
    });

    // Fermer en cliquant hors du menu
    document.addEventListener('click', (e) => {
      if (!navbar.contains(e.target) && mobileMenu.classList.contains('open')) {
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        mobileMenu.classList.remove('open');
        mobileMenu.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      }
    });
  }

  /* ── FAQ ACCORDION ── */
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const isExpanded = btn.getAttribute('aria-expanded') === 'true';
      const answerId = btn.getAttribute('aria-controls');
      const answer = document.getElementById(answerId);

      // Fermer toutes les autres
      document.querySelectorAll('.faq-question').forEach(other => {
        if (other !== btn) {
          other.setAttribute('aria-expanded', 'false');
          const otherId = other.getAttribute('aria-controls');
          const otherAnswer = document.getElementById(otherId);
          if (otherAnswer) otherAnswer.hidden = true;
        }
      });

      // Basculer l'actuel
      btn.setAttribute('aria-expanded', !isExpanded);
      if (answer) answer.hidden = isExpanded;
    });
  });

  /* ── SCROLL REVEAL ── */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  // Appliquer la classe reveal aux sections
  document.querySelectorAll(
    '.service-card, .stat-card, .step-item, .testimonial-card, .faq-item'
  ).forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = `${(i % 4) * 0.07}s`;
    revealObserver.observe(el);
  });

  /* ── COMPTEUR ANIMÉ ── */
  function animateCounter(el, target, suffix) {
    const duration = 1800;
    const start = performance.now();
    const isLarge = target >= 100000;

    function update(now) {
      const progress = Math.min((now - start) / duration, 1);
      // Easing ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * target);

      // Formater les grands nombres
      if (isLarge) {
        el.textContent = current.toLocaleString('fr-FR');
      } else {
        el.textContent = current;
      }

      if (progress < 1) requestAnimationFrame(update);
      else el.textContent = isLarge ? target.toLocaleString('fr-FR') : target;
    }
    requestAnimationFrame(update);
  }

  // Observer pour déclencher au bon moment
  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.dataset.target, 10);
          animateCounter(el, target);
          counterObserver.unobserve(el);
        }
      });
    },
    { threshold: 0.5 }
  );

  document.querySelectorAll('.stat-number[data-target]').forEach(el => {
    counterObserver.observe(el);
  });

  /* ── CTA FORM ── */
  const ctaForm = document.querySelector('.cta-form');
  if (ctaForm) {
    const submit = ctaForm.querySelector('.cta-submit');
    const input = ctaForm.querySelector('.cta-input');

    submit.addEventListener('click', () => {
      const email = input.value.trim();
      // Validation simple
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        input.style.borderColor = '#e05050';
        input.focus();
        setTimeout(() => input.style.borderColor = '', 2000);
        return;
      }
      // Feedback visuel
      submit.textContent = 'En cours…';
      submit.disabled = true;
      setTimeout(() => {
        submit.textContent = '✓ Demande envoyée !';
        submit.style.background = '#2D6A2D';
        submit.style.color = '#fff';
        input.value = '';
      }, 1200);
    });
  }

})();
