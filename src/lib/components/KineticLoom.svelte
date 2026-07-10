<!--
  KineticLoom.svelte — interactive canvas hero.
  Resting = woven "loom"; on hover (desktop) / tap (touch) it blooms into a
  constellation of clickable project nodes. Fills its parent container.

  Usage:
    <div class="loom-wrap"><KineticLoom /></div>
    where .loom-wrap has an explicit height (e.g. flex:1 or height: 60vh).

  Props:
    nodes — array of { label, link } (defaults to the portfolio links below)
-->
<script>
  import { onMount } from 'svelte';

  let {
    nodes = [
      { label: 'Exoplanet Atlas', link: 'https://phagehunter.github.io/exoplanetatlas/' },
      { label: 'Human Evolution', link: 'https://phagehunter.github.io/humanevolution/' },
      { label: 'Biodefense Budget', link: 'https://phagehunter.github.io/biodefense/' },
      { label: 'RNA Virome Atlas', link: 'https://phagehunter.github.io/rnaviromeatlas/' },
      { label: 'Odyssey Atlas', link: 'https://phagehunter.github.io/odyssey/' },
      { label: 'Planet Tracker', link: 'https://phagehunter.github.io/terramotus/' },
      { label: 'Google Scholar', link: 'https://scholar.google.com/citations?user=EOEi56EAAAAJ&hl=en' },
      { label: 'LinkedIn', link: 'https://www.linkedin.com/in/phagehunter/' }
    ]
  } = $props();

  let canvas;

  onMount(() => {
    const ctx = canvas.getContext('2d');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches
                    || ('ontouchstart' in window) || navigator.maxTouchPoints > 0;

    const nodeData = nodes.map((n) => ({ ...n, hoverState: 0, cx: undefined, cyBase: undefined }));

    let t = 0, lastTs = 0, mouseX = -9999, mouseY = -9999, pointerInside = false;
    let bloom = 0, bloomTarget = 0, raf = 0;
    let currentNodes = [];

    function sizeCanvas() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.parentElement.clientWidth;
      const h = canvas.parentElement.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function onMouseMove(e) {
      const r = canvas.getBoundingClientRect();
      mouseX = e.clientX - r.left;
      mouseY = e.clientY - r.top;
      pointerInside = true;
      if (!isTouch) bloomTarget = 1;
    }
    function onMouseLeave() {
      pointerInside = false;
      mouseX = mouseY = -9999;
      if (!isTouch) bloomTarget = 0;
      canvas.style.cursor = 'default';
    }
    function openNodeAt(x, y) {
      let opened = false;
      for (const n of currentNodes) {
        if (Math.hypot(x - n.x, y - n.y) < n.r * 1.35 && n.link) {
          window.open(n.link, '_blank', 'noopener');
          opened = true;
        }
      }
      return opened;
    }
    function onClick() {
      if (!isTouch && bloom > 0.5) openNodeAt(mouseX, mouseY);
    }
    function onTouchEnd(e) {
      const r = canvas.getBoundingClientRect();
      const tp = e.changedTouches[0];
      const tx = tp.clientX - r.left, ty = tp.clientY - r.top;
      if (bloom < 0.5) bloomTarget = 1;
      else if (!openNodeAt(tx, ty)) bloomTarget = 0;
      e.preventDefault();
    }

    function drawVesicaIcon(x, y, size, active, hoverState) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(t * 0.15);
      const scaleBoost = 1 + hoverState * 0.2;
      const finalOpacity = active * 0.5 + hoverState * 0.5;
      ctx.lineWidth = 0.8 + hoverState * 0.6;
      ctx.strokeStyle = `rgba(197, 160, 89, ${finalOpacity})`;
      if (hoverState > 0.01) {
        ctx.shadowBlur = hoverState * 20;
        ctx.shadowColor = `rgba(197, 160, 89, ${hoverState * 0.8})`;
      }
      for (let i = 0; i < 6; i++) {
        ctx.rotate((Math.PI * 2) / 6);
        ctx.beginPath();
        ctx.arc((size * scaleBoost) / 2.5, 0, (size * scaleBoost) / 1.8, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.fillStyle = `rgba(226, 232, 240, ${active})`;
      ctx.beginPath();
      ctx.arc(0, 0, 1.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    function drawMotto(text, y, w) {
      const maxW = w - 48;
      let fs = w < 620 ? 8 : 9;
      ctx.textAlign = 'center';
      ctx.font = `400 ${fs}px 'Crimson Pro', serif`;
      ctx.letterSpacing = (w < 620 ? 0.28 : 0.9) + 'em';
      const tw = ctx.measureText(text).width;
      if (tw > maxW) {
        fs = Math.max(6, fs * (maxW / tw));
        ctx.font = `400 ${fs}px 'Crimson Pro', serif`;
      }
      ctx.fillStyle = `rgba(226, 232, 240, ${0.1 + bloom * 0.5})`;
      ctx.fillText(text, w / 2, y);
    }

    function loop(ts) {
      const dt = Math.min((ts - lastTs) / 1000 || 0, 0.05);
      lastTs = ts;
      t += dt * 0.4;
      const w = canvas.clientWidth, h = canvas.clientHeight;
      const centerX = w / 2, centerY = h / 2;
      ctx.clearRect(0, 0, w, h);

      bloom += (bloomTarget - bloom) * 0.06;
      const pulse = (Math.sin(t * 3) + 1) / 2;

      if (bloom > 0.02) {
        for (let r = 0; r < 7; r++) {
          const radius = (55 * r + ((t * 45) % 55)) * bloom;
          const alpha = Math.max(0, 1 - radius / (w * 0.4)) * bloom * (0.12 + pulse * 0.06);
          ctx.beginPath();
          ctx.strokeStyle = `rgba(197, 160, 89, ${alpha})`;
          ctx.lineWidth = 0.6 + pulse * 1.2;
          ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
          ctx.stroke();
        }
      }

      const threadCount = 12;
      const points = Math.max(80, Math.min(180, Math.round(w / 7)));
      for (let s = 0; s < threadCount; s++) {
        ctx.beginPath();
        const offset = (s / threadCount) * Math.PI * 2;
        ctx.strokeStyle = `rgba(197, 160, 89, ${0.3 * (1 - bloom)})`;
        ctx.lineWidth = 0.7;
        for (let i = 0; i <= points; i++) {
          const x = (i / points) * w;
          const xf = x * 0.01;
          const y1 = Math.sin(xf + t + offset) * 48;
          const y2 = Math.cos(xf * 0.5 - t * 0.5 + offset) * 15;
          const disruption = Math.max(0, 250 - Math.abs(x - centerX));
          const jitter = Math.sin(x * 0.5 + t * 12) * (pulse * 14 * bloom * (disruption / 250));
          const y = centerY + (y1 + y2) * (1 - bloom) + jitter;
          if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      const narrow = w < 620;
      const cols = narrow ? 2 : 4;
      const rows = Math.ceil(nodeData.length / cols);
      const nodeSize = narrow ? 30 : 38;
      const spreadY = Math.min(1, (h * 0.42) / Math.max(1, ((rows - 1) / 2) * (h / (rows + 1))));

      currentNodes = [];
      let anyHovered = false;

      nodeData.forEach((data, index) => {
        const row = Math.floor(index / cols);
        const col = index % cols;
        const targetX = (w / (cols + 1)) * (col + 1);
        const ny = (row + 1) / (rows + 1);
        const spreadTargetY = centerY + (ny * h - centerY) * spreadY;
        const baseTargetY = centerY + (spreadTargetY - centerY) * bloom;

        if (data.cx === undefined) { data.cx = targetX; data.cyBase = baseTargetY; }
        data.cx += (targetX - data.cx) * 0.14;
        data.cyBase += (baseTargetY - data.cyBase) * 0.14;

        const x = data.cx;
        const y = data.cyBase + Math.sin(t * 0.7 + col) * 6 * bloom;
        const size = nodeSize * bloom;

        const dist = Math.hypot(mouseX - x, mouseY - y);
        const isHovered = !isTouch && pointerInside && dist < size * 1.3;
        data.hoverState += (isHovered ? 1 - data.hoverState : -data.hoverState) * 0.08;

        drawVesicaIcon(x, y, size, bloom, data.hoverState);
        currentNodes.push({ x, y, r: Math.max(size * 1.3, 26), label: data.label, link: data.link, hover: data.hoverState });
        if (isHovered) anyHovered = true;
      });

      canvas.style.cursor = anyHovered ? 'pointer' : 'default';

      const labelFont = narrow ? "300 10px 'Crimson Pro', serif" : "300 11px 'Crimson Pro', serif";
      for (const n of currentNodes) {
        const strength = isTouch ? bloom : n.hover;
        if (strength > 0.05) {
          ctx.save();
          ctx.font = labelFont;
          ctx.textAlign = 'center';
          ctx.letterSpacing = (narrow ? 0.12 : 0.3 + n.hover * 0.2) + 'em';
          const wobble = isTouch ? 0 : n.hover * 4 + Math.sin(t * 5) * n.hover;
          ctx.fillStyle = `rgba(226, 232, 240, ${strength * 0.9})`;
          ctx.fillText(n.label.toUpperCase(), n.x, n.y + (narrow ? 40 : 50) + wobble);
          ctx.restore();
        }
      }

      drawMotto(bloom > 0.8 ? 'SYSTEMA STABILITUM // ARCHIVUM' : 'OBSERVARE ET COLLIGERE', narrow ? 26 : 30, w);

      if (isTouch && bloom < 0.25) {
        ctx.font = "300 10px 'Crimson Pro', serif";
        ctx.textAlign = 'center';
        ctx.letterSpacing = '0.35em';
        ctx.fillStyle = `rgba(197, 160, 89, ${0.35 + pulse * 0.3})`;
        ctx.fillText('TAP TO EXPLORE', centerX, centerY + Math.min(135, h * 0.3));
      }

      if (!reduceMotion) raf = requestAnimationFrame(loop);
    }

    // Wire up
    sizeCanvas();
    window.addEventListener('resize', sizeCanvas);
    window.addEventListener('orientationchange', sizeCanvas);
    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mouseleave', onMouseLeave);
    canvas.addEventListener('click', onClick);
    canvas.addEventListener('touchend', onTouchEnd, { passive: false });

    if (reduceMotion) { bloom = 1; bloomTarget = 1; loop(0); }
    else raf = requestAnimationFrame(loop);

    // Cleanup on unmount
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', sizeCanvas);
      window.removeEventListener('orientationchange', sizeCanvas);
      canvas.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('mouseleave', onMouseLeave);
      canvas.removeEventListener('click', onClick);
      canvas.removeEventListener('touchend', onTouchEnd);
    };
  });
</script>

<canvas bind:this={canvas} aria-hidden="true"></canvas>

<style>
  canvas {
    display: block;
    width: 100%;
    height: 100%;
    filter: drop-shadow(0 0 20px rgba(197, 160, 89, 0.15));
    touch-action: manipulation;
  }
</style>
