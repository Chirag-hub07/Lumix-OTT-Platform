// src/pages/HomePage.jsx
import { useEffect, Suspense } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  fetchTrending, fetchBollywood, fetchTamil, fetchTelugu,
  fetchKorean, fetchTopSeries, fetchNowPlaying, fetchTopRated,
  toggleWatchlist,
} from '../store/mediaSlice';
import { useToast } from '../hooks/useToast';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { COLLECTIONS } from '../data/movies';
import MovieCard from '../components/MovieCard';

function LoadingRow() {
  return (
    <div className="crow">
      {[...Array(7)].map((_, i) => (
        <div
          key={i}
          className="flex-shrink-0 rounded-[10px] animate-pulse"
          style={{ width: 148, height: 222, background: 'var(--bg3)' }}
        />
      ))}
    </div>
  );
}

function SectionRow({ title, subtitle, items, loading, badges = {} }) {
  const navigate = useNavigate();
  return (
    <div style={{ padding: '0 24px', marginBottom: 36 }} className="scroll-reveal">
      <div className="flex items-center justify-between mb-4 scroll-reveal-left">
        <div
          className="flex items-center gap-[10px]"
          style={{ fontFamily: 'Syne, sans-serif', fontSize: 18, fontWeight: 700, color: 'var(--t1)' }}
        >
          <div
            style={{
              width: 3, height: 18,
              background: 'linear-gradient(to bottom,#9B5CF6,#06B6D4)',
              borderRadius: 2,
            }}
          />
          {title}
          {subtitle && (
            <span style={{ fontSize: 14, color: 'var(--acc2)', marginLeft: 6 }}>{subtitle}</span>
          )}
        </div>
        <button
          onClick={() => navigate('/browse')}
          className="text-[12px] transition-all px-[10px] py-[5px] rounded-lg hover:text-acc2"
          style={{ color: 'var(--t3)', fontWeight: 500, background: 'transparent', border: 'none', cursor: 'pointer' }}
        >
          See all →
        </button>
      </div>
      {loading ? (
        <LoadingRow />
      ) : (
        <div className="crow">
          {items.map((m, i) => <MovieCard key={m.id} movie={m} badge={badges[i]} />)}
        </div>
      )}
    </div>
  );
}

