// src/components/Toast.jsx
import { useSelector } from 'react-redux';

export default function Toast() {
  const { message, color, visible } = useSelector((s) => s.toast);
  if (!visible) return null;
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[999] flex items-center gap-3 px-5 py-3 rounded-xl text-[13px] font-medium toast-enter"
      style={{ background: 'var(--bg2)', border: '1px solid var(--bg4)', color: 'var(--t1)', fontFamily: 'Syne, sans-serif', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}>
      <div className="w-2 h-2 rounded-full" style={{ background: color, boxShadow: `0 0 8px ${color}88` }} />
      {message}
    </div>
  );
}
