// src/components/SplashScreen.jsx
import { useEffect, useState } from 'react';

export default function SplashScreen({ onDone }) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    // 0 → black
    // 1 → letters drop in one by one
    // 2 → glow bloom + tagline
    // 3 → particle burst
    // 4 → hold
    // 5 → fade out
    const timers = [
      setTimeout(() => setPhase(1), 400),
      setTimeout(() => setPhase(2), 2000),
      setTimeout(() => setPhase(3), 2600),
      setTimeout(() => setPhase(4), 3400),
      setTimeout(() => setPhase(5), 4400),
      setTimeout(() => onDone(),    5200),
    ];
    return () => timers.forEach(clearTimeout);
  }, [onDone]);

  const letters = ['L','U','M','I','X'];

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@800&family=Inter:wght@300;400&display=swap');

        /* ── Letter drop ── */
        @keyframes letterDrop {
          0%   { opacity:0; transform: translateY(-60px) scaleY(1.4); filter: blur(8px); }
          60%  { opacity:1; transform: translateY(6px) scaleY(0.95);  filter: blur(0); }
          80%  { transform: translateY(-3px) scaleY(1.02); }
          100% { opacity:1; transform: translateY(0) scaleY(1); filter: blur(0); }
        }

        /* ── Letter glow pulse after landing ── */
        @keyframes letterGlow {
          0%,100% { text-shadow: 0 0 20px rgba(124,58,237,0.6), 0 0 60px rgba(124,58,237,0.2); }
          50%     { text-shadow: 0 0 40px rgba(6,182,212,0.8),  0 0 100px rgba(6,182,212,0.3), 0 0 4px #fff; }
        }

        /* ── Underline draw ── */
        @keyframes lineDraw {
          from { width: 0; opacity:0; }
          to   { width: 100%; opacity:1; }
        }

        /* ── Tagline slide up ── */
        @keyframes tagUp {
          from { opacity:0; transform: translateY(18px) letterSpacing(8px); }
          to   { opacity:1; transform: translateY(0); }
        }

        /* ── Particle float ── */
        @keyframes pfloat {
          0%   { transform: translate(0,0) scale(1); opacity:1; }
          100% { transform: translate(var(--px), var(--py)) scale(0); opacity:0; }
        }

        /* ── Outer ring expand ── */
        @keyframes ringExpand {
          0%   { transform: translate(-50%,-50%) scale(0.3); opacity:0.8; }
          100% { transform: translate(-50%,-50%) scale(3.5); opacity:0; }
        }

        /* ── Film frame flicker top/bottom ── */
        @keyframes frameIn {
          from { opacity:0; transform: scaleX(0); }
          to   { opacity:1; transform: scaleX(1); }
        }

        /* ── Scanline crawl ── */
        @keyframes scanCrawl {
          from { top: -4px; }
          to   { top: 100%; }
        }

        /* ── Ambient orb drift ── */
        @keyframes orbDrift {
          0%,100% { transform: translate(0,0) scale(1); }
          33%     { transform: translate(40px,-30px) scale(1.1); }
          66%     { transform: translate(-30px,20px) scale(0.9); }
        }

        /* ── Fade whole screen ── */
        @keyframes screenFade {
          from { opacity:1; }
          to   { opacity:0; }
        }

        /* ── Counter number ── */
        @keyframes countUp {
          from { opacity:0.3; }
          to   { opacity:1; }
        }

        /* ── Logo subtle breathe while holding ── */
        @keyframes logoBreathe {
          0%,100% { filter: drop-shadow(0 0 30px rgba(124,58,237,0.5)) drop-shadow(0 0 10px rgba(6,182,212,0.3)); }
          50%     { filter: drop-shadow(0 0 60px rgba(124,58,237,0.8)) drop-shadow(0 0 30px rgba(6,182,212,0.5)); }
        }

        .splash-letter {
          display: inline-block;
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          line-height: 1;
          opacity: 0;
          background: linear-gradient(180deg, #ffffff 0%, #c4b5fd 60%, #7C3AED 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .splash-letter.landed {
          opacity: 1;
          animation: letterGlow 3s ease-in-out infinite;
        }

        .splash-letter.active {
          animation: letterDrop 0.55s cubic-bezier(0.22,1,0.36,1) forwards;
        }
      `}} />

      <div style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: '#04020A',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden',
        animation: phase >= 5 ? 'screenFade 0.8s ease forwards' : 'none',
      }}>

        {/* ── Ambient background orbs ── */}
        <div style={{
          position:'absolute', width:600, height:600, borderRadius:'50%',
          top:'50%', left:'30%', transform:'translate(-50%,-50%)',
          background:'radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)',
          filter:'blur(60px)',
          animation:'orbDrift 12s ease-in-out infinite',
          opacity: phase >= 1 ? 1 : 0, transition:'opacity 1s',
        }} />
        <div style={{
          position:'absolute', width:400, height:400, borderRadius:'50%',
          top:'60%', left:'65%', transform:'translate(-50%,-50%)',
          background:'radial-gradient(circle, rgba(6,182,212,0.1) 0%, transparent 70%)',
          filter:'blur(50px)',
          animation:'orbDrift 16s 2s ease-in-out infinite reverse',
          opacity: phase >= 1 ? 1 : 0, transition:'opacity 1s 0.3s',
        }} />

        {/* ── Film frame lines top & bottom ── */}
        {phase >= 1 && (
          <>
            <div style={{
              position:'absolute', top:0, left:0, right:0, height:3,
              background:'linear-gradient(90deg, transparent, rgba(124,58,237,0.6) 20%, rgba(6,182,212,0.6) 80%, transparent)',
              animation:'frameIn 0.6s ease forwards',
              transformOrigin:'left center',
            }} />
            <div style={{
              position:'absolute', bottom:0, left:0, right:0, height:3,
              background:'linear-gradient(90deg, transparent, rgba(6,182,212,0.6) 20%, rgba(124,58,237,0.6) 80%, transparent)',
              animation:'frameIn 0.6s 0.15s ease forwards',
              transformOrigin:'right center',
            }} />
          </>
        )}

        {/* ── Scanline crawl (phase 1 only) ── */}
        {phase === 1 && (
          <div style={{
            position:'absolute', left:0, right:0, height:2,
            background:'linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)',
            animation:'scanCrawl 2s linear infinite',
            pointerEvents:'none',
          }} />
        )}

        {/* ── Film grain ── */}
        <div style={{
          position:'absolute', inset:'-50%',
          backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          opacity:0.04, pointerEvents:'none',
        }} />

        {/* ── Ring bursts (phase 3) ── */}
        {phase >= 3 && [0,1,2].map((i) => (
          <div key={i} style={{
            position:'absolute', top:'50%', left:'50%',
            width: 200 + i*120, height: 200 + i*120,
            borderRadius:'50%',
            border:`1px solid rgba(${i===0?'124,58,237':i===1?'6,182,212':'167,139,250'},${0.7 - i*0.2})`,
            animation:`ringExpand ${1.2 + i*0.3}s ${i*0.15}s cubic-bezier(0.2,0,0.8,1) forwards`,
          }} />
        ))}

        {/* ── Particle burst (phase 3) ── */}
        {phase >= 3 && Array.from({length:24}).map((_,i) => {
          const angle  = (i / 24) * 360;
          const dist   = 80 + Math.random() * 120;
          const px = `${Math.cos(angle * Math.PI/180) * dist}px`;
          const py = `${Math.sin(angle * Math.PI/180) * dist}px`;
          const colors = ['#7C3AED','#06B6D4','#A78BFA','#F43F5E','#10B981'];
          const col = colors[i % colors.length];
          return (
            <div key={i} style={{
              position:'absolute', top:'calc(50% - 2px)', left:'calc(50% - 2px)',
              width: 3 + (i%3), height: 3 + (i%3),
              borderRadius:'50%',
              background: col,
              boxShadow:`0 0 6px ${col}`,
              '--px': px, '--py': py,
              animation:`pfloat ${0.8 + Math.random()*0.6}s ${Math.random()*0.3}s ease-out forwards`,
            }} />
          );
        })}

        {/* ── Main logo area ── */}
        <div style={{ position:'relative', textAlign:'center' }}>

          {/* Letters */}
          <div style={{
            fontSize:'clamp(72px,14vw,160px)',
            display:'flex', gap:'0.02em',
            animation: phase >= 4 ? 'logoBreathe 2.5s ease-in-out infinite' : 'none',
          }}>
            {letters.map((l, i) => (
              <span
                key={l}
                className={`splash-letter${phase >= 1 ? ' active' : ''}${phase >= 2 ? ' landed' : ''}`}
                style={{
                  animationDelay: phase >= 1 && phase < 2 ? `${i * 0.12}s` : '0s',
                  animationFillMode:'forwards',
                  fontSize:'inherit',
                }}
              >
                {l}
              </span>
            ))}
          </div>

          {/* Underline draw */}
          <div style={{
            height: 2, marginTop: 6,
            background:'linear-gradient(90deg, #7C3AED, #06B6D4, #A78BFA)',
            borderRadius: 2,
            width: phase >= 2 ? '100%' : '0%',
            opacity: phase >= 2 ? 1 : 0,
            transition:'width 0.8s cubic-bezier(0.4,0,0.2,1), opacity 0.4s ease',
            boxShadow:'0 0 12px rgba(6,182,212,0.6)',
          }} />

          {/* Tagline */}
          <div style={{
            marginTop: 18,
            fontFamily:'Inter, sans-serif',
            fontWeight: 300,
            fontSize:'clamp(11px,2vw,15px)',
            letterSpacing:'6px',
            textTransform:'uppercase',
            color:'rgba(255,255,255,0.5)',
            opacity: phase >= 2 ? 1 : 0,
            transform: phase >= 2 ? 'translateY(0)' : 'translateY(16px)',
            transition:'opacity 0.8s 0.3s ease, transform 0.8s 0.3s ease',
          }}>
            Original Series &amp; Films
          </div>

          {/* Dot indicators */}
          <div style={{
            display:'flex', justifyContent:'center', gap:8, marginTop:28,
            opacity: phase >= 2 ? 1 : 0,
            transition:'opacity 0.6s 0.6s',
          }}>
            {[0,1,2,3,4].map((i) => (
              <div key={i} style={{
                width: i === 2 ? 20 : 6,
                height: 6, borderRadius: 3,
                background: i === 2
                  ? 'linear-gradient(90deg,#7C3AED,#06B6D4)'
                  : 'rgba(255,255,255,0.15)',
                transition:'all 0.4s ease',
              }} />
            ))}
          </div>
        </div>

        {/* ── Bottom loading bar ── */}
        <div style={{
          position:'absolute', bottom:40, left:'50%', transform:'translateX(-50%)',
          width:180, opacity: phase >= 1 ? 1 : 0, transition:'opacity 0.5s',
        }}>
          <div style={{
            display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8,
          }}>
            <span style={{ fontSize:10, color:'rgba(255,255,255,0.25)', fontFamily:'Syne,sans-serif', letterSpacing:'2px' }}>
              LUMIX
            </span>
            <span style={{ fontSize:10, color:'rgba(255,255,255,0.25)', fontFamily:'Inter,sans-serif' }}>
              {phase <= 1 ? '0%' : phase === 2 ? '40%' : phase === 3 ? '70%' : phase >= 4 ? '100%' : ''}
            </span>
          </div>
          <div style={{ height:1, background:'rgba(255,255,255,0.08)', borderRadius:1 }}>
            <div style={{
              height:'100%', borderRadius:1,
              background:'linear-gradient(90deg,#7C3AED,#06B6D4)',
              width: phase <= 1 ? '10%' : phase === 2 ? '40%' : phase === 3 ? '70%' : '100%',
              transition:'width 0.8s cubic-bezier(0.4,0,0.2,1)',
              boxShadow:'0 0 8px rgba(6,182,212,0.5)',
            }} />
          </div>
        </div>

        {/* ── Corner decorations ── */}
        {['topLeft','topRight','bottomLeft','bottomRight'].map((pos) => (
          <div key={pos} style={{
            position:'absolute',
            top: pos.includes('top') ? 16 : 'auto',
            bottom: pos.includes('bottom') ? 16 : 'auto',
            left: pos.includes('Left') ? 16 : 'auto',
            right: pos.includes('Right') ? 16 : 'auto',
            width:20, height:20,
            borderTop: pos.includes('top') ? '1px solid rgba(124,58,237,0.4)' : 'none',
            borderBottom: pos.includes('bottom') ? '1px solid rgba(124,58,237,0.4)' : 'none',
            borderLeft: pos.includes('Left') ? '1px solid rgba(124,58,237,0.4)' : 'none',
            borderRight: pos.includes('Right') ? '1px solid rgba(124,58,237,0.4)' : 'none',
            opacity: phase >= 1 ? 1 : 0,
            transition:'opacity 0.8s 0.4s',
          }} />
        ))}

      </div>
    </>
  );
}