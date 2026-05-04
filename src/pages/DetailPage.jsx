// src/pages/DetailPage.jsx
import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchMediaDetail, fetchSimilar,
  toggleWatchlist, addToHistory, clearDetail,
} from '../store/mediaSlice';
import { useToast } from '../hooks/useToast';
import MovieCard from '../components/MovieCard';
import { GENRE_COLORS } from '../data/movies';

export default function DetailPage() {
  const { id } = useParams();           // TMDB numeric id as string
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const toast = useToast();

  const { currentDetail: movie, similar, watchlist, loading } = useSelector((s) => s.media);
  const inWl = watchlist.includes(id);

  useEffect(() => {
    // id from URL is the TMDB id string — we don't know type yet,
    // so try movie first, fall back to tv via the thunk's error handling
    dispatch(clearDetail());

    // Try to find the item in any existing category list to get type
    // This avoids an extra API round-trip in most cases
    const allStored = [
      ...((window.__lumixStore?.getState().media.trending) || []),
      ...((window.__lumixStore?.getState().media.bollywood) || []),
      ...((window.__lumixStore?.getState().media.tamil) || []),
      ...((window.__lumixStore?.getState().media.telugu) || []),
      ...((window.__lumixStore?.getState().media.korean) || []),
      ...((window.__lumixStore?.getState().media.topSeries) || []),
      ...((window.__lumixStore?.getState().media.nowPlaying) || []),
      ...((window.__lumixStore?.getState().media.topRated) || []),
    ];
    const found = allStored.find((m) => m.id === id);
    const type = found?.type || 'movie';

    dispatch(fetchMediaDetail({ tmdbId: id, type }));
    dispatch(fetchSimilar({ tmdbId: id, type }));
  }, [id, dispatch]);

  const handlePlay = () => {
    dispatch(addToHistory(id));
    navigate(`/player/${id}`);
  };

  const handleWl = () => {
    dispatch(toggleWatchlist(id));
    toast(inWl ? 'Removed from watchlist' : 'Added to watchlist', inWl ? '#F43F5E' : '#10B981');
  };

  if (loading.detail || !movie) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] flex-col gap-4 pg-fade">
        <div style={{ fontSize: 48 }}>🎬</div>
        <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 20, color: 'var(--t1)' }}>
          {loading.detail ? 'Loading…' : 'Title not found'}
        </div>
      </div>
    );
  }

  return (
    <div className="pg-fade">
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <div style={{ position: 'relative', height: 420, overflow: 'hidden' }}>
        {/* Backdrop */}
        {movie.backdrop && (
          <img
            src={movie.backdrop}
            alt=""
            style={{
              position: 'absolute', inset: 0,
              width: '100%', height: '100%',
              objectFit: 'cover', opacity: 0.5,
            }}
          />
        )}
        <div
          style={{
            position: 'absolute', inset: 0,
            background: movie.backdrop
              ? 'linear-gradient(0deg,var(--bg) 0%,rgba(7,11,20,0.55) 55%,rgba(7,11,20,0.3) 100%)'
              : `linear-gradient(135deg,${movie.color || '#0c1120'},#070b14)`,
          }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg,rgba(7,11,20,0.88) 30%,transparent 100%)' }} />

        <button
          onClick={() => navigate(-1)}
          className="absolute top-[18px] left-6 z-10 inline-flex items-center gap-[6px] px-[14px] py-[7px] rounded-[20px] text-[12px] font-medium transition-all hover:border-white/20 cursor-pointer"
          style={{ background: 'rgba(7,11,20,0.65)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--t2)' }}
        >
          ← Back
        </button>

        <div className="absolute bottom-0 left-0 right-0 z-[5] px-6 pb-6" style={{ display: 'flex', gap: 24, alignItems: 'flex-end' }}>
          {/* Poster thumbnail in detail hero */}
          {movie.poster && (
            <img
              src={movie.poster}
              alt={movie.title}
              style={{
                width: 100, height: 150, objectFit: 'cover',
                borderRadius: 8, border: '2px solid rgba(255,255,255,0.1)',
                flexShrink: 0, boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
              }}
            />
          )}
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontFamily: 'Syne, sans-serif', fontSize: 48, fontWeight: 800,
                lineHeight: 0.95, letterSpacing: '-1px', marginBottom: 12, color: 'var(--t1)',
              }}
            >
              {movie.title}
            </div>
            {movie.tagline && (
              <div style={{ fontSize: 12, color: 'var(--t3)', fontStyle: 'italic', marginBottom: 10 }}>
                "{movie.tagline}"
              </div>
            )}
            <div className="flex items-center gap-2 flex-wrap mb-4" style={{ fontSize: 12, color: 'var(--t2)' }}>
              <span style={{ color: '#F59E0B', fontWeight: 700 }}>★ {movie.rating}</span>
              {[movie.year, ...(movie.genres || [movie.genre]).slice(0, 2), movie.type === 'show' ? 'Series' : 'Film', movie.dur].filter(Boolean).map((pill, i) => (
                <span key={i} style={{ padding: '3px 9px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 5, fontSize: 11, fontWeight: 500 }}>
                  {pill}
                </span>
              ))}
            </div>
            <div className="flex gap-[9px] flex-wrap">
              <button
                onClick={handlePlay}
                className="flex items-center gap-[9px] transition-all hover:shadow-[0_0_24px_rgba(124,58,237,0.4)] hover:-translate-y-[1px]"
                style={{ background: 'linear-gradient(135deg,#7C3AED,#5B21B6)', color: '#fff', border: 'none', borderRadius: 8, padding: '12px 26px', fontFamily: 'Syne, sans-serif', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}
              >
                <div style={{ width: 0, height: 0, borderTop: '5px solid transparent', borderBottom: '5px solid transparent', borderLeft: '9px solid #fff' }} />
                Play
              </button>
              <button
                onClick={handleWl}
                className="flex items-center gap-2 transition-all hover:bg-white/10"
                style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--t1)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '11px 20px', fontFamily: 'Syne, sans-serif', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
              >
                {inWl ? '✓ Saved' : '+ Watchlist'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Body ─────────────────────────────────────────────────────────── */}
      <div style={{ padding: 24 }}>
        <p style={{ fontSize: 13, color: 'var(--t2)', lineHeight: 1.8, maxWidth: 680, fontWeight: 300, marginBottom: 24 }}>
          {movie.desc}
        </p>

        {/* Cast */}
        {movie.cast?.length > 0 && (
          <>
            <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 11, fontWeight: 700, color: 'var(--t3)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '1px' }}>
              Cast
            </div>
            <div className="flex gap-[10px] flex-wrap mb-6">
              {movie.cast.map((c, i) => (
                <div
                  key={c}
                  className="flex items-center gap-[7px] rounded-[7px] px-[11px] py-[6px] cursor-pointer transition-all hover:border-[rgba(124,58,237,0.35)] hover:text-[#9B5CF6]"
                  style={{ background: 'var(--bg2)', border: '1px solid var(--bg4)', fontSize: 12, fontWeight: 500, color: 'var(--t1)' }}
                >
                  <div
                    className="w-[26px] h-[26px] rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0"
                    style={{ background: GENRE_COLORS[i % GENRE_COLORS.length] + '22', color: GENRE_COLORS[i % GENRE_COLORS.length] }}
                  >
                    {c[0]}
                  </div>
                  {c}
                </div>
              ))}
            </div>
          </>
        )}

        {/* Similar */}
        <div className="flex items-center gap-[10px] mb-4" style={{ fontFamily: 'Syne, sans-serif', fontSize: 16, fontWeight: 700, color: 'var(--t1)' }}>
          <div style={{ width: 3, height: 18, background: 'linear-gradient(to bottom,#9B5CF6,#06B6D4)', borderRadius: 2 }} />
          More Like This
        </div>
        {loading.similar ? (
          <div className="crow">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex-shrink-0 rounded-[10px] animate-pulse" style={{ width: 148, height: 222, background: 'var(--bg3)' }} />
            ))}
          </div>
        ) : (
          <div className="crow">
            {similar.map((m) => <MovieCard key={m.id} movie={m} />)}
          </div>
        )}
      </div>
    </div>
  );
}
