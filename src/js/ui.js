/**
 * ui.js
 * Miscellaneous UI interactions:
 *  - Mobile menu open/close
 *  - Copy email to clipboard + toast
 *  - Contact form mailto submit
 *  - Footer local time (IST)
 *  - Nav mobile link close
 */

export function initUI() {
  _initMobileMenu();
  _initCopyEmail();
  _initContactForm();
  _initLocalTime();
}

/* ── Mobile Menu ─────────────────────────────────────── */
function _initMobileMenu() {
  const toggle   = document.getElementById('navToggle');
  const menu     = document.getElementById('mobileMenu');
  const close    = document.getElementById('mobileClose');
  const links    = document.querySelectorAll('.mobile-link');

  if (!toggle || !menu) return;

  function openMenu() {
    menu.removeAttribute('hidden');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Close menu');
    document.body.style.overflow = 'hidden';
    // Animate hamburger → X
    const spans = toggle.querySelectorAll('span');
    gsap.to(spans[0], { rotation: 45, y: 6.5, duration: 0.3, ease: 'power3.out' });
    gsap.to(spans[1], { rotation: -45, y: -6.5, duration: 0.3, ease: 'power3.out' });
  }

  function closeMenu() {
    menu.setAttribute('hidden', '');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open menu');
    document.body.style.overflow = '';
    // Reverse hamburger
    const spans = toggle.querySelectorAll('span');
    gsap.to(spans[0], { rotation: 0, y: 0, duration: 0.3, ease: 'power3.out' });
    gsap.to(spans[1], { rotation: 0, y: 0, duration: 0.3, ease: 'power3.out' });
  }

  toggle.addEventListener('click', () => {
    const isOpen = toggle.getAttribute('aria-expanded') === 'true';
    isOpen ? closeMenu() : openMenu();
  });

  close?.addEventListener('click', closeMenu);

  // Close when a link is clicked
  links.forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      closeMenu();
      toggle.focus();
    }
  });
}

/* ── Copy Email ──────────────────────────────────────── */
function _initCopyEmail() {
  const btn = document.getElementById('copyEmailBtn');
  if (!btn) return;

  btn.addEventListener('click', async () => {
    const email = 'nkg45321@gmail.com';
    try {
      await navigator.clipboard.writeText(email);
      _showToast('Email copied to clipboard!');
    } catch {
      // Fallback for browsers that block clipboard
      _showToast('nkg45321@gmail.com');
    }
  });
}

/* ── Contact Form (mailto) ───────────────────────────── */
function _initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name    = form.querySelector('#contactName').value.trim();
    const email   = form.querySelector('#contactEmail').value.trim();
    const message = form.querySelector('#contactMessage').value.trim();

    if (!name || !email || !message) {
      _showToast('Please fill in all fields.');
      return;
    }

    const subject  = encodeURIComponent(`Portfolio Contact from ${name}`);
    const body     = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
    const mailtoURL = `mailto:nkg45321@gmail.com?subject=${subject}&body=${body}`;

    window.location.href = mailtoURL;
    _showToast('Opening your email client...');
  });
}

/* ── Local Time (IST = UTC+5:30) ─────────────────────── */
function _initLocalTime() {
  const timeEl = document.getElementById('localTime');
  if (!timeEl) return;

  function updateTime() {
    const now = new Date();
    const ist = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
    const h   = ist.getHours().toString().padStart(2, '0');
    const m   = ist.getMinutes().toString().padStart(2, '0');
    const s   = ist.getSeconds().toString().padStart(2, '0');
    const ampm = ist.getHours() >= 12 ? 'PM' : 'AM';
    const h12 = (ist.getHours() % 12 || 12).toString().padStart(2, '0');
    timeEl.textContent = `${h12}:${m}:${s} ${ampm} IST`;
  }

  updateTime();
  setInterval(updateTime, 1000);
}

/* ── Toast helper ────────────────────────────────────── */
function _showToast(msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;

  toast.textContent = msg;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 2800);
}
