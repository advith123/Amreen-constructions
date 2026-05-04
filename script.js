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
  const closeMenu = () => {
    if (!navMenu) return;
    navMenu.classList.remove('open');
    navToggle && navToggle.classList.remove('open');
    navToggle && navToggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('nav-open');
  };
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const open = navMenu.classList.toggle('open');
      navToggle.classList.toggle('open', open);
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.classList.toggle('nav-open', open);
    });
    // Close menu when a link is clicked
    navMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', closeMenu);
    });
    // Close on outside click/tap
    document.addEventListener('click', (e) => {
      if (navMenu.classList.contains('open') &&
          !navMenu.contains(e.target) &&
          !navToggle.contains(e.target)) {
        closeMenu();
      }
    });
    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMenu();
    });
    // Close when window resizes above mobile breakpoint
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) closeMenu();
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

  /* ---------- Contact form → WhatsApp ---------- */
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');

  const WA_NUMBER = '917032114099';
  const validateName = (val) => val.trim().length >= 2;
  const validatePhone = (val) => /^[+\d][\d\s\-()]{7,}$/.test(val.trim());
  const validateMessage = (val) => val.trim().length >= 5;

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      status.classList.remove('error', 'success');
      status.textContent = '';

      const name = form.name.value;
      const phone = form.phone.value;
      const propertyRadio = form.querySelector('input[name="propertyType"]:checked');
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
      if (!propertyRadio) {
        status.classList.add('error');
        status.textContent = 'Please select what you\'re looking to build.';
        // Scroll the chips into view if needed
        const chips = form.querySelector('.property-options');
        if (chips) chips.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }
      if (!validateMessage(message)) {
        status.classList.add('error');
        status.textContent = 'Please share a brief message about your project.';
        form.message.focus();
        return;
      }

      const propertyType = propertyRadio.value;

      // Compose pre-filled WhatsApp message
      let waMessage = `Hello Amreen Constructions! 👋\n\n`;
      waMessage += `My name is ${name.trim()}.\n`;
      waMessage += `Phone: ${phone.trim()}\n`;
      waMessage += `I'm interested in: *${propertyType}*\n\n`;
      waMessage += `Project details:\n${message.trim()}\n\n`;
      waMessage += `Please share more information. Thank you!`;

      const waUrl = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(waMessage)}`;

      status.classList.add('success');
      status.textContent = 'Opening WhatsApp...';

      // Open WhatsApp in a new tab — works on both mobile (app) and desktop (web)
      window.open(waUrl, '_blank', 'noopener,noreferrer');

      // Reset form after a short delay
      setTimeout(() => {
        form.reset();
        status.textContent = '';
        status.classList.remove('success');
      }, 2000);
    });
  }

})();
