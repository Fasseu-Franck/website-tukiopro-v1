/**
 * TUKIO PRO — E-Voting Page Scripts
 * Navbar, menu mobile, FAQ, scroll reveal, compteur
 */
(function () {
  'use strict';

  /* Navbar scroll */
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    navbar.style.background = window.scrollY > 40 ? 'rgba(10,10,10,0.98)' : 'rgba(10,10,10,0.92)';
  }, { passive: true });

  /* Menu mobile */
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

    mobileMenu.querySelectorAll('.mobile-nav-link').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        mobileMenu.classList.remove('open');
        mobileMenu.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      });
    });
  }

  /* FAQ accordion */
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const isExpanded = btn.getAttribute('aria-expanded') === 'true';
      document.querySelectorAll('.faq-question').forEach(other => {
        if (other !== btn) {
          other.setAttribute('aria-expanded', 'false');
          const ans = document.getElementById(other.getAttribute('aria-controls'));
          if (ans) ans.hidden = true;
        }
      });

      btn.setAttribute('aria-expanded', !isExpanded);
      const answer = document.getElementById(btn.getAttribute('aria-controls'));
      if (answer) answer.hidden = isExpanded;
    });
  });

  /* Scroll reveal */
  const revealObs = new IntersectionObserver(
    entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); revealObs.unobserve(e.target); } }),
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('.reveal, .usecase-card, .feature-row, .testimonial-card, .faq-item').forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = `${(i % 3) * 0.08}s`;
    revealObs.observe(el);
  });

  /* Compteur animé */
  const counterObs = new IntersectionObserver(
    entries => entries.forEach(e => {
      if (e.isIntersecting) {
        const el = e.target, target = parseInt(el.dataset.target, 10), start = performance.now();
        const large = target >= 10000;
        const update = now => {
          const p = Math.min((now - start) / 1800, 1), eased = 1 - Math.pow(1 - p, 3);
          el.textContent = large ? Math.floor(eased * target).toLocaleString('fr-FR') : Math.floor(eased * target);
          if (p < 1) requestAnimationFrame(update);
          else el.textContent = large ? target.toLocaleString('fr-FR') : target;
        };
        requestAnimationFrame(update);
        counterObs.unobserve(el);
      }
    }),
    { threshold: 0.5 }
  );
  
  document.querySelectorAll('.stat-number[data-target]').forEach(el => counterObs.observe(el));

  /* CTA form */
  const submit = document.querySelector('.cta-submit');
  const input = document.querySelector('.cta-input');
  if (submit && input) {
    submit.addEventListener('click', () => {
      if (!input.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim())) {
        input.style.borderColor = '#e05050'; input.focus();
        setTimeout(() => input.style.borderColor = '', 2000); return;
      }
      submit.textContent = 'En cours…'; submit.disabled = true;
      setTimeout(() => { submit.textContent = '✓ Demande envoyée !'; submit.style.background = '#2D6A2D'; submit.style.color = '#fff'; input.value = ''; }, 1200);
    });
  }
})();
