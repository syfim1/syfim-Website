/* syfim — hero network animation
   Lightweight canvas "data / AI / platform network" visual.
   No external dependencies, respects prefers-reduced-motion. */

(function () {
  const wrap = document.querySelector(".hero-canvas-wrap");
  if (!wrap) return;

  const canvas = document.createElement("canvas");
  wrap.appendChild(canvas);
  const ctx = canvas.getContext("2d");

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let width, height, dpr;
  let nodes = [];
  let mouse = { x: null, y: null };

  const ACCENT = "94, 234, 212";   // teal
  const ACCENT_2 = "124, 140, 255"; // indigo

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = wrap.clientWidth;
    height = wrap.clientHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    initNodes();
  }

  function initNodes() {
    const density = Math.min(width, 1400) / 22000;
    const count = Math.round(width * height * density) || 40;
    const clamped = Math.max(28, Math.min(count, 90));

    nodes = Array.from({ length: clamped }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      r: Math.random() * 1.6 + 1,
      hue: Math.random() > 0.5 ? ACCENT : ACCENT_2,
      pulse: Math.random() * Math.PI * 2,
    }));
  }

  function step() {
    ctx.clearRect(0, 0, width, height);

    const maxDist = Math.min(width, 220);

    for (const n of nodes) {
      n.x += n.vx;
      n.y += n.vy;
      n.pulse += 0.02;

      if (n.x < -20) n.x = width + 20;
      if (n.x > width + 20) n.x = -20;
      if (n.y < -20) n.y = height + 20;
      if (n.y > height + 20) n.y = -20;

      if (mouse.x !== null) {
        const dx = n.x - mouse.x;
        const dy = n.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 140) {
          const force = (140 - dist) / 140;
          n.x += (dx / dist) * force * 0.6;
          n.y += (dy / dist) * force * 0.6;
        }
      }
    }

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i], b = nodes[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < maxDist) {
          const alpha = (1 - dist / maxDist) * 0.35;
          ctx.strokeStyle = `rgba(${ACCENT}, ${alpha})`;
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    for (const n of nodes) {
      const glow = 0.55 + Math.sin(n.pulse) * 0.25;
      ctx.beginPath();
      ctx.fillStyle = `rgba(${n.hue}, ${glow})`;
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fill();
    }

    if (!reduceMotion) {
      requestAnimationFrame(step);
    }
  }

  window.addEventListener("resize", resize);
  wrap.addEventListener("mousemove", (e) => {
    const rect = wrap.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });
  wrap.addEventListener("mouseleave", () => {
    mouse.x = null;
    mouse.y = null;
  });

  resize();
  step();
  if (reduceMotion) {
    // draw a single static frame
    step();
  }
})();
