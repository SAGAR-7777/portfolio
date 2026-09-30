/**
 * heroNetwork.js
 * Mouse-reactive neural network on the hero canvas.
 * Nodes drift slowly; edges connect when within proximity threshold.
 * Cursor repels nearby nodes.
 * Uses IntersectionObserver to pause when off-screen.
 */

const PALETTE = {
  node:      'rgba(198, 255, 61, %a)',
  edge:      'rgba(198, 255, 61, %a)',
  nodeDark:  'rgba(240, 240, 240, %a)',
  edgeDark:  'rgba(240, 240, 240, %a)',
};

const CONFIG = {
  nodeCount:         80,
  maxEdgeDist:       160,
  repelRadius:       100,
  repelStrength:     0.18,
  driftSpeed:        0.35,
  nodeRadius:        { min: 1.2, max: 3.2 },
  edgeOpacityMax:    0.25,
  nodeOpacityMax:    0.8,
};

class HeroNetwork {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx    = canvas.getContext('2d');
    this.nodes  = [];
    this.mouse  = { x: -9999, y: -9999 };
    this.raf    = null;
    this.active = true;
    this.reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    this._resize   = this._resize.bind(this);
    this._onMouse  = this._onMouse.bind(this);
    this._onTouch  = this._onTouch.bind(this);
    this._tick     = this._tick.bind(this);

    this._init();
  }

  _init() {
    this._resize();
    window.addEventListener('resize', this._resize, { passive: true });
    window.addEventListener('mousemove', this._onMouse, { passive: true });
    window.addEventListener('touchmove', this._onTouch, { passive: true });

    // Pause when hero leaves viewport
    this._observer = new IntersectionObserver(
      ([entry]) => {
        this.active = entry.isIntersecting;
        if (this.active) this._tick();
      },
      { threshold: 0.05 }
    );
    this._observer.observe(this.canvas);

    if (!this.reduced) {
      this._tick();
    } else {
      // Static snapshot for reduced-motion
      this._drawStatic();
    }
  }

  _resize() {
    const { canvas } = this;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width  = canvas.offsetWidth  * dpr;
    canvas.height = canvas.offsetHeight * dpr;
    this.ctx.scale(dpr, dpr);
    this.w = canvas.offsetWidth;
    this.h = canvas.offsetHeight;
    this._spawnNodes();
  }

  _spawnNodes() {
    this.nodes = [];
    for (let i = 0; i < CONFIG.nodeCount; i++) {
      this.nodes.push({
        x:   Math.random() * this.w,
        y:   Math.random() * this.h,
        vx:  (Math.random() - 0.5) * CONFIG.driftSpeed,
        vy:  (Math.random() - 0.5) * CONFIG.driftSpeed,
        r:   CONFIG.nodeRadius.min + Math.random() * (CONFIG.nodeRadius.max - CONFIG.nodeRadius.min),
        baseAlpha: 0.3 + Math.random() * 0.5,
      });
    }
  }

  _onMouse(e) {
    const rect = this.canvas.getBoundingClientRect();
    this.mouse.x = e.clientX - rect.left;
    this.mouse.y = e.clientY - rect.top;
  }

  _onTouch(e) {
    if (!e.touches.length) return;
    const t = e.touches[0];
    const rect = this.canvas.getBoundingClientRect();
    this.mouse.x = t.clientX - rect.left;
    this.mouse.y = t.clientY - rect.top;
  }

  _tick() {
    if (!this.active) return;
    this._update();
    this._draw();
    this.raf = requestAnimationFrame(this._tick);
  }

  _update() {
    const { nodes, mouse, w, h } = this;
    for (const n of nodes) {
      // Drift
      n.x += n.vx;
      n.y += n.vy;

      // Wrap around edges
      if (n.x < -20)   n.x = w + 20;
      if (n.x > w + 20) n.x = -20;
      if (n.y < -20)   n.y = h + 20;
      if (n.y > h + 20) n.y = -20;

      // Cursor repulsion
      const dx = n.x - mouse.x;
      const dy = n.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < CONFIG.repelRadius && dist > 0) {
        const force = (1 - dist / CONFIG.repelRadius) * CONFIG.repelStrength;
        n.vx += (dx / dist) * force;
        n.vy += (dy / dist) * force;
      }

      // Dampen velocity (max speed)
      const speed = Math.sqrt(n.vx * n.vx + n.vy * n.vy);
      if (speed > CONFIG.driftSpeed * 3) {
        n.vx = (n.vx / speed) * CONFIG.driftSpeed * 3;
        n.vy = (n.vy / speed) * CONFIG.driftSpeed * 3;
      }

      // Gradually return to drift speed
      n.vx *= 0.98;
      n.vy *= 0.98;
      if (Math.abs(n.vx) < 0.02) n.vx = (Math.random() - 0.5) * CONFIG.driftSpeed * 0.5;
      if (Math.abs(n.vy) < 0.02) n.vy = (Math.random() - 0.5) * CONFIG.driftSpeed * 0.5;
    }
  }

  _draw() {
    const { ctx, nodes, w, h } = this;
    ctx.clearRect(0, 0, w, h);

    // Draw edges
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i], b = nodes[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONFIG.maxEdgeDist) {
          const alpha = (1 - dist / CONFIG.maxEdgeDist) * CONFIG.edgeOpacityMax;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(198, 255, 61, ${alpha.toFixed(3)})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }

    // Draw nodes
    for (const n of nodes) {
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(198, 255, 61, ${n.baseAlpha.toFixed(3)})`;
      ctx.fill();
    }
  }

  _drawStatic() {
    // Single static frame for reduced-motion users
    this._draw();
  }

  destroy() {
    cancelAnimationFrame(this.raf);
    window.removeEventListener('resize', this._resize);
    window.removeEventListener('mousemove', this._onMouse);
    window.removeEventListener('touchmove', this._onTouch);
    this._observer?.disconnect();
  }
}

export function initHeroNetwork() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return null;
  return new HeroNetwork(canvas);
}
