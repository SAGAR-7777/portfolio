/**
 * cursor.js
 * Custom dot + trailing ring cursor.
 * Enlarges on links/buttons.
 * Shows "VIEW" label on work project CTAs.
 * Hidden on touch devices.
 */

export function initCursor() {
  // Don't run on touch-primary devices
  if (window.matchMedia('(hover: none)').matches) return;

  const cursorEl    = document.getElementById('cursor');
  const dot         = cursorEl.querySelector('.cursor-dot');
  const ring        = cursorEl.querySelector('.cursor-ring');
  const label       = cursorEl.querySelector('.cursor-label');

  let mouseX = 0, mouseY = 0;
  let ringX  = 0, ringY  = 0;
  let rafId;

  // Raw mouse tracks the dot exactly
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorEl.style.display = 'block';
  }, { passive: true });

  // Lerp ring toward mouse
  function animateRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;

    dot.style.transform  = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
    ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
    label.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, calc(-50% + 28px))`;

    rafId = requestAnimationFrame(animateRing);
  }
  animateRing();

  // Interactive state on links/buttons
  function onEnter(e) {
    const target = e.currentTarget;
    const cursorLabelText = target.dataset.cursorLabel;

    if (cursorLabelText) {
      document.body.classList.add('cursor-view');
      label.textContent = cursorLabelText;
    } else {
      document.body.classList.add('cursor-hover');
    }
  }

  function onLeave() {
    document.body.classList.remove('cursor-hover', 'cursor-view');
    label.textContent = '';
  }

  function bindInteractives() {
    document.querySelectorAll('a, button, [data-cursor-label]').forEach((el) => {
      el.addEventListener('mouseenter', onEnter);
      el.addEventListener('mouseleave', onLeave);
    });
  }

  bindInteractives();

  // Re-bind if new elements are added (MutationObserver for safety)
  const mo = new MutationObserver(() => bindInteractives());
  mo.observe(document.body, { childList: true, subtree: true });

  return () => {
    cancelAnimationFrame(rafId);
    mo.disconnect();
  };
}