export default function HomePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();

  const {
    trending, bollywood, tamil, telugu, korean,
    topSeries, nowPlaying, topRated, watchlist, loading,
  } = useSelector((s) => s.media);

  // Hero movie — first trending item
  const hero = trending[0];
  const inWl = hero ? watchlist.includes(hero.id) : false;

  useEffect(() => {
    if (!trending.length) dispatch(fetchTrending());
    if (!bollywood.length) dispatch(fetchBollywood());
    if (!tamil.length) dispatch(fetchTamil());
    if (!telugu.length) dispatch(fetchTelugu());
    if (!korean.length) dispatch(fetchKorean());
    if (!topSeries.length) dispatch(fetchTopSeries());
    if (!nowPlaying.length) dispatch(fetchNowPlaying());
    if (!topRated.length) dispatch(fetchTopRated());
  }, [dispatch]);

  useScrollReveal();

  return (
    <div className="pg-fade">
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <div style={{ position: 'relative', height: 520, overflow: 'hidden' }}>
        {/* Backdrop image if available */}
        {hero?.backdrop && (
          <img
            src={hero.backdrop}
            alt=""
            style={{
              position: 'absolute', inset: 0,
              width: '100%', height: '100%',
              objectFit: 'cover', opacity: 0.35,
            }}
          />
        )}
        <div
          style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(125deg,#0C0620 0%,#070B14 45%,#071018 100%)',
            opacity: hero?.backdrop ? 0.75 : 1,
          }}
        />
        {/* Orbs */}
        <div style={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', filter: 'blur(80px)', background: 'rgba(124,58,237,0.18)', top: -100, left: -100, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', width: 300, height: 300, borderRadius: '50%', filter: 'blur(80px)', background: 'rgba(6,182,212,0.1)', top: 50, right: 50, pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 3, padding: '110px 28px 0', maxWidth: 580 }}>
          <div
            className="inline-flex items-center gap-[6px] mb-[18px] rounded-[20px] px-3 py-[5px]"
            style={{
              background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.25)',
              fontSize: 10, fontWeight: 700, color: '#9B5CF6',
              letterSpacing: '1.5px', textTransform: 'uppercase',
            }}
          >
            <div className="w-[6px] h-[6px] rounded-full hpulse" style={{ background: '#9B5CF6' }} />
            Trending #1 This Week
          </div>

          {loading.trending ? (
            <div className="animate-pulse" style={{ width: 300, height: 64, background: 'var(--bg3)', borderRadius: 8 }} />
          ) : (
            <h1
              style={{
                fontFamily: 'Syne, sans-serif', fontSize: 56, fontWeight: 800,
                lineHeight: 0.95, letterSpacing: '-1px', marginBottom: 16, color: 'var(--t1)',
              }}
            >
              {hero?.title?.toUpperCase() || 'LUMIX'}
            </h1>
          )}

          {hero && (
            <>
              <div className="flex items-center gap-2 flex-wrap mb-4" style={{ fontSize: 12, color: 'var(--t2)' }}>
                <span style={{ color: '#F59E0B', fontWeight: 700 }}>★ {hero.rating}</span>
                <div style={{ width: 3, height: 3, borderRadius: '50%', background: 'var(--t4)' }} />
                <span>{hero.year}</span>
                <div style={{ width: 3, height: 3, borderRadius: '50%', background: 'var(--t4)' }} />
                <span style={{ padding: '2px 8px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 4, fontSize: 11 }}>
                  {hero.genre ? hero.genre.charAt(0).toUpperCase() + hero.genre.slice(1) : ''}
                </span>
                <span style={{ padding: '2px 8px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 4, fontSize: 11 }}>
                  {hero.type === 'show' ? 'Series' : 'Film'}
                </span>
              </div>
              <p style={{ fontSize: 13, color: 'var(--t2)', lineHeight: 1.8, maxWidth: 400, marginBottom: 28, fontWeight: 300 }}>
                {hero.desc?.slice(0, 160)}{hero.desc?.length > 160 ? '…' : ''}
              </p>
              <div className="flex gap-[10px] flex-wrap">
                <button
                  onClick={() => navigate(`/player/${hero.id}`)}
                  className="flex items-center gap-[9px] transition-all hover:shadow-[0_0_24px_rgba(124,58,237,0.4)] hover:-translate-y-[1px]"
                  style={{ background: 'linear-gradient(135deg,#7C3AED,#5B21B6)', color: '#fff', border: 'none', borderRadius: 8, padding: '12px 26px', fontFamily: 'Syne, sans-serif', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}
                >
                  <div style={{ width: 0, height: 0, borderTop: '5px solid transparent', borderBottom: '5px solid transparent', borderLeft: '9px solid #fff' }} />
                  Play Now
                </button>
                <button
                  onClick={() => { dispatch(toggleWatchlist(hero.id)); toast(inWl ? 'Removed from watchlist' : 'Added to watchlist', inWl ? '#F43F5E' : '#10B981'); }}
                  className="flex items-center gap-2 transition-all"
                  style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--t1)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '11px 20px', fontFamily: 'Syne, sans-serif', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
                  onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 0 20px rgba(16,185,129,0.35)'; e.currentTarget.style.borderColor = 'rgba(16,185,129,0.5)'; e.currentTarget.style.background = 'rgba(16,185,129,0.1)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
                >
                  {inWl ? '✓ Saved' : '+ Watchlist'}
                </button>
                <button
                  onClick={() => navigate(`/detail/${hero.id}`)}
                  className="flex items-center gap-2 transition-all"
                  style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--t1)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '11px 20px', fontFamily: 'Syne, sans-serif', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
                  onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 0 20px rgba(6,182,212,0.35)'; e.currentTarget.style.borderColor = 'rgba(6,182,212,0.5)'; e.currentTarget.style.background = 'rgba(6,182,212,0.08)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
                >
                  More Info
                </button>
              </div>
            </>
          )}
        </div>
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 220, background: 'linear-gradient(transparent,var(--bg))', zIndex: 2 }} />
      </div>

      {/* ── Rows ─────────────────────────────────────────────────────────── */}
      <div style={{ marginTop: 8 }}>
        <SectionRow title="Trending Now" items={trending.slice(0, 10)} loading={loading.trending} badges={{ 0: 'HOT', 1: 'HOT' }} />
        <SectionRow title="Now Playing" subtitle="In Theatres" items={nowPlaying.slice(0, 10)} loading={loading.nowPlaying} badges={{ 0: 'NEW' }} />
        <SectionRow title="Bollywood" items={bollywood.slice(0, 10)} loading={loading.bollywood} />
        <SectionRow title="Korean" subtitle="K-Drama & Cinema" items={korean.slice(0, 10)} loading={loading.korean} />
        <SectionRow title="Tamil Cinema" items={tamil.slice(0, 10)} loading={loading.tamil} />
        <SectionRow title="Telugu Cinema" items={telugu.slice(0, 10)} loading={loading.telugu} />
        <SectionRow title="Top Series" items={topSeries.slice(0, 10)} loading={loading.topSeries} />
        <SectionRow title="All-Time Best" items={topRated.slice(0, 10)} loading={loading.topRated} badges={{ 0: 'HOT' }} />
      </div>

      {/* ── Collections ──────────────────────────────────────────────────── */}
      <div style={{ padding: '0 24px', marginBottom: 36 }} className="scroll-reveal">
        <div
          className="flex items-center gap-[10px] mb-4 scroll-reveal-left"
          style={{ fontFamily: 'Syne, sans-serif', fontSize: 18, fontWeight: 700, color: 'var(--t1)' }}
        >
          <div style={{ width: 3, height: 18, background: 'linear-gradient(to bottom,#9B5CF6,#06B6D4)', borderRadius: 2 }} />
          Featured Collections
        </div>
        <div className="crow">
          {COLLECTIONS.map((c) => (
            <div
              key={c.title}
              onClick={() => navigate('/browse')}
              className="flex-shrink-0 rounded-[10px] cursor-pointer relative overflow-hidden transition-all hover:scale-[1.03] hover:-translate-y-[3px] hover:shadow-[0_16px_40px_rgba(0,0,0,0.5)]"
              style={{ width: 256, height: 144, background: c.bg }}
            >
              <div className="absolute inset-0 flex items-end p-[14px]">
                <div>
                  <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 18, fontWeight: 800, color: 'rgba(255,255,255,0.95)' }}>{c.title}</div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.45)', marginTop: 2 }}>{c.sub}</div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginTop: 1 }}>{c.count}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ height: 28 }} />
    </div>
  );
}