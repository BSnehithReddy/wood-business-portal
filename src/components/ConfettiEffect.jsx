import React, { useEffect, useRef } from 'react';

export const ConfettiEffect = ({ active = false, duration = 3000 }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!active) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const colors = ['#f59e0b', '#fbbf24', '#10b981', '#3b82f6', '#ef4444', '#ffffff'];
    const confettiCount = 80;

    const pieces = Array.from({ length: confettiCount }, () => ({
      x: width / 2 + (Math.random() - 0.5) * 200,
      y: height / 2 - 100 + (Math.random() - 0.5) * 100,
      size: Math.random() * 8 + 5,
      color: colors[Math.floor(Math.random() * colors.length)],
      vx: (Math.random() - 0.5) * 12,
      vy: Math.random() * -12 - 4,
      gravity: 0.35,
      rotation: Math.random() * 360,
      vRot: (Math.random() - 0.5) * 10
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      pieces.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.rotation += p.vRot;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    const timer = setTimeout(() => {
      cancelAnimationFrame(animationFrameId);
      ctx.clearRect(0, 0, width, height);
    }, duration);

    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(animationFrameId);
    };
  }, [active, duration]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 2000
      }}
    />
  );
};
