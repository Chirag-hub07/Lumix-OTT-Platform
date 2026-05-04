// src/components/Navbar.jsx
import { useCallback, useRef, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/authSlice';
import { toggleTheme, setBrowseFilter } from '../store/mediaSlice';
import { useToast } from '../hooks/useToast';

const LINKS = [
  { label: 'Home',          path: '/home' },
  { label: 'Browse',        path: '/browse' },
  { label: 'Your Activity', path: '/activity' },
  { label: 'Profile',       path: '/profile' },
];

export default function Navbar() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const dispatch  = useDispatch();
  const toast     = useToast();
  const { isLoggedIn, user } = useSelector((s) => s.auth);
  const theme     = useSelector((s) => s.media.theme);
  const [query, setQuery]         = useState('');
  const [scrolled, setScrolled]   = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const timerRef  = useRef(null);
  const inputRef  = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleSearch = useCallback((val) => {
    setQuery(val);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      if (val.length > 1) {
        dispatch(setBrowseFilter({ query: val }));
        navigate('/browse');
      }
    }, 320);
  }, [dispatch, navigate]);

  const handleLogout = () => {
    dispatch(logout());
    toast('Logged out', '#F43F5E');
    navigate('/');
  };

  const openSearch = () => {
    setSearchOpen(true);
    setTimeout(() => inputRef.current?.focus(), 50);
  };
  const closeSearch = () => {
    setSearchOpen(false);
    setQuery('');
    dispatch(setBrowseFilter({ query: '' }));
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav
      className={`sticky top-0 z-[300] flex items-center backdrop-blur-[20px] border-b transition-all duration-300 ${scrolled ? 'nav-scrolled' : ''}`}
      style={{
        height: 62,
        padding: '0 32px',
        gap: 0,
        background: scrolled ? 'rgba(7,11,20,0.98)' : 'rgba(7,11,20,0.85)',
        borderBottomColor: scrolled ? 'rgba(124,58,237,0.18)' : 'rgba(255,255,255,0.05)',
      }}
    >
      {/* Logo */}
      <div
        className="nav-logo cursor-pointer select-none flex-shrink-0"
        style={{
          fontFamily: 'Syne, sans-serif', fontSize: 22, fontWeight: 800,
          letterSpacing: 2, marginRight: 40,
        }}
        onClick={() => navigate(isLoggedIn ? '/home' : '/')}
      >
        LUMIX
      </div>

      {/* Nav links */}
      {isLoggedIn && (
        <div className="flex items-center" style={{ gap: 4, flex: 1 }}>
          {LINKS.map((l) => {
            const active = isActive(l.path);
            return (
              <button
                key={l.path}
                onClick={() => navigate(l.path)}
                className="relative cursor-pointer group"
                style={{
                  fontFamily: 'Syne, sans-serif',
                  fontSize: 13,
                  fontWeight: active ? 600 : 400,
                  color: active ? '#fff' : 'var(--t3)',
                  background: active ? 'rgba(124,58,237,0.12)' : 'transparent',
                  border: 'none',
                  borderRadius: 8,
                  padding: '7px 18px',
                  transition: 'all 0.2s',
                  whiteSpace: 'nowrap',
                  // Glow on active
                  boxShadow: active ? '0 0 16px rgba(124,58,237,0.2)' : 'none',
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    e.currentTarget.style.color = '#c4b5fd';
                    e.currentTarget.style.background = 'rgba(124,58,237,0.08)';
                    e.currentTarget.style.boxShadow = '0 0 18px rgba(124,58,237,0.25)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    e.currentTarget.style.color = 'var(--t3)';
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.boxShadow = 'none';
                  }
                }}
              >
                {/* Active bottom bar */}
                <span style={{
                  position: 'absolute', bottom: 3, left: '50%',
                  transform: 'translateX(-50%)',
                  height: 2, borderRadius: 2,
                  background: 'linear-gradient(90deg,#7C3AED,#06B6D4)',
                  width: active ? '55%' : '0%',
                  transition: 'width 0.25s cubic-bezier(0.4,0,0.2,1)',
                  display: 'block',
                }} />
                {l.label}
              </button>
            );
          })}
        </div>
      )}

      {/* Right side */}
      <div className="flex items-center" style={{ gap: 10, marginLeft: 'auto' }}>

        {/* Search */}
        {isLoggedIn && (
          <div
            className="flex items-center gap-2 rounded-lg transition-all"
            style={{
              background: 'var(--bg3)',
              border: `1px solid ${searchOpen ? 'rgba(124,58,237,0.5)' : 'var(--bg5)'}`,
              boxShadow: searchOpen ? '0 0 0 3px rgba(124,58,237,0.12), 0 0 20px rgba(124,58,237,0.15)' : 'none',
              width: searchOpen ? 210 : 168,
              padding: '7px 12px',
              transition: 'all 0.2s',
            }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
              style={{ color: 'var(--t3)', flexShrink: 0, cursor: 'pointer' }} onClick={openSearch}>
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              onFocus={openSearch}
              onBlur={() => !query && setSearchOpen(false)}
              placeholder="Search..."
              className="bg-transparent border-none outline-none text-[13px] flex-1"
              style={{ color: 'var(--t1)', fontFamily: 'Inter, sans-serif', minWidth: 0 }}
            />
            {query && (
              <button onClick={closeSearch}
                style={{ background: 'none', border: 'none', color: 'var(--t3)', cursor: 'pointer', fontSize: 14, lineHeight: 1 }}>
                ✕
              </button>
            )}
          </div>
        )}

        {/* Theme toggle */}
        <button
          onClick={() => dispatch(toggleTheme())}
          className="flex items-center justify-center cursor-pointer transition-all"
          style={{
            width: 36, height: 36, borderRadius: 8, fontSize: 15,
            background: 'var(--bg3)', border: '1px solid var(--bg5)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = '0 0 16px rgba(124,58,237,0.3)';
            e.currentTarget.style.borderColor = 'rgba(124,58,237,0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = 'none';
            e.currentTarget.style.borderColor = 'var(--bg5)';
          }}
          title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
        >
          {theme === 'dark' ? '☀' : '☽'}
        </button>

        {/* Avatar / Auth */}
        {isLoggedIn ? (
          <button
            onClick={handleLogout}
            className="nav-avatar flex items-center justify-center font-bold cursor-pointer transition-all"
            style={{
              width: 36, height: 36, borderRadius: '50%',
              background: 'linear-gradient(135deg,#7C3AED,#06B6D4)',
              fontFamily: 'Syne, sans-serif', fontSize: 12,
              border: '2px solid transparent', color: '#fff',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 0 20px rgba(124,58,237,0.55)';
              e.currentTarget.style.transform = 'scale(1.07)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.transform = 'scale(1)';
            }}
            title={`${user?.name || 'User'} — click to logout`}
          >
            {user?.initials || 'AK'}
          </button>
        ) : (
          <>
            <button
              onClick={() => navigate('/')}
              className="cursor-pointer transition-all"
              style={{
                fontFamily: 'Syne, sans-serif', fontSize: 12, fontWeight: 600,
                padding: '7px 16px', borderRadius: 8,
                background: 'transparent', border: '1px solid var(--bg5)', color: 'var(--t3)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#9B5CF6';
                e.currentTarget.style.borderColor = 'rgba(124,58,237,0.5)';
                e.currentTarget.style.boxShadow = '0 0 14px rgba(124,58,237,0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--t3)';
                e.currentTarget.style.borderColor = 'var(--bg5)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              Log In
            </button>
            <button
              onClick={() => navigate('/signup')}
              className="cursor-pointer transition-all"
              style={{
                fontFamily: 'Syne, sans-serif', fontSize: 12, fontWeight: 600,
                padding: '7px 16px', borderRadius: 8,
                background: 'linear-gradient(135deg,#7C3AED,#5B21B6)',
                border: 'none', color: '#fff',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 0 24px rgba(124,58,237,0.55)';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              Sign Up
            </button>
          </>
        )}
      </div>
    </nav>
  );
}