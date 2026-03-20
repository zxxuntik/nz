// ===== FALLING LEAVES ANIMATION =====
(function () {
  const canvas = document.getElementById('leavesCanvas');
  const ctx = canvas.getContext('2d');

  let W, H;
  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // Leaf shapes (simple SVG-path-like polygons drawn via canvas)
  const LEAF_COLORS = [
    'rgba(100,160,255,0.55)',
    'rgba(130,90,220,0.45)',
    'rgba(70,180,255,0.40)',
    'rgba(160,120,255,0.38)',
    'rgba(60,140,240,0.50)',
  ];

  const COUNT = 28; // medium density — not distracting
  const leaves = [];

  function randomLeaf() {
    return {
      x: Math.random() * W,
      y: Math.random() * -H,          // start above screen
      size: 14 + Math.random() * 16,   // medium size
      speed: 0.6 + Math.random() * 0.9,
      drift: (Math.random() - 0.5) * 0.7,
      rot: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.025,
      color: LEAF_COLORS[Math.floor(Math.random() * LEAF_COLORS.length)],
      swing: Math.random() * Math.PI * 2,
      swingSpeed: 0.012 + Math.random() * 0.018,
      swingAmp: 18 + Math.random() * 22,
      opacity: 0.45 + Math.random() * 0.45,
    };
  }

  for (let i = 0; i < COUNT; i++) {
    const l = randomLeaf();
    l.y = Math.random() * H; // distribute at start
    leaves.push(l);
  }

  function drawLeaf(l) {
    ctx.save();
    ctx.translate(l.x, l.y);
    ctx.rotate(l.rot);
    ctx.globalAlpha = l.opacity;

    const s = l.size;
    ctx.beginPath();
    // Simple leaf shape: elongated oval with a point
    ctx.moveTo(0, -s * 0.6);
    ctx.bezierCurveTo( s * 0.55, -s * 0.3,  s * 0.55,  s * 0.3, 0,  s * 0.6);
    ctx.bezierCurveTo(-s * 0.55,  s * 0.3, -s * 0.55, -s * 0.3, 0, -s * 0.6);
    ctx.closePath();

    // Gradient fill
    const grad = ctx.createLinearGradient(0, -s * 0.6, 0, s * 0.6);
    grad.addColorStop(0, l.color);
    grad.addColorStop(1, l.color.replace(/[\d.]+\)$/, '0.12)'));
    ctx.fillStyle = grad;
    ctx.fill();

    // Vein
    ctx.beginPath();
    ctx.moveTo(0, -s * 0.55);
    ctx.lineTo(0,  s * 0.55);
    ctx.strokeStyle = l.color.replace(/[\d.]+\)$/, '0.6)');
    ctx.lineWidth = 0.7;
    ctx.stroke();

    ctx.restore();
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);

    for (const l of leaves) {
      l.swing += l.swingSpeed;
      l.x += Math.sin(l.swing) * l.swingAmp * 0.018 + l.drift;
      l.y += l.speed;
      l.rot += l.rotSpeed;

      // Reset when off-screen
      if (l.y > H + l.size * 2) {
        Object.assign(l, randomLeaf());
        l.y = -l.size * 2;
        l.x = Math.random() * W;
      }
      if (l.x > W + l.size) l.x = -l.size;
      if (l.x < -l.size)    l.x =  W + l.size;

      drawLeaf(l);
    }

    requestAnimationFrame(animate);
  }

  animate();
})();
