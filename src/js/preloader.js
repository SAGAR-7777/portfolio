/**
 * preloader.js
 * Choreographed 2-second preloader:
 *  1. Counter counts 0 → 100 while bar fills
 *  2. "SAGAR GUPTA" letters reveal staggered
 *  3. Clip-path wipe dismisses the preloader
 * Returns a Promise that resolves when done.
 */

export function runPreloader() {
  return new Promise((resolve) => {
    const preloader  = document.getElementById('preloader');
    const counter    = document.getElementById('preCounter');
    const barFill    = document.getElementById('preBarFill');
    const letters    = document.querySelectorAll('.pre-letter');
    const reduced    = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduced || !preloader) {
      // Skip animation for reduced-motion users
      if (preloader) {
        preloader.style.display = 'none';
      }
      resolve();
      return;
    }

    // Lock scroll during preloader
    document.body.style.overflow = 'hidden';

    const tl = gsap.timeline({
      onComplete: () => {
        document.body.style.overflow = '';
        resolve();
      }
    });

    // Phase 1: Counter 0 → 100 + bar fill over 1.2s
    let count = 0;
    const counterInterval = setInterval(() => {
      count = Math.min(count + Math.ceil(Math.random() * 5 + 1), 100);
      counter.textContent = count;
      barFill.style.width = count + '%';
      if (count >= 100) clearInterval(counterInterval);
    }, 16);

    // Phase 2: Letters stagger in at 0.6s
    tl.set(letters, { opacity: 0, y: '100%' });
    tl.to(letters, {
      opacity: 1,
      y: '0%',
      duration: 0.7,
      stagger: 0.06,
      ease: 'power3.out',
      delay: 0.6,
    });

    // Brief hold
    tl.to({}, { duration: 0.3 });

    // Phase 3: Clip-path wipe up & out
    tl.to(preloader, {
      clipPath: 'inset(0 0 100% 0)',
      duration: 0.8,
      ease: 'expo.inOut',
      onComplete: () => {
        preloader.style.display = 'none';
      }
    });
  });
}
