import React, { useEffect, useRef } from 'react';

/**
 * FallingRays — React Bits Pro Component
 * Ethereal vertical light rays falling from top like a rain of light.
 */
export default function FallingRays({
  rayCount = 28,
  color1 = '#0066FF',
  color2 = '#38BDF8',
  rayWidth = 2.2,
  pulseSpeed = 1.2,
  pulseWidth = 200,
  trailLength = 260,
  bgGlow = 'rgba(0, 102, 255, 0.15)',
  angle = 12, // Slight tilt in degrees
  className = ''
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    let animationFrameId;

    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 600);

    const radAngle = (angle * Math.PI) / 180;
    const sinAngle = Math.sin(radAngle);
    const cosAngle = Math.cos(radAngle);

    // Light rays pool
    const rays = [];
    for (let i = 0; i < rayCount; i++) {
      rays.push({
        x: Math.random() * (width + height * Math.abs(sinAngle) + 200) - 100,
        y: Math.random() * (height + trailLength) - trailLength,
        speed: (1.5 + Math.random() * 2.5) * pulseSpeed,
        length: (trailLength * 0.6) + Math.random() * (trailLength * 0.8),
        width: rayWidth * (0.6 + Math.random() * 0.9),
        alpha: 0.2 + Math.random() * 0.65,
        pulseOffset: Math.random() * Math.PI * 2,
        pulseRate: 0.02 + Math.random() * 0.03,
        color: Math.random() > 0.35 ? color1 : color2
      });
    }

    const handleResize = () => {
      const parent = canvas.parentElement;
      width = parent?.clientWidth || window.innerWidth;
      height = parent?.clientHeight || 600;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Render each falling light ray
      for (let i = 0; i < rayCount; i++) {
        const ray = rays[i];

        // Move downwards along angle
        ray.y += ray.speed * cosAngle;
        ray.x += ray.speed * sinAngle;
        ray.pulseOffset += ray.pulseRate;

        // Reset if ray has fallen past bottom
        if (ray.y > height + 50) {
          ray.y = -ray.length - Math.random() * 150;
          ray.x = Math.random() * (width + height * Math.abs(sinAngle) + 200) - 100;
          ray.speed = (1.5 + Math.random() * 2.5) * pulseSpeed;
        }

        const pulse = 0.75 + Math.sin(ray.pulseOffset) * 0.25;
        const currentAlpha = ray.alpha * pulse;

        // Compute ray start & end coordinates
        const x1 = ray.x;
        const y1 = ray.y;
        const x2 = ray.x - ray.length * sinAngle;
        const y2 = ray.y - ray.length * cosAngle;

        // Linear gradient along ray length
        const grad = ctx.createLinearGradient(x2, y2, x1, y1);
        grad.addColorStop(0, 'rgba(0, 102, 255, 0)');
        grad.addColorStop(0.5, ray.color);
        grad.addColorStop(0.9, '#FFFFFF');
        grad.addColorStop(1, '#FFFFFF');

        ctx.save();
        ctx.strokeStyle = grad;
        ctx.lineWidth = ray.width;
        ctx.globalAlpha = Math.max(0, Math.min(1, currentAlpha));
        ctx.shadowColor = ray.color;
        ctx.shadowBlur = 10;
        ctx.lineCap = 'round';

        ctx.beginPath();
        ctx.moveTo(x2, y2);
        ctx.lineTo(x1, y1);
        ctx.stroke();

        // Tip spark
        ctx.fillStyle = '#FFFFFF';
        ctx.globalAlpha = Math.min(1, currentAlpha * 1.2);
        ctx.beginPath();
        ctx.arc(x1, y1, ray.width * 0.9, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [rayCount, color1, color2, rayWidth, pulseSpeed, pulseWidth, trailLength, bgGlow, angle]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none z-0 select-none ${className}`}
      aria-hidden="true"
    />
  );
}