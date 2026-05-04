// src/pages/OnboardPage.jsx
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { completeOnboarding } from '../store/authSlice';
import { toggleGenre } from '../store/mediaSlice';
import { useToast } from '../hooks/useToast';
import { GENRES } from '../data/movies';

export default function OnboardPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();
  const selectedGenres = useSelector((s) => s.media.selectedGenres);
  const [step, setStep] = useState(1);

  const handleFinish = () => {
    dispatch(completeOnboarding());
    toast('Preferences saved — your AI feed is ready!');
    navigate('/home');
  };

  return (
    <div className="min-h-[calc(100vh-58px)] flex flex-col items-center justify-center px-5 py-8 pg-fade"
      style={{ background: 'radial-gradient(ellipse 60% 40% at 50% 0%,rgba(124,58,237,0.1),transparent)' }}>

      {/* Progress */}
      <div className="flex gap-[5px] mb-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-[3px] rounded-sm transition-all" style={{ width: step >= i ? 28 : 20, background: step >= i ? '#9B5CF6' : 'var(--bg4)' }} />
        ))}
      </div>

      <div className="text-[10px] font-bold tracking-[2px] uppercase mb-[10px] px-3 py-1 rounded-[20px] border"
        style={{ color: '#9B5CF6', background: 'rgba(124,58,237,0.12)', borderColor: 'rgba(124,58,237,0.2)' }}>
        Step 1 of 2 — Preferences
      </div>
      <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: 36, fontWeight: 800, textAlign: 'center', marginBottom: 8, lineHeight: 1.1, color: 'var(--t1)' }}>
        What moves you?
      </h1>
      <p style={{ fontSize: 13, color: 'var(--t3)', textAlign: 'center', marginBottom: 32 }}>
        Pick 3+ genres to train your personal AI feed
      </p>

      {/* Genre grid */}
      <div className="grid grid-cols-4 gap-[10px] max-w-[540px] w-full mb-7">
        {GENRES.map((g) => {
          const sel = selectedGenres.includes(g.id);
          return (
            <div key={g.id}
              onClick={() => dispatch(toggleGenre(g.id))}
              className="rounded-[10px] py-4 px-[10px] text-center cursor-pointer transition-all relative overflow-hidden"
              style={{
                background: sel ? 'rgba(124,58,237,0.1)' : 'var(--bg2)',
                border: `1px solid ${sel ? '#9B5CF6' : 'var(--bg4)'}`,
                boxShadow: sel ? '0 0 16px rgba(124,58,237,0.15)' : 'none',
                transform: sel ? 'translateY(-2px)' : 'none',
              }}>
              <span style={{ fontSize: 22, display: 'block', marginBottom: 6, filter: sel ? 'drop-shadow(0 0 6px rgba(124,58,237,0.5))' : 'none' }}>{g.emoji}</span>
              <div style={{ fontSize: 11, fontWeight: 600, color: sel ? '#9B5CF6' : 'var(--t3)', fontFamily: 'Syne, sans-serif', letterSpacing: '0.3px' }}>{g.name}</div>
            </div>
          );
        })}
      </div>

      <button
        onClick={handleFinish}
        disabled={selectedGenres.length < 3}
        className="py-3 rounded-[9px] text-white font-bold text-[14px] transition-all"
        style={{
          width: 280,
          fontFamily: 'Syne, sans-serif',
          background: 'linear-gradient(135deg,#7C3AED,#5B21B6)',
          border: 'none',
          opacity: selectedGenres.length < 3 ? 0.4 : 1,
          cursor: selectedGenres.length < 3 ? 'not-allowed' : 'pointer',
        }}
      >
        Continue — {selectedGenres.length}/3 selected
      </button>
    </div>
  );
}
