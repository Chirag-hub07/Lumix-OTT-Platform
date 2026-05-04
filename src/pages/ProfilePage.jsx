// src/pages/ProfilePage.jsx
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toggleGenre, selectAllMedia } from '../store/mediaSlice';
import { logout, login } from '../store/authSlice';
import { useToast } from '../hooks/useToast';
import MovieCard from '../components/MovieCard';
import { GENRES, GENRE_COLORS } from '../data/movies';

const STORAGE_KEY = 'lumix_users';

function getStoredUsers() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function updateStoredUser(oldEmail, updated) {
  try {
    const users = getStoredUsers();
    const idx = users.findIndex((u) => u.email.toLowerCase() === oldEmail.toLowerCase());
    if (idx >= 0) {
      users[idx] = { ...users[idx], ...updated };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    }
  } catch { /* ignore */ }
}

// ── Edit Profile Modal ────────────────────────────────────────────────────────
function EditProfileModal({ user, selectedGenres, onClose, onSave, onToggleGenre }) {
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [errors, setErrors] = useState({});
  const [section, setSection] = useState('info');

  const inpStyle = {
    width: '100%', borderRadius: 8, padding: '10px 14px', fontSize: 14,
    outline: 'none', background: 'rgba(17,24,39,0.85)', border: '1px solid var(--bg5)',
    color: 'var(--t1)', fontFamily: 'Inter, sans-serif', backdropFilter: 'blur(6px)',
    marginBottom: 14, boxSizing: 'border-box',
  };

  const labelStyle = {
    display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: '0.8px',
    textTransform: 'uppercase', color: 'var(--t3)', marginBottom: 6,
    fontFamily: 'Syne, sans-serif',
  };

  const validateInfo = () => {
    const e = {};
    if (!name.trim()) e.name = 'Name is required';
    if (!email.includes('@') || !email.includes('.')) e.email = 'Valid email required';
    return e;
  };

  const validatePassword = () => {
    const e = {};
    const users = getStoredUsers();
    const match = users.find((u) => u.email.toLowerCase() === user.email.toLowerCase());
    if (!match || match.password !== currentPass) e.currentPass = 'Current password is incorrect';
    if (newPass.length < 8) e.newPass = 'Minimum 8 characters';
    if (newPass !== confirmPass) e.confirmPass = 'Passwords do not match';
    return e;
  };

  const handleSaveInfo = () => {
    const e = validateInfo();
    if (Object.keys(e).length) { setErrors(e); return; }
    const initials = name.trim().split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
    updateStoredUser(user.email, { name: name.trim(), email: email.trim().toLowerCase(), initials });
    onSave({ name: name.trim(), email: email.trim().toLowerCase(), initials });
  };

  const handleSavePassword = () => {
    const e = validatePassword();
    if (Object.keys(e).length) { setErrors(e); return; }
    updateStoredUser(user.email, { password: newPass });
    setCurrentPass(''); setNewPass(''); setConfirmPass('');
    setErrors({});
    onSave(null, 'Password updated successfully');
  };

  const TABS = [
    { id: 'info', label: 'Profile Info' },
    { id: 'password', label: 'Password' },
    { id: 'preferences', label: 'Preferences' },
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{ position: 'fixed', inset: 0, zIndex: 400, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
      />

      {/* Modal */}
      <div style={{
        position: 'fixed', top: '50%', left: '50%',
        transform: 'translate(-50%,-50%)',
        zIndex: 401, width: 440, maxWidth: '95vw',
        background: 'rgba(12,17,32,0.97)',
        border: '1px solid rgba(124,58,237,0.25)',
        borderRadius: 16, backdropFilter: 'blur(24px)',
        boxShadow: '0 24px 64px rgba(0,0,0,0.7)',
        overflow: 'hidden',
        maxHeight: '90vh', display: 'flex', flexDirection: 'column',
      }}>
        {/* Header */}
        <div style={{ padding: '22px 24px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 20, fontWeight: 800, color: 'var(--t1)' }}>Edit Profile</div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--t3)', fontSize: 20, cursor: 'pointer', lineHeight: 1 }}>✕</button>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 8, padding: '16px 24px 0', flexShrink: 0 }}>
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setSection(tab.id); setErrors({}); }}
              style={{
                fontFamily: 'Syne, sans-serif', fontSize: 11, fontWeight: 600,
                padding: '6px 14px', borderRadius: 8, cursor: 'pointer',
                background: section === tab.id ? 'rgba(124,58,237,0.15)' : 'transparent',
                color: section === tab.id ? '#9B5CF6' : 'var(--t3)',
                border: `1px solid ${section === tab.id ? 'rgba(124,58,237,0.4)' : 'rgba(255,255,255,0.06)'}`,
                transition: 'all 0.2s', whiteSpace: 'nowrap',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Scrollable body */}
        <div style={{ padding: '20px 24px 24px', overflowY: 'auto' }}>

          {/* ── Profile Info ── */}
          {section === 'info' && (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
                <div style={{
                  width: 56, height: 56, borderRadius: '50%',
                  background: 'linear-gradient(135deg,#7C3AED,#06B6D4)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 20, fontWeight: 800, color: '#fff', fontFamily: 'Syne, sans-serif', flexShrink: 0,
                }}>
                  {name.trim().split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase() || '?'}
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--t1)', fontFamily: 'Syne, sans-serif' }}>{name || 'Your Name'}</div>
                  <div style={{ fontSize: 12, color: 'var(--t3)', marginTop: 2 }}>{email || 'your@email.com'}</div>
                </div>
              </div>

              <label style={labelStyle}>Full Name</label>
              <input style={{ ...inpStyle, borderColor: errors.name ? '#F43F5E' : 'var(--bg5)' }} type="text" placeholder="Aditya Kumar" value={name} onChange={(e) => setName(e.target.value)} />
              {errors.name && <div style={{ fontSize: 11, color: '#F43F5E', marginTop: -10, marginBottom: 10 }}>{errors.name}</div>}

              <label style={labelStyle}>Email</label>
              <input style={{ ...inpStyle, borderColor: errors.email ? '#F43F5E' : 'var(--bg5)' }} type="email" placeholder="you@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
              {errors.email && <div style={{ fontSize: 11, color: '#F43F5E', marginTop: -10, marginBottom: 10 }}>{errors.email}</div>}

              <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                <button onClick={onClose} style={{ flex: 1, padding: '11px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'Syne, sans-serif', background: 'transparent', border: '1px solid var(--bg5)', color: 'var(--t3)' }}>Cancel</button>
                <button onClick={handleSaveInfo} style={{ flex: 1, padding: '11px', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'Syne, sans-serif', color: '#fff', border: 'none', background: 'linear-gradient(135deg,#7C3AED,#5B21B6)' }}>Save Changes</button>
              </div>
            </>
          )}

          {/* ── Password ── */}
          {section === 'password' && (
            <>
              <label style={labelStyle}>Current Password</label>
              <input style={{ ...inpStyle, borderColor: errors.currentPass ? '#F43F5E' : 'var(--bg5)' }} type="password" placeholder="••••••••" value={currentPass} onChange={(e) => setCurrentPass(e.target.value)} />
              {errors.currentPass && <div style={{ fontSize: 11, color: '#F43F5E', marginTop: -10, marginBottom: 10 }}>{errors.currentPass}</div>}

              <label style={labelStyle}>New Password</label>
              <input style={{ ...inpStyle, borderColor: errors.newPass ? '#F43F5E' : 'var(--bg5)' }} type="password" placeholder="Min. 8 characters" value={newPass} onChange={(e) => setNewPass(e.target.value)} />
              {errors.newPass && <div style={{ fontSize: 11, color: '#F43F5E', marginTop: -10, marginBottom: 10 }}>{errors.newPass}</div>}

              <label style={labelStyle}>Confirm New Password</label>
              <input style={{ ...inpStyle, borderColor: errors.confirmPass ? '#F43F5E' : 'var(--bg5)' }} type="password" placeholder="Repeat new password" value={confirmPass} onChange={(e) => setConfirmPass(e.target.value)} />
              {errors.confirmPass && <div style={{ fontSize: 11, color: '#F43F5E', marginTop: -10, marginBottom: 10 }}>{errors.confirmPass}</div>}

              <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                <button onClick={onClose} style={{ flex: 1, padding: '11px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'Syne, sans-serif', background: 'transparent', border: '1px solid var(--bg5)', color: 'var(--t3)' }}>Cancel</button>
                <button onClick={handleSavePassword} style={{ flex: 1, padding: '11px', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'Syne, sans-serif', color: '#fff', border: 'none', background: 'linear-gradient(135deg,#7C3AED,#5B21B6)' }}>Update Password</button>
              </div>
            </>
          )}

          {/* ── Preferences ── */}
          {section === 'preferences' && (
            <>
              <div style={{ fontSize: 13, color: 'var(--t3)', marginBottom: 18, lineHeight: 1.6 }}>
                Select the genres you enjoy. These appear on your profile and shape your recommendations.
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 24 }}>
                {GENRES.map((g, i) => {
                  const sel = selectedGenres.includes(g.id);
                  const color = GENRE_COLORS[i % GENRE_COLORS.length];
                  return (
                    <button
                      key={g.id}
                      onClick={() => onToggleGenre(g.id)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 7,
                        padding: '8px 16px', borderRadius: 24,
                        fontSize: 13, fontWeight: 600, cursor: 'pointer',
                        fontFamily: 'Syne, sans-serif',
                        background: sel ? color + '22' : 'var(--bg3)',
                        color: sel ? color : 'var(--t3)',
                        border: `1px solid ${sel ? color + '66' : 'var(--bg5)'}`,
                        transition: 'all 0.18s',
                        boxShadow: sel ? `0 0 12px ${color}33` : 'none',
                      }}
                    >
                      <span>{g.emoji}</span>
                      <span>{g.name}</span>
                      {sel && (
                        <span style={{ fontSize: 10, marginLeft: 2, opacity: 0.8 }}>✓</span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Selected count */}
              <div style={{ fontSize: 12, color: 'var(--t3)', marginBottom: 16, padding: '10px 14px', background: 'var(--bg3)', borderRadius: 8, border: '1px solid var(--bg5)' }}>
                {selectedGenres.length === 0
                  ? 'No genres selected — select at least one'
                  : `${selectedGenres.length} genre${selectedGenres.length > 1 ? 's' : ''} selected`}
              </div>

              <button
                onClick={onClose}
                style={{
                  width: '100%', padding: '11px', borderRadius: 8, fontSize: 13, fontWeight: 700,
                  cursor: 'pointer', fontFamily: 'Syne, sans-serif', color: '#fff', border: 'none',
                  background: 'linear-gradient(135deg,#7C3AED,#5B21B6)',
                }}
              >
                Done
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}

// ── ProfilePage ───────────────────────────────────────────────────────────────
export default function ProfilePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();
  const { user } = useSelector((s) => s.auth);
  const { watchlist, history, selectedGenres } = useSelector((s) => s.media);
  const allMedia = useSelector(selectAllMedia);
  const [showEdit, setShowEdit] = useState(false);

  const wlMovies = allMedia.filter((m) => watchlist.includes(m.id));
  const histMovies = allMedia.filter((m) => history.some((h) => h.id === m.id));

  // Only selected genres shown on profile
  const myGenres = GENRES.filter((g) => selectedGenres.includes(g.id));

  const handleLogout = () => {
    dispatch(logout());
    toast('Logged out', '#F43F5E');
    navigate('/');
  };

  const handleSave = (updatedUser, successMsg) => {
    if (updatedUser) {
      dispatch(login({ ...user, ...updatedUser }));
    }
    toast(successMsg || 'Profile updated', '#10B981');
    if (updatedUser) setShowEdit(false);
  };

  return (
    <div className="pg-fade" style={{ padding: '28px 24px 40px' }}>

      {showEdit && (
        <EditProfileModal
          user={user}
          selectedGenres={selectedGenres}
          onClose={() => setShowEdit(false)}
          onSave={handleSave}
          onToggleGenre={(id) => dispatch(toggleGenre(id))}
        />
      )}

      {/* Profile header */}
      <div className="flex items-center gap-5 mb-8 p-6 rounded-2xl" style={{ background: 'var(--bg2)', border: '1px solid var(--bg4)' }}>
        <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold flex-shrink-0"
          style={{ background: 'linear-gradient(135deg,#7C3AED,#06B6D4)', fontFamily: 'Syne, sans-serif', color: '#fff' }}>
          {user?.initials || 'AK'}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 22, fontWeight: 800, color: 'var(--t1)', marginBottom: 2 }}>{user?.name || 'Guest'}</div>
          <div style={{ fontSize: 13, color: 'var(--t3)' }}>{user?.email || ''}</div>
          <div className="flex gap-4 mt-3">
            <div style={{ fontSize: 12, color: 'var(--t2)' }}><span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, color: 'var(--t1)' }}>{watchlist.length}</span> Watchlist</div>
            <div style={{ fontSize: 12, color: 'var(--t2)' }}><span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, color: 'var(--t1)' }}>{history.length}</span> Watched</div>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <button onClick={() => setShowEdit(true)}
            className="px-5 py-2 rounded-lg text-[12px] font-semibold cursor-pointer transition-all hover:border-[rgba(124,58,237,0.4)] hover:text-[#9B5CF6]"
            style={{ fontFamily: 'Syne, sans-serif', background: 'transparent', border: '1px solid var(--bg5)', color: 'var(--t3)' }}>
            Edit Profile
          </button>
          <button onClick={handleLogout}
            className="px-5 py-2 rounded-lg text-[12px] font-semibold cursor-pointer transition-all"
            style={{ fontFamily: 'Syne, sans-serif', background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.2)', color: '#F43F5E' }}>
            Log Out
          </button>
        </div>
      </div>

      {/* My Taste Profile — only selected genres */}
      <div style={{ marginBottom: 36 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 14, fontWeight: 700, color: 'var(--t2)', letterSpacing: '0.8px', textTransform: 'uppercase' }}>
            My Taste Profile
          </div>
          <button
            onClick={() => { setShowEdit(true); }}
            style={{ fontSize: 11, color: '#9B5CF6', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Syne, sans-serif', fontWeight: 600 }}
          >
            + Edit Taste
          </button>
        </div>

        {myGenres.length === 0 ? (
          <div style={{ fontSize: 13, color: 'var(--t3)', padding: '12px 0' }}>
            No genres selected.{' '}
            <button onClick={() => setShowEdit(true)} style={{ color: '#9B5CF6', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 13 }}>
              Add your taste →
            </button>
          </div>
        ) : (
          <div className="flex gap-2 flex-wrap">
            {myGenres.map((g, i) => {
              const color = GENRE_COLORS[GENRES.findIndex((x) => x.id === g.id) % GENRE_COLORS.length];
              return (
                <div
                  key={g.id}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    padding: '7px 16px', borderRadius: 24,
                    fontSize: 13, fontWeight: 600,
                    fontFamily: 'Syne, sans-serif',
                    background: color + '22',
                    color: color,
                    border: `1px solid ${color}55`,
                    boxShadow: `0 0 10px ${color}22`,
                  }}
                >
                  {g.emoji} {g.name}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Watchlist */}
      <div style={{ marginBottom: 36 }}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-[10px]" style={{ fontFamily: 'Syne, sans-serif', fontSize: 18, fontWeight: 700, color: 'var(--t1)' }}>
            <div style={{ width: 3, height: 18, background: 'linear-gradient(to bottom,#9B5CF6,#06B6D4)', borderRadius: 2 }} />
            My Watchlist <span style={{ fontSize: 14, color: 'var(--acc2)', marginLeft: 6 }}>({watchlist.length})</span>
          </div>
        </div>
        {wlMovies.length === 0 ? (
          <div style={{ fontSize: 13, color: 'var(--t3)', padding: '20px 0' }}>
            {watchlist.length === 0 ? 'No titles saved yet. Browse and add some!' : 'Still loading your saved titles…'}
          </div>
        ) : (
          <div className="crow">{wlMovies.map((m) => <MovieCard key={m.id} movie={m} />)}</div>
        )}
      </div>

      {/* History */}
      <div>
        <div className="flex items-center gap-[10px] mb-4" style={{ fontFamily: 'Syne, sans-serif', fontSize: 18, fontWeight: 700, color: 'var(--t1)' }}>
          <div style={{ width: 3, height: 18, background: 'linear-gradient(to bottom,#9B5CF6,#06B6D4)', borderRadius: 2 }} />
          Watch History
        </div>
        {histMovies.length === 0 ? (
          <div style={{ fontSize: 13, color: 'var(--t3)', padding: '20px 0' }}>
            {history.length === 0 ? 'Nothing here yet. Start watching!' : 'Still loading your history…'}
          </div>
        ) : (
          <div className="crow">{histMovies.map((m) => <MovieCard key={m.id} movie={m} />)}</div>
        )}
      </div>
    </div>
  );
}