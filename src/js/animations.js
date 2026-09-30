/**
 * animations.js
 * All GSAP + ScrollTrigger section entrance animations.
 * Includes:
 *  - Hero split-text reveal
 *  - Role rotator cycling
 *  - About scroll-word brightening
 *  - Skills cards stagger
 *  - Work cards stagger
 *  - Timeline items stagger + SVG line draw
 *  - Beyond tilt tiles stagger
 *  - Contact headline reveal
 *  - Nav scroll effect
 *  - Parallax on three elements
 *  - Marquee speed-up on scroll
 */

export function initAnimations(lenis) {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── Register ScrollTrigger ──────────────────────── */
  gsap.registerPlugin(ScrollTrigger);

  // Sync GSAP ScrollTrigger with Lenis
  if (lenis) {
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => { lenis.raf(time * 1000); }); // time is in seconds, Lenis expects ms
    gsap.ticker.lagSmoothing(0);
  }

  /* ── NAV scroll effect ───────────────────────────── */
  const header = document.getElementById('siteHeader');
  ScrollTrigger.create({
    start: 'top -80',
    onEnter:      () => header.classList.add('scrolled'),
    onLeaveBack:  () => header.classList.remove('scrolled'),
  });

  /* ── HERO ────────────────────────────────────────── */
  _animateHero(reduced);

  /* ── ABOUT ───────────────────────────────────────── */
  _animateAbout(reduced);

  /* ── SKILLS ──────────────────────────────────────── */
  _animateSkills(reduced);

  /* ── WORK ────────────────────────────────────────── */
  _animateWork(reduced);

  /* ── TIMELINE ────────────────────────────────────── */
  _animateTimeline(reduced);

  /* ── BEYOND ──────────────────────────────────────── */
  _animateBeyond(reduced);

  /* ── CONTACT ─────────────────────────────────────── */
  _animateContact(reduced);

  /* ── PARALLAX ────────────────────────────────────── */
  if (!reduced) _initParallax();
}

/* ════════════════════════════════════════════════════
   HERO
════════════════════════════════════════════════════ */
function _animateHero(reduced) {
  if (reduced) return;

  const tl = gsap.timeline({ delay: 0 }); // plays after preloader resolves

  // Split chars stagger in
  tl.to('.split-char', {
    opacity: 1,
    y: '0%',
    duration: 1.0,
    stagger: 0.045,
    ease: 'power3.out',
  });

  // Eyebrow
  tl.to('.hero-eyebrow', {
    opacity: 1,
    y: 0,
    duration: 0.6,
    ease: 'power3.out',
  }, '-=0.5');

  // Tagline
  tl.to('.hero-tagline', {
    opacity: 1,
    y: 0,
    duration: 0.6,
    ease: 'power3.out',
  }, '-=0.4');

  // CTAs
  tl.to('.hero-ctas', {
    opacity: 1,
    y: 0,
    duration: 0.6,
    ease: 'back.out(1.4)',
  }, '-=0.3');

  // Scroll hint
  tl.to('.hero-scroll-hint', {
    opacity: 1,
    duration: 0.6,
    ease: 'power3.out',
  }, '-=0.3');

  /* Role rotator */
  _startRoleRotator();
}

function _startRoleRotator() {
  const items   = document.querySelectorAll('.role-item');
  let current   = 0;
  let rotatorW  = 0;

  // Size the container to the widest item
  const container = document.querySelector('.hero-role-rotator');
  items.forEach((item) => {
    item.style.position = 'static';
    rotatorW = Math.max(rotatorW, item.offsetWidth);
    item.style.position = '';
  });
  if (container) container.style.width = rotatorW + 'px';

  setInterval(() => {
    const outgoing = items[current];
    current = (current + 1) % items.length;
    const incoming = items[current];

    outgoing.classList.add('leaving');
    outgoing.classList.remove('active');
    incoming.classList.add('active');

    setTimeout(() => {
      outgoing.classList.remove('leaving');
    }, 600);
  }, 2800);
}

/* ════════════════════════════════════════════════════
   ABOUT — scroll-word brightening
════════════════════════════════════════════════════ */
function _animateAbout(reduced) {
  const bio = document.getElementById('aboutBio');
  if (!bio) return;

  // Wrap each word in a span
  const text  = bio.textContent;
  const words = text.split(' ');
  bio.innerHTML = words
    .map((w) => `<span class="word">${w}</span>`)
    .join(' ');

  const wordEls = bio.querySelectorAll('.word');

  if (reduced) {
    wordEls.forEach((w) => w.classList.add('lit'));
    return;
  }

  // ScrollTrigger scrub that lights words as they scroll into view
  ScrollTrigger.create({
    trigger: bio,
    start:   'top 80%',
    end:     'bottom 20%',
    scrub:   1,
    onUpdate: (self) => {
      const progress = self.progress;
      const litCount = Math.floor(progress * wordEls.length * 1.1);
      wordEls.forEach((w, i) => {
        if (i < litCount) w.classList.add('lit');
        else              w.classList.remove('lit');
      });
    },
  });

  // About media parallax
  const media = document.querySelector('.about-media');
  if (media) {
    gsap.to(media, {
      y: -60,
      ease: 'none',
      scrollTrigger: {
        trigger: '#about',
        start: 'top bottom',
        end:   'bottom top',
        scrub: 1.5,
      },
    });
  }

  // About text col stagger
  gsap.from('.about-text-col > *', {
    opacity: 0,
    y: 30,
    duration: 0.8,
    stagger: 0.15,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.about-text-col',
      start: 'top 75%',
    },
  });
}

/* ════════════════════════════════════════════════════
   SKILLS
════════════════════════════════════════════════════ */
function _animateSkills(reduced) {
  if (reduced) {
    document.querySelectorAll('.skill-card').forEach((el) => {
      el.style.opacity = 1;
      el.style.transform = 'none';
    });
    return;
  }

  gsap.to('.skill-card', {
    opacity: 1,
    y: 0,
    duration: 0.8,
    stagger: 0.1,
    ease: 'back.out(1.4)',
    scrollTrigger: {
      trigger: '.skills-map',
      start: 'top 80%',
    },
  });

  // Speed up marquee on fast scroll
  const marquee1 = document.getElementById('marquee1');
  const marquee2 = document.getElementById('marquee2');
  let velocity   = 1;

  ScrollTrigger.create({
    trigger: '.section-skills',
    start:   'top bottom',
    end:     'bottom top',
    scrub:   false,
    onUpdate: (self) => {
      const v = Math.abs(self.getVelocity()) / 200;
      velocity = Math.max(1, Math.min(v, 5));
      if (marquee1) marquee1.style.animationDuration = (25 / velocity) + 's';
      if (marquee2) marquee2.style.animationDuration = (20 / velocity) + 's';
    },
  });
}

/* ════════════════════════════════════════════════════
   WORK
════════════════════════════════════════════════════ */
function _animateWork(reduced) {
  if (reduced) {
    document.querySelectorAll('.work-card').forEach((el) => {
      el.style.opacity = 1;
      el.style.transform = 'none';
    });
    return;
  }

  document.querySelectorAll('.work-card').forEach((card, i) => {
    gsap.to(card, {
      opacity: 1,
      y: 0,
      duration: 1.0,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: card,
        start: 'top 85%',
      },
    });

    // Subtle scale effect on scroll past
    gsap.fromTo(card, {
      scale: 1,
    }, {
      scale: 0.97,
      ease: 'none',
      scrollTrigger: {
        trigger: card,
        start:   'bottom 60%',
        end:     'bottom 20%',
        scrub:   1,
      },
    });
  });
}

