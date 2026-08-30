import React, { useEffect, useRef } from 'react';

const AnimatedStarfield = ({ speedMultiplier = 1.0 }) => {
  const canvasRef = useRef(null);
  const speedRef = useRef(speedMultiplier);

  // Keep speedRef updated live without restarting animation loop
  useEffect(() => {
    speedRef.current = speedMultiplier;
  }, [speedMultiplier]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Generate stars
    const starCount = Math.floor((window.innerWidth * window.innerHeight) / 3500);
    const stars = Array.from({ length: starCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 1.5 + 0.5,
      alpha: Math.random(),
      speed: Math.random() * 0.02 + 0.005,
      twinkleSpeed: Math.random() * 0.03 + 0.01,
      color: Math.random() > 0.3 ? '#ffffff' : Math.random() > 0.5 ? '#c084fc' : '#38bdf8'
    }));

    // Generate drifting cosmic dust particles
    const dustCount = 40;
    const dustParticles = Array.from({ length: dustCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 3 + 1,
      speedX: Math.random() * 0.4 + 0.1,
      speedY: (Math.random() - 0.5) * 0.2,
      alpha: Math.random() * 0.5 + 0.2,
      color: Math.random() > 0.5 ? 'rgba(168, 85, 247, ' : 'rgba(56, 189, 248, '
    }));

    let swipeProgress = -0.5;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const mult = Math.max(0.05, speedRef.current);

      // Render Twinkling Stars
      stars.forEach((star) => {
        star.alpha += star.twinkleSpeed * mult;
        if (star.alpha > 1 || star.alpha < 0.2) {
          star.twinkleSpeed = -star.twinkleSpeed;
        }

        star.y -= star.speed * mult;
        if (star.y < 0) {
          star.y = canvas.height;
          star.x = Math.random() * canvas.width;
        }

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = star.color;
        ctx.globalAlpha = Math.max(0.1, Math.min(1, star.alpha));
        ctx.shadowBlur = star.radius * 4;
        ctx.shadowColor = star.color;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Render Drifting Cosmic Dust Particles
      dustParticles.forEach((p) => {
        p.x += p.speedX * mult;
        p.y += p.speedY * mult;

        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color + p.alpha + ')';
        ctx.globalAlpha = p.alpha;
        ctx.fill();
      });

      // Render Periodic Cosmic Light Streak / Swipe Effect
      swipeProgress += 0.003 * mult;
      if (swipeProgress > 1.8) {
        swipeProgress = -0.6;
      }

      if (swipeProgress > -0.2 && swipeProgress < 1.4) {
        const swipeX = swipeProgress * canvas.width;
        const gradient = ctx.createLinearGradient(
          swipeX - 250,
          0,
          swipeX + 250,
          canvas.height
        );
        gradient.addColorStop(0, 'rgba(168, 85, 247, 0)');
        gradient.addColorStop(0.5, 'rgba(192, 132, 252, 0.15)');
        gradient.addColorStop(1, 'rgba(56, 189, 248, 0)');

        ctx.fillStyle = gradient;
        ctx.globalAlpha = 0.8;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-[1]"
    />
  );
};

export default AnimatedStarfield;
