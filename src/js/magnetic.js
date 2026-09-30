/**
 * magnetic.js
 * Magnetic button effect — elements with [data-magnetic] attr
 * shift their position toward the cursor when hovered.
 */

export function initMagnetic() {
  if (window.matchMedia('(hover: none)').matches) return;

  const STRENGTH = 0.35;
  const RADIUS   = 80; // px — how far mouse triggers magnet

  document.querySelectorAll('[data-magnetic]').forEach((el) => {
    let rafId;
    let isHovered = false;

    el.addEventListener('mouseenter', () => { isHovered = true; });

    el.addEventListener('mousemove', (e) => {
      const rect   = el.getBoundingClientRect();
      const cx     = rect.left + rect.width  / 2;
      const cy     = rect.top  + rect.height / 2;
      const dx     = e.clientX - cx;
      const dy     = e.clientY - cy;
      const dist   = Math.sqrt(dx * dx + dy * dy);

      if (dist < RADIUS) {
        cancelAnimationFrame(rafId);
        const moveX = dx * STRENGTH;
        const moveY = dy * STRENGTH;
        rafId = requestAnimationFrame(() => {
          gsap.to(el, {
            x: moveX,
            y: moveY,
            duration: 0.4,
            ease: 'power3.out',
          });
        });
      }
    });

    el.addEventListener('mouseleave', () => {
      isHovered = false;
      cancelAnimationFrame(rafId);
      gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' });
    });
  });
}
