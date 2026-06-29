/* =============================================================
   Knowledge graph — a lightweight force-directed canvas graph
   of the topics Denys works on. No dependencies.
   ============================================================= */
(function () {
  var canvas = document.getElementById('knowledge-graph');
  if (!canvas || !canvas.getContext) return;

  var stage = canvas.parentElement;
  var tooltip = stage.querySelector('.graph-tooltip');
  var ctx = canvas.getContext('2d');

  // --- Theme colours (read from CSS custom properties) -------------------
  var cs = getComputedStyle(document.documentElement);
  function token(name, fallback) {
    var v = cs.getPropertyValue(name);
    return (v && v.trim()) || fallback;
  }
  var COLOR = {
    fg: token('--fg', '#1f1b14'),
    muted: token('--muted', '#756f5d'),
    accent: token('--accent', '#9a5a2b'),
    line: token('--line', '#e3dac6'),
    bg: token('--bg', '#f7f1e3'),
    surface: token('--code-bg', '#fdfaf3')
  };
  var MONO = 'JetBrains Mono, SFMono-Regular, Menlo, Consolas, monospace';

  // --- Graph data --------------------------------------------------------
  var nodes = [
    { id: 'core', label: 'Denys', weight: 30, core: true },
    { id: 'automation', label: 'AI Automation', weight: 19 },
    { id: 'llms', label: 'LLMs', weight: 17 },
    { id: 'rag', label: 'RAG', weight: 13 },
    { id: 'agents', label: 'AI Agents', weight: 15 },
    { id: 'robotics', label: 'Robotics', weight: 17 },
    { id: 'vlas', label: 'VLAs', weight: 12 },
    { id: 'lerobot', label: 'LeRobot', weight: 11 },
    { id: 'ml', label: 'Machine Learning', weight: 16 },
    { id: 'nlp', label: 'NLP', weight: 13 },
    { id: 'speech', label: 'Speech Recognition', weight: 12 },
    { id: 'cv', label: 'Computer Vision', weight: 12 },
    { id: 'kg', label: 'Knowledge Graphs', weight: 13 },
    { id: 'hclust', label: 'Hierarchical Clustering', weight: 11 },
    { id: 'python', label: 'Python', weight: 13 },
    { id: 'research', label: 'Research', weight: 12 },
    { id: 'entrepreneurship', label: 'Entrepreneurship', weight: 16 },
    { id: 'startups', label: 'Startups', weight: 13 },
    { id: 'founding', label: 'Founding', weight: 13 },
    { id: 'business', label: 'Business', weight: 12 },
    { id: 'cdtm', label: 'CDTM', weight: 12 },
    { id: 'product', label: 'Product Building', weight: 12 }
  ];
  var linkPairs = [
    ['core', 'automation'], ['core', 'robotics'], ['core', 'ml'],
    ['core', 'research'], ['core', 'entrepreneurship'], ['core', 'python'],
    ['automation', 'llms'], ['llms', 'rag'], ['llms', 'agents'],
    ['rag', 'kg'], ['agents', 'product'], ['automation', 'agents'],
    ['robotics', 'vlas'], ['robotics', 'lerobot'], ['vlas', 'lerobot'],
    ['vlas', 'ml'], ['ml', 'nlp'], ['nlp', 'speech'], ['ml', 'cv'],
    ['robotics', 'cv'], ['research', 'kg'], ['kg', 'hclust'],
    ['hclust', 'research'], ['ml', 'python'],
    ['entrepreneurship', 'startups'], ['entrepreneurship', 'founding'],
    ['entrepreneurship', 'business'], ['entrepreneurship', 'cdtm'],
    ['startups', 'founding'], ['founding', 'cdtm'], ['startups', 'product']
  ];

  var byId = {};
  nodes.forEach(function (n) { byId[n.id] = n; });
  var links = linkPairs
    .map(function (p) { return { source: byId[p[0]], target: byId[p[1]] }; })
    .filter(function (l) { return l.source && l.target; });

  var adjacency = {};
  links.forEach(function (l) {
    (adjacency[l.source.id] = adjacency[l.source.id] || {})[l.target.id] = true;
    (adjacency[l.target.id] = adjacency[l.target.id] || {})[l.source.id] = true;
  });

  // --- Sizing / DPR ------------------------------------------------------
  var W = 0, H = 0, dpr = 1;
  function radius(n) { return n.weight * 0.46 + 4; }

  function resize() {
    var rect = stage.getBoundingClientRect();
    W = rect.width;
    H = rect.height;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  // --- Initial placement (radial) ---------------------------------------
  function seed() {
    var cx = W / 2, cy = H / 2;
    var spread = Math.min(W, H) * 0.34;
    var k = 0;
    nodes.forEach(function (n) {
      if (n.core) {
        n.x = cx; n.y = cy;
      } else {
        var a = (k / (nodes.length - 1)) * Math.PI * 2;
        n.x = cx + Math.cos(a) * spread * (0.7 + Math.random() * 0.5);
        n.y = cy + Math.sin(a) * spread * (0.7 + Math.random() * 0.5);
        k++;
      }
      n.vx = 0; n.vy = 0;
    });
  }

  // --- Force simulation --------------------------------------------------
  var LINK_DIST = 84;
  var CHARGE = 3000;
  var GRAVITY = 0.012;
  var DAMPING = 0.86;

  function tick() {
    var cx = W / 2, cy = H / 2;

    // pairwise repulsion
    for (var i = 0; i < nodes.length; i++) {
      var a = nodes[i];
      for (var j = i + 1; j < nodes.length; j++) {
        var b = nodes[j];
        var dx = a.x - b.x, dy = a.y - b.y;
        var d2 = dx * dx + dy * dy || 0.01;
        var d = Math.sqrt(d2);
        var min = radius(a) + radius(b) + 14;
        var force = CHARGE / d2;
        if (d < min) force += (min - d) * 0.18; // soft collision
        var fx = (dx / d) * force, fy = (dy / d) * force;
        if (!a.fixed) { a.vx += fx; a.vy += fy; }
        if (!b.fixed) { b.vx -= fx; b.vy -= fy; }
      }
    }

    // link springs
    links.forEach(function (l) {
      var s = l.source, t = l.target;
      var dx = t.x - s.x, dy = t.y - s.y;
      var d = Math.sqrt(dx * dx + dy * dy) || 0.01;
      var rest = LINK_DIST + (s.core || t.core ? 26 : 0);
      var f = (d - rest) * 0.02;
      var fx = (dx / d) * f, fy = (dy / d) * f;
      if (!s.fixed) { s.vx += fx; s.vy += fy; }
      if (!t.fixed) { t.vx -= fx; t.vy -= fy; }
    });

    // gravity toward center + integrate
    nodes.forEach(function (n) {
      if (n.fixed) return;
      n.vx += (cx - n.x) * GRAVITY;
      n.vy += (cy - n.y) * GRAVITY;
      if (n.core) { n.vx += (cx - n.x) * 0.12; n.vy += (cy - n.y) * 0.12; }
      n.vx *= DAMPING;
      n.vy *= DAMPING;
      n.x += n.vx;
      n.y += n.vy;
      var r = radius(n) + 6;
      n.x = Math.max(r, Math.min(W - r, n.x));
      n.y = Math.max(r + 4, Math.min(H - r, n.y));
    });
  }

  // --- Rendering ---------------------------------------------------------
  function draw() {
    ctx.clearRect(0, 0, W, H);

    // links
    links.forEach(function (l) {
      var active = hovered && (l.source === hovered || l.target === hovered);
      ctx.beginPath();
      ctx.moveTo(l.source.x, l.source.y);
      ctx.lineTo(l.target.x, l.target.y);
      ctx.lineWidth = active ? 1.6 : 1;
      ctx.strokeStyle = active ? withAlpha(COLOR.accent, 0.55) : withAlpha(COLOR.muted, 0.28);
      ctx.stroke();
    });

    // nodes
    nodes.forEach(function (n) {
      var r = radius(n);
      var isHover = n === hovered;
      var isNeighbor = hovered && adjacency[hovered.id] && adjacency[hovered.id][n.id];
      var dim = hovered && !isHover && !isNeighbor;

      ctx.beginPath();
      ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
      if (n.core) {
        ctx.fillStyle = COLOR.accent;
      } else if (isHover) {
        ctx.fillStyle = COLOR.accent;
      } else {
        ctx.fillStyle = withAlpha(COLOR.fg, dim ? 0.32 : 0.82);
      }
      ctx.fill();

      if (n.core || isHover) {
        ctx.lineWidth = 3;
        ctx.strokeStyle = withAlpha(COLOR.accent, 0.22);
        ctx.stroke();
      }

      // label (always for core + larger nodes; for the rest only when relevant)
      var showLabel = n.core || isHover || isNeighbor || (!hovered && n.weight >= 16);
      if (showLabel) {
        var fontSize = n.core ? 13 : 11;
        ctx.font = (n.core || isHover ? '600 ' : '500 ') + fontSize + 'px ' + MONO;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillStyle = isHover ? COLOR.accent : (dim ? withAlpha(COLOR.muted, 0.5) : COLOR.fg);
        ctx.fillText(n.label, n.x, n.y + r + 4);
      }
    });
  }

  function withAlpha(hex, a) {
    var h = hex.replace('#', '');
    if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
    var r = parseInt(h.substr(0, 2), 16);
    var g = parseInt(h.substr(2, 2), 16);
    var b = parseInt(h.substr(4, 2), 16);
    return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
  }

  // --- Interaction -------------------------------------------------------
  var hovered = null;
  var dragging = null;
  var pointer = { x: 0, y: 0 };

  function nodeAt(x, y) {
    for (var i = nodes.length - 1; i >= 0; i--) {
      var n = nodes[i];
      var dx = x - n.x, dy = y - n.y;
      var r = radius(n) + 8;
      if (dx * dx + dy * dy <= r * r) return n;
    }
    return null;
  }

  function localPoint(e) {
    var rect = canvas.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  function setTooltip(n) {
    if (!tooltip) return;
    if (n && !n.core) {
      tooltip.textContent = n.label;
      tooltip.style.left = n.x + 'px';
      tooltip.style.top = n.y - radius(n) + 'px';
      tooltip.hidden = false;
    } else {
      tooltip.hidden = true;
    }
  }

  canvas.addEventListener('pointermove', function (e) {
    var p = localPoint(e);
    pointer = p;
    if (dragging) {
      dragging.x = p.x;
      dragging.y = p.y;
      dragging.vx = 0;
      dragging.vy = 0;
      return;
    }
    var n = nodeAt(p.x, p.y);
    hovered = n;
    setTooltip(n);
    canvas.style.cursor = n ? 'pointer' : 'grab';
  });

  canvas.addEventListener('pointerdown', function (e) {
    var p = localPoint(e);
    var n = nodeAt(p.x, p.y);
    if (n) {
      dragging = n;
      n.fixed = true;
      hovered = n;
      canvas.classList.add('is-grabbing');
      canvas.setPointerCapture(e.pointerId);
    }
  });

  function endDrag(e) {
    if (dragging) {
      dragging.fixed = false;
      dragging = null;
      canvas.classList.remove('is-grabbing');
      if (e && e.pointerId != null && canvas.hasPointerCapture(e.pointerId)) {
        canvas.releasePointerCapture(e.pointerId);
      }
    }
  }
  canvas.addEventListener('pointerup', endDrag);
  canvas.addEventListener('pointercancel', endDrag);

  canvas.addEventListener('pointerleave', function () {
    if (!dragging) { hovered = null; setTooltip(null); }
  });

  // --- Loop --------------------------------------------------------------
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function start() {
    resize();
    seed();
    if (reduce) {
      for (var i = 0; i < 320; i++) tick();
      draw();
      // still allow hover redraws
      canvas.addEventListener('pointermove', draw);
      canvas.addEventListener('pointerleave', draw);
    } else {
      requestAnimationFrame(loop);
    }
  }

  function loop() {
    tick();
    draw();
    requestAnimationFrame(loop);
  }

  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      var px = W, py = H;
      resize();
      // rescale positions to new box so layout stays centered
      if (px && py) {
        var sx = W / px, sy = H / py;
        nodes.forEach(function (n) { n.x *= sx; n.y *= sy; });
      }
      if (reduce) draw();
    }, 150);
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
