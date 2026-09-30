/**
 * main.js — Portfolio entry point
 * Orchestrates: preloader → Lenis → hero canvas → cursor →
 *               magnetic → animations → UI interactions.
 */

import { runPreloader }    from './preloader.js';
import { initHeroNetwork } from './heroNetwork.js';
import { initCursor }      from './cursor.js';
import { initMagnetic }    from './magnetic.js';
import { initAnimations }  from './animations.js';
import { initUI }          from './ui.js';

async function boot() {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── 1. Run Preloader ─────────────────────────────── */
  await runPreloader();

  /* ── 2. Init Lenis smooth scroll ─────────────────── */
  let lenis = null;
  if (!reduced && typeof Lenis !== 'undefined') {
    lenis = new Lenis({
      lerp:         0.1,
      smoothWheel:  true,
      syncTouch:    false,
    });
    // Lenis tick is handled inside animations.js via gsap.ticker
  }

  /* ── 3. Hero canvas neural network ───────────────── */
  initHeroNetwork();

  /* ── 4. Custom cursor ─────────────────────────────── */
  initCursor();

  /* ── 5. Magnetic buttons ─────────────────────────── */
  initMagnetic();

  /* ── 6. GSAP ScrollTrigger animations ────────────── */
  initAnimations(lenis);

  /* ── 7. UI interactions ───────────────────────────── */
  initUI();
}

// Run on DOMContentLoaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
