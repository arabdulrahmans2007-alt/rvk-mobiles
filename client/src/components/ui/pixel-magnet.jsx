import React, { useEffect, useRef } from 'react';

/**
 * PixelMagnet — React Bits Pro Cursor Trail Component
 * Creates an interactive canvas-based cursor trail that magnetizes and pulls pixels
 * with spring physics and digital glow.
 */
export default function PixelMagnet({
  pixelSize = 3.5,
  magnetRadius = 120,
  magneticStrength = 0.55,
  primaryColor = '#0066FF',
  secondaryColor = '#38BDF8',
  glowColor = 'rgba(0, 102, 255, 0.45)',
  particleCount = 45,
  springDamping = 0.88,
  springTension = 0.08,
  enableGridReaction = true,
  className = ''
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Mouse tracker
    const mouse = {
      x: -1000,
      y: -1000,
      targetX: -1000,
      targetY: -1000,
      prevX: -1000,
      prevY: -1000,
      speed: 0,
      isActive: false
    };

    // Magnetized trailing particles pool
    const particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        originX: 0,
        originY: 0,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        size: pixelSize * (0.8 + Math.random() * 0.6),
        alpha: 0,
        targetAlpha: 0,
        color: Math.random() > 0.4 ? primaryColor : secondaryColor,
        life: 0,
        maxLife: 40 + Math.random() * 40,
        active: false
      });
    }

    let spawnIndex = 0;

    // Handle Resize
    const handleResize = () => {
      const dpr = window.devicePixelRatio || 1;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    // Handle Pointer Movement
    const handlePointerMove = (e) => {
      const x = e.clientX || (e.touches && e.touches[0]?.clientX) || mouse.x;
      const y = e.clientY || (e.touches && e.touches[0]?.clientY) || mouse.y;

      if (!mouse.isActive) {
        mouse.x = x;
        mouse.y = y;
        mouse.prevX = x;
        mouse.prevY = y;
      }

      mouse.targetX = x;
      mouse.targetY = y;
      mouse.isActive = true;

      // Spawn magnetized pixel particles in cursor wake
      const dx = x - mouse.prevX;
      const dy = y - mouse.prevY;
      mouse.speed = Math.sqrt(dx * dx + dy * dy);

      const spawnCount = Math.min(4, Math.max(1, Math.floor(mouse.speed / 4)));
      for (let s = 0; s < spawnCount; s++) {
        const p = particles[spawnIndex % particleCount];
        spawnIndex++;

        const angle = Math.random() * Math.PI * 2;
        const dist = Math.random() * (magnetRadius * 0.45);
        p.x = x + Math.cos(angle) * dist;
        p.y = y + Math.sin(angle) * dist;
        p.originX = p.x;
        p.originY = p.y;
        p.vx = (Math.random() - 0.5) * 3 + dx * 0.15;
        p.vy = (Math.random() - 0.5) * 3 + dy * 0.15;
        p.alpha = 0.9;
        p.targetAlpha = 0.9;
        p.life = p.maxLife;
        p.active = true;
      }

      mouse.prevX = x;
      mouse.prevY = y;
    };

    const handlePointerLeave = () => {
      mouse.isActive = false;
      mouse.targetX = -1000;
      mouse.targetY = -1000;
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerleave', handlePointerLeave);
    window.addEventListener('touchmove', handlePointerMove, { passive: true });

    // Main Animation Loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Smooth cursor position interpolation
      mouse.x += (mouse.targetX - mouse.x) * 0.35;
      mouse.y += (mouse.targetY - mouse.y) * 0.35;

      // Render & update magnetized particles
      for (let i = 0; i < particleCount; i++) {
        const p = particles[i];
        if (!p.active) continue;

        // Magnetic pull towards cursor
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (mouse.isActive && dist < magnetRadius && dist > 1) {
          const force = (1 - dist / magnetRadius) * magneticStrength;
          p.vx += (dx / dist) * force * 2.2;
          p.vy += (dy / dist) * force * 2.2;
        }

        // Spring back / damping physics
        p.vx *= springDamping;
        p.vy *= springDamping;
        p.x += p.vx;
        p.y += p.vy;

        p.life--;
        p.alpha = (p.life / p.maxLife) * p.targetAlpha;

        if (p.life <= 0) {
          p.active = false;
          continue;
        }

        // Draw Pixel
        ctx.save();
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, Math.min(1, p.alpha));
        ctx.shadowColor = glowColor;
        ctx.shadowBlur = 6;

        // Digital square pixel
        const s = p.size;
        ctx.fillRect(Math.round(p.x - s / 2), Math.round(p.y - s / 2), Math.round(s), Math.round(s));
        ctx.restore();
      }

      // Draw subtle magnetic pulse ring around active cursor
      if (mouse.isActive && mouse.x > 0 && mouse.y > 0) {
        ctx.save();
        ctx.strokeStyle = primaryColor;
        ctx.globalAlpha = 0.25;
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 5]);
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 14, 0, Math.PI * 2);
        ctx.stroke();

        // Center magnetic pixel
        ctx.fillStyle = primaryColor;
        ctx.globalAlpha = 0.8;
        ctx.fillRect(Math.round(mouse.x - 2), Math.round(mouse.y - 2), 4, 4);
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerleave', handlePointerLeave);
      window.removeEventListener('touchmove', handlePointerMove);
    };
  }, [pixelSize, magnetRadius, magneticStrength, primaryColor, secondaryColor, glowColor, particleCount, springDamping, springTension]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none z-[99999] select-none ${className}`}
      aria-hidden="true"
    />
  );
}