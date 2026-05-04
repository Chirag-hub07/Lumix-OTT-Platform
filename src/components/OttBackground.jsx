// src/components/OttBackground.jsx
import { useEffect, useRef } from 'react';

// Floating movie/show genre pills that drift upward
const PILLS = [
  'ACTION', 'DRAMA', 'SCI-FI', 'THRILLER', 'ROMANCE',
  'COMEDY', 'HORROR', 'ANIME', 'DOCUMENTARY', 'MYSTERY',
  'FANTASY', 'CRIME', 'BIOGRAPHY', 'WESTERN', 'MUSICAL',
  'K-DRAMA', 'BOLLYWOOD', 'NOIR', 'SUPERHERO', 'SPORT',
];

// Fake "now watching" cards that drift across the screen
const NOW_WATCHING = [
  { title: 'Oppenheimer', rating: '9.1', type: 'FILM' },
  { title: 'Breaking Bad', rating: '9.5', type: 'SERIES' },
  { title: 'Interstellar', rating: '8.6', type: 'FILM' },
  { title: 'Succession', rating: '9.3', type: 'SERIES' },
  { title: 'The Batman', rating: '8.4', type: 'FILM' },
  { title: 'Shogun', rating: '9.0', type: 'SERIES' },
  { title: 'Dune: Part Two', rating: '8.5', type: 'FILM' },
  { title: 'Peaky Blinders', rating: '8.8', type: 'SERIES' },
];

export default function OttBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    // Particle canvas — floating light dust
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let raf;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 1.5 + 0.3,
      vx: (Math.random() - 0.5) * 0.3,
      vy: -Math.random() * 0.4 - 0.1,
      alpha: Math.random() * 0.5 + 0.1,
      da: (Math.random() - 0.5) * 0.005,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha += p.da;
        if (p.alpha <= 0.05 || p.alpha >= 0.6) p.da *= -1;
        if (p.y < -10) { p.y = canvas.height + 10; p.x = Math.random() * canvas.width; }
        if (p.x < -10) p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;

        const safeAlpha = Math.max(0, Math.min(1, p.alpha));
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 3);
        grad.addColorStop(0, `rgba(160,120,255,${safeAlpha})`);
        grad.addColorStop(1, 'transparent');
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 3, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 0,
      overflow: 'hidden', pointerEvents: 'none',
      background: 'linear-gradient(135deg, #06040F 0%, #0B0718 40%, #080D1A 70%, #060410 100%)',
    }}>

      {/* Particle canvas */}
      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, opacity: 0.8 }} />

      {/* Deep cinematic vignette */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 80% 70% at 50% 50%, transparent 0%, rgba(4,2,12,0.6) 100%)',
      }} />

      {/* Large ambient orbs */}
      <div style={{
        position: 'absolute', width: 700, height: 700,
        borderRadius: '50%', top: -200, left: -150,
        background: 'radial-gradient(circle, rgba(109,40,217,0.22) 0%, transparent 70%)',
        filter: 'blur(60px)',
        animation: 'ottOrb1 20s ease-in-out infinite',
      }} />
      <div style={{
        position: 'absolute', width: 500, height: 500,
        borderRadius: '50%', bottom: -100, right: -100,
        background: 'radial-gradient(circle, rgba(6,182,212,0.15) 0%, transparent 70%)',
        filter: 'blur(50px)',
        animation: 'ottOrb2 25s ease-in-out infinite',
      }} />
      <div style={{
        position: 'absolute', width: 350, height: 350,
        borderRadius: '50%', top: '40%', right: '20%',
        background: 'radial-gradient(circle, rgba(244,63,94,0.1) 0%, transparent 70%)',
        filter: 'blur(40px)',
        animation: 'ottOrb3 18s ease-in-out infinite',
      }} />

      {/* Film grain overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E")`,
        opacity: 0.4,
      }} />

      {/* Horizontal scan lines — CRT cinema effect */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)',
      }} />

      {/* Floating genre pills */}
      {PILLS.map((pill, i) => {
        const left = (i / PILLS.length) * 95 + Math.sin(i * 2.1) * 5;
        const delay = i * 1.8;
        const dur = 18 + (i % 5) * 4;
        const size = i % 3 === 0 ? 11 : 10;
        return (
          <div
            key={pill}
            style={{
              position: 'absolute',
              left: `${left}%`,
              bottom: '-40px',
              padding: '4px 10px',
              borderRadius: 20,
              fontSize: size,
              fontWeight: 700,
              fontFamily: 'Syne, sans-serif',
              letterSpacing: '1.5px',
              color: i % 4 === 0 ? 'rgba(167,139,250,0.55)'
                : i % 4 === 1 ? 'rgba(94,234,212,0.45)'
                : i % 4 === 2 ? 'rgba(251,191,36,0.4)'
                : 'rgba(248,113,113,0.4)',
              border: `1px solid ${
                i % 4 === 0 ? 'rgba(167,139,250,0.2)'
                : i % 4 === 1 ? 'rgba(94,234,212,0.18)'
                : i % 4 === 2 ? 'rgba(251,191,36,0.18)'
                : 'rgba(248,113,113,0.18)'}`,
              background: 'rgba(255,255,255,0.03)',
              backdropFilter: 'blur(4px)',
              animation: `pillFloat ${dur}s ${delay}s linear infinite`,
              whiteSpace: 'nowrap',
            }}
          >
            {pill}
          </div>
        );
      })}

      {/* Floating "Now Watching" mini cards */}
      {NOW_WATCHING.map((card, i) => {
        const positions = [8, 18, 75, 85, 12, 70, 25, 80];
        const delays = [0, 6, 3, 9, 12, 1, 8, 4];
        const durs = [22, 28, 24, 30, 26, 20, 25, 27];
        const tops = [15, 55, 20, 65, 40, 30, 70, 45];
        return (
          <div
            key={card.title}
            style={{
              position: 'absolute',
              left: `${positions[i]}%`,
              top: `${tops[i]}%`,
              padding: '8px 12px',
              borderRadius: 10,
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              backdropFilter: 'blur(8px)',
              animation: `cardDrift ${durs[i]}s ${delays[i]}s ease-in-out infinite`,
              minWidth: 130,
            }}
          >
            {/* Play indicator */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <div style={{
                width: 6, height: 6, borderRadius: '50%',
                background: '#10B981',
                boxShadow: '0 0 6px #10B981',
                animation: 'livePulse 1.5s ease-in-out infinite',
              }} />
              <span style={{ fontSize: 9, color: 'rgba(16,185,129,0.8)', fontWeight: 700, letterSpacing: '1px', fontFamily: 'Syne, sans-serif' }}>
                WATCHING NOW
              </span>
            </div>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.7)', fontFamily: 'Syne, sans-serif', marginBottom: 3 }}>
              {card.title}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 9, color: 'rgba(251,191,36,0.7)', fontWeight: 700 }}>★ {card.rating}</span>
              <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', padding: '1px 5px', borderRadius: 3, border: '1px solid rgba(255,255,255,0.1)' }}>
                {card.type}
              </span>
            </div>
            {/* Progress bar */}
            <div style={{ marginTop: 6, height: 2, background: 'rgba(255,255,255,0.08)', borderRadius: 2, overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                width: `${30 + (i * 23) % 60}%`,
                background: 'linear-gradient(90deg, #7C3AED, #06B6D4)',
                borderRadius: 2,
              }} />
            </div>
          </div>
        );
      })}

      {/* Diagonal light beams — cinema projector effect */}
      <div style={{
        position: 'absolute', top: 0, left: '30%',
        width: 2, height: '100%',
        background: 'linear-gradient(180deg, rgba(124,58,237,0.08) 0%, transparent 60%)',
        transform: 'skewX(-15deg)',
        animation: 'beamSway 12s ease-in-out infinite',
      }} />
      <div style={{
        position: 'absolute', top: 0, left: '60%',
        width: 1, height: '100%',
        background: 'linear-gradient(180deg, rgba(6,182,212,0.06) 0%, transparent 50%)',
        transform: 'skewX(10deg)',
        animation: 'beamSway 16s 3s ease-in-out infinite reverse',
      }} />

      {/* Bottom gradient fade */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 200,
        background: 'linear-gradient(transparent, rgba(6,4,15,0.8))',
      }} />

      {/* CSS keyframes via style tag */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes ottOrb1 {
          0%, 100% { transform: translate(0,0) scale(1); }
          33%       { transform: translate(80px,-60px) scale(1.1); }
          66%       { transform: translate(-40px,50px) scale(0.9); }
        }
        @keyframes ottOrb2 {
          0%, 100% { transform: translate(0,0) scale(1); }
          40%       { transform: translate(-60px,40px) scale(1.15); }
          70%       { transform: translate(40px,-30px) scale(0.88); }
        }
        @keyframes ottOrb3 {
          0%, 100% { transform: translate(0,0); }
          50%       { transform: translate(30px,60px) scale(1.2); }
        }
        @keyframes pillFloat {
          0%   { transform: translateY(0) rotate(-1deg); opacity: 0; }
          5%   { opacity: 1; }
          95%  { opacity: 0.7; }
          100% { transform: translateY(-105vh) rotate(2deg); opacity: 0; }
        }
        @keyframes cardDrift {
          0%   { transform: translateY(0px) translateX(0px); opacity: 0.35; }
          25%  { transform: translateY(-12px) translateX(8px); opacity: 0.55; }
          50%  { transform: translateY(-6px) translateX(-6px); opacity: 0.45; }
          75%  { transform: translateY(-18px) translateX(4px); opacity: 0.6; }
          100% { transform: translateY(0px) translateX(0px); opacity: 0.35; }
        }
        @keyframes beamSway {
          0%, 100% { opacity: 1; transform: skewX(-15deg) translateX(0); }
          50%       { opacity: 0.4; transform: skewX(-8deg) translateX(20px); }
        }
        @keyframes livePulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.4; transform: scale(0.7); }
        }
      ` }} />
    </div>
  );
}