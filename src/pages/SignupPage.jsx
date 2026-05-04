// src/pages/SignupPage.jsx
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { attemptSignup } from '../store/authSlice';
import { useToast } from '../hooks/useToast';
import OttBackground from '../components/OttBackground';

export default function SignupPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = dispatch(attemptSignup(form.name, form.email, form.password));
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setErrors({});
    toast('Account created! Welcome to LUMIX 🎬', '#10B981');
    navigate('/onboard');
  };

  const inp = 'w-full rounded-lg px-[14px] py-[10px] text-[14px] outline-none transition-all mb-1';
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
        <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 24, fontWeight: 700, marginBottom: 4, color: 'var(--t1)' }}>Create account</div>
        <div style={{ fontSize: 13, color: 'var(--t3)', marginBottom: 28 }}>Start your personalised cinema experience</div>

        <form onSubmit={handleSubmit}>
          {[
            { key: 'name',     label: 'Full Name', type: 'text',     placeholder: 'Enter your Name' },
            { key: 'email',    label: 'Email',     type: 'email',    placeholder: 'Enter your Email' },
            { key: 'password', label: 'Password',  type: 'password', placeholder: 'Min. 8 characters' },
          ].map(({ key, label, type, placeholder }) => (
            <div key={key} className="mb-[14px]">
              <label className="block text-[11px] font-semibold tracking-[0.8px] uppercase mb-[6px]" style={{ color: 'var(--t3)' }}>{label}</label>
              <input
                className={inp}
                style={{ ...inpStyle, marginBottom: 0 }}
                type={type}
                placeholder={placeholder}
                value={form[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              />
              {errors[key] && (
                <div className="text-[11px] mt-1 px-2 py-1 rounded" style={{ color: '#F43F5E', background: 'rgba(244,63,94,0.08)' }}>
                  {errors[key]}
                </div>
              )}
            </div>
          ))}
          <button
            type="submit"
            className="w-full py-3 rounded-[9px] text-white font-bold text-[14px] cursor-pointer transition-all hover:shadow-[0_0_28px_rgba(124,58,237,0.55)] hover:-translate-y-[1px]"
            style={{ fontFamily: 'Syne, sans-serif', background: 'linear-gradient(135deg,#7C3AED,#5B21B6)', border: 'none', letterSpacing: '0.3px' }}
          >
            Create Account
          </button>
        </form>

        <div className="text-center mt-[18px] text-[12px]" style={{ color: 'var(--t3)' }}>
          Already have one? <Link to="/" className="font-semibold hover:underline" style={{ color: 'var(--acc2)' }}>Sign in</Link>
        </div>
      </div>
    </div>
  );
}