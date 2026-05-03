/* ===========================================================
   Amreen Constructions — script.js
   Lightweight vanilla JS for interactions
   =========================================================== */

(function () {
  'use strict';

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Header shadow on scroll ---------- */
  const header = document.getElementById('siteHeader');
  const backToTop = document.getElementById('backToTop');
  const onScroll = () => {
    const y = window.scrollY;
    if (header) header.classList.toggle('scrolled', y > 20);
    if (backToTop) backToTop.classList.toggle('visible', y > 600);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile nav toggle ---------- */
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const open = navMenu.classList.toggle('open');
      navToggle.classList.toggle('open', open);
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    // Close menu when a link is clicked
    navMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        navMenu.classList.remove('open');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- Active link on scroll (scrollspy) ---------- */
  const sections = document.querySelectorAll('main section[id], section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  const setActive = () => {
    const y = window.scrollY + 120;
    let current = 'home';
    sections.forEach(sec => {
      if (sec.offsetTop <= y) current = sec.id;
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
  };
  window.addEventListener('scroll', setActive, { passive: true });

  /* ---------- Reveal-on-scroll animations ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const delay = parseInt(el.getAttribute('data-delay') || '0', 10);
          setTimeout(() => el.classList.add('visible'), delay);
          io.unobserve(el);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => io.observe(el));
  } else {
    // Fallback
    revealEls.forEach(el => el.classList.add('visible'));
  }

  /* ---------- Smooth scroll (for browsers without CSS smooth) ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (!targetId || targetId === '#') return;
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      const offset = 78; // header height
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ---------- Hero dot rotation (visual only) ---------- */
  const dots = document.querySelectorAll('.hero-dots .dot');
  if (dots.length > 1) {
    let i = 0;
    setInterval(() => {
      dots[i].classList.remove('active');
      i = (i + 1) % dots.length;
      dots[i].classList.add('active');
    }, 4000);
  }

  /* ---------- Contact form ---------- */
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');

  const validatePhone = (val) => /^[+\d][\d\s\-()]{7,}$/.test(val.trim());
  const validateName = (val) => val.trim().length >= 2;
  const validateMessage = (val) => val.trim().length >= 5;

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      status.classList.remove('error');
      status.textContent = '';

      const name = form.name.value;
      const phone = form.phone.value;
      const message = form.message.value;

      if (!validateName(name)) {
        status.classList.add('error');
        status.textContent = 'Please enter your name (at least 2 characters).';
        form.name.focus();
        return;
      }
      if (!validatePhone(phone)) {
        status.classList.add('error');
        status.textContent = 'Please enter a valid phone number.';
        form.phone.focus();
        return;
      }
      if (!validateMessage(message)) {
        status.classList.add('error');
        status.textContent = 'Please enter a brief message.';
        form.message.focus();
        return;
      }

      // Compose mailto fallback (opens user's mail client)
      const subject = encodeURIComponent('New Enquiry — Amreen Constructions');
      const body = encodeURIComponent(
        `Name: ${name}\nPhone: ${phone}\n\nMessage:\n${message}`
      );
      const mailto = `mailto:advithreddydanda@gmail.com?subject=${subject}&body=${body}`;

      status.textContent = 'Thank you! Opening your email client to send the message...';
      // Open mailto in a small timeout so the user sees the success state
      setTimeout(() => { window.location.href = mailto; }, 350);

      form.reset();
    });
  }

})();