/* ════════════════════════════════════════════════════
   TIMELINE
════════════════════════════════════════════════════ */
function _animateTimeline(reduced) {
  if (reduced) {
    document.querySelectorAll('.timeline-item').forEach((el) => {
      el.style.opacity = 1;
      el.style.transform = 'none';
    });
    return;
  }

  const timelineEl = document.querySelector('.timeline');
  const lineEl     = document.getElementById('timelineLine');

  if (timelineEl && lineEl) {
    // The SVG line height tracks the timeline container
    const updateLineHeight = () => {
      lineEl.setAttribute('y2', timelineEl.offsetHeight);
    };
    updateLineHeight();
    window.addEventListener('resize', updateLineHeight, { passive: true });

    // Draw the line on scroll
    gsap.fromTo(lineEl, {
      attr: { y2: 0 }
    }, {
      attr: { y2: () => timelineEl.offsetHeight },
      ease: 'none',
      scrollTrigger: {
        trigger: timelineEl,
        start:   'top 70%',
        end:     'bottom 30%',
        scrub:   1,
      },
    });
  }

  // Items stagger
  document.querySelectorAll('.timeline-item').forEach((item, i) => {
    gsap.to(item, {
      opacity: 1,
      y: 0,
      duration: 0.7,
      ease: 'power3.out',
      delay: i * 0.05,
      scrollTrigger: {
        trigger: item,
        start: 'top 85%',
      },
    });
  });
}

/* ════════════════════════════════════════════════════
   BEYOND (tilt tiles)
════════════════════════════════════════════════════ */
function _animateBeyond(reduced) {
  if (reduced) {
    document.querySelectorAll('.tilt-tile').forEach((el) => {
      el.style.opacity = 1;
      el.style.transform = 'none';
    });
    return;
  }

  gsap.to('.tilt-tile', {
    opacity: 1,
    y: 0,
    duration: 0.8,
    stagger: 0.1,
    ease: 'back.out(1.4)',
    scrollTrigger: {
      trigger: '.beyond-grid',
      start: 'top 80%',
    },
  });

  // 3D tilt on mouse move
  if (!window.matchMedia('(hover: none)').matches) {
    document.querySelectorAll('.tilt-tile').forEach((tile) => {
      tile.addEventListener('mousemove', (e) => {
        const rect  = tile.getBoundingClientRect();
        const cx    = rect.left + rect.width  / 2;
        const cy    = rect.top  + rect.height / 2;
        const rx    = ((e.clientY - cy) / (rect.height / 2)) * -10;
        const ry    = ((e.clientX - cx) / (rect.width  / 2)) *  10;
        tile.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(8px)`;
      });

      tile.addEventListener('mouseleave', () => {
        tile.style.transform = '';
      });
    });
  }
}

/* ════════════════════════════════════════════════════
   CONTACT
════════════════════════════════════════════════════ */
function _animateContact(reduced) {
  if (reduced) return;

  // Split headline lines
  gsap.from('.contact-line', {
    opacity: 0,
    y: 60,
    duration: 1.0,
    stagger: 0.15,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.contact-headline',
      start: 'top 80%',
    },
  });

  gsap.from('.contact-desc, .contact-actions, .contact-links, .contact-form', {
    opacity: 0,
    y: 30,
    duration: 0.7,
    stagger: 0.12,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.contact-desc',
      start: 'top 85%',
    },
  });
}

/* ════════════════════════════════════════════════════
   PARALLAX (three elements at different speeds)
════════════════════════════════════════════════════ */
function _initParallax() {
  // 1. Hero eyebrow — fast
  gsap.to('.hero-eyebrow', {
    y: -40,
    ease: 'none',
    scrollTrigger: {
      trigger: '#hero',
      start: 'top top',
      end:   'bottom top',
      scrub: 0.5,
    },
  });

  // 2. Hero tagline — medium
  gsap.to('.hero-tagline', {
    y: -80,
    ease: 'none',
    scrollTrigger: {
      trigger: '#hero',
      start: 'top top',
      end:   'bottom top',
      scrub: 1,
    },
  });

  // 3. About badge — slow
  gsap.to('.about-badge', {
    y: 30,
    ease: 'none',
    scrollTrigger: {
      trigger: '#about',
      start: 'top bottom',
      end:   'bottom top',
      scrub: 2,
    },
  });
}
