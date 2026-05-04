// src/pages/AuthPage.jsx
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { attemptLogin, clearLoginError } from '../store/authSlice';
import { useToast } from '../hooks/useToast';
import OttBackground from '../components/OttBackground';

export default function AuthPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();
  const loginError = useSelector((s) => s.auth.loginError);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    dispatch(clearLoginError());
    const success = dispatch(attemptLogin(email, password));
    if (success) {
      toast('Welcome back!', '#10B981');
      navigate('/home');
    }
  };

  const inp = 'w-full rounded-lg px-[14px] py-[10px] text-[14px] outline-none transition-all mb-[14px]';
  const inpStyle = {
    background: 'rgba(17,24,39,0.85)',
    border: '1px solid var(--bg5)',
    color: 'var(--t1)',
    fontFamily: 'Inter, sans-serif',
    backdropFilter: 'blur(6px)',
  };

  return (
    <div
      className="min-h-[calc(100vh-58px)] flex items-center justify-center pg-fade"
      style={{
        position: 'relative',
        background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(124,58,237,0.18), rgba(6,182,212,0.06) 45%, #070B14 75%)',
        overflow: 'hidden',
      }}
    >
      <OttBackground />
      <div
        className="relative z-10 rounded-2xl p-9 w-[380px]"
        style={{
          background: 'rgba(12,17,32,0.82)',
          border: '1px solid rgba(124,58,237,0.22)',
          backdropFilter: 'blur(24px)',
          boxShadow: '0 8px 48px rgba(0,0,0,0.6), 0 0 0 1px rgba(124,58,237,0.06) inset',
        }}
      >
        <div className="mb-[6px]" style={{ fontFamily: 'Syne, sans-serif', fontSize: 20, fontWeight: 800, background: 'linear-gradient(135deg,#7C3AED,#06B6D4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>LUMIX</div>
        <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 24, fontWeight: 700, marginBottom: 4, color: 'var(--t1)' }}>Welcome back</div>
        <div style={{ fontSize: 13, color: 'var(--t3)', marginBottom: 28 }}>Sign in to your cinema dashboard</div>

        {/* Demo credentials hint */}
        <div className="mb-5 px-3 py-2 rounded-lg" style={{ background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.2)', fontSize: 11, color: 'var(--t3)' }}>
          Demo — <span style={{ color: 'var(--t2)' }}>aditya@lumix.com</span> / <span style={{ color: 'var(--t2)' }}>lumix123</span>
        </div>

        <form onSubmit={handleLogin}>
          <label className="block text-[11px] font-semibold tracking-[0.8px] uppercase mb-[6px]" style={{ color: 'var(--t3)' }}>Email</label>
          <input
            className={inp} style={inpStyle} type="email"
            placeholder="aditya@lumix.com"
            value={email} onChange={(e) => setEmail(e.target.value)}
          />
          <label className="block text-[11px] font-semibold tracking-[0.8px] uppercase mb-[6px]" style={{ color: 'var(--t3)' }}>Password</label>
          <input
            className={inp} style={inpStyle} type="password"
            placeholder="••••••••"
            value={password} onChange={(e) => setPassword(e.target.value)}
          />
          {loginError && (
            <div className="text-[12px] mb-3 px-3 py-2 rounded-lg" style={{ color: '#F43F5E', background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.2)' }}>
              {loginError}
            </div>
          )}
          <button
            type="submit"
            className="w-full py-3 rounded-[9px] text-white font-bold text-[14px] cursor-pointer transition-all hover:shadow-[0_0_28px_rgba(124,58,237,0.55)] hover:-translate-y-[1px] active:scale-[0.98]"
            style={{ fontFamily: 'Syne, sans-serif', background: 'linear-gradient(135deg,#7C3AED,#5B21B6)', border: 'none', letterSpacing: '0.3px' }}
          >
            Sign In
          </button>
        </form>

        <div className="text-center mt-[18px] text-[12px]" style={{ color: 'var(--t3)' }}>
          No account? <Link to="/signup" className="font-semibold hover:underline" style={{ color: 'var(--acc2)' }}>Sign up free</Link>
        </div>
      </div>
    </div>
  );
}