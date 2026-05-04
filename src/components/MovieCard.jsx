// src/components/MovieCard.jsx
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toggleWatchlist } from '../store/mediaSlice';
import { useToast } from '../hooks/useToast';

export default function MovieCard({ movie, badge }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();
  const watchlist = useSelector((s) => s.media.watchlist);
  const inWl = watchlist.includes(movie.id);
  const [imgError, setImgError] = useState(false);

  // Fallback initials when no poster or poster fails to load
  const initials = (movie.title || '')
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

  const handleWl = (e) => {
    e.stopPropagation();
    dispatch(toggleWatchlist(movie.id));
    toast(inWl ? 'Removed from watchlist' : 'Added to watchlist', inWl ? '#F43F5E' : '#10B981');
  };

  const showPoster = movie.poster && !imgError;

  return (
    <div
      className="mc-glow-wrap"
      style={{ '--card-color': movie.color || '#7C3AED', flexShrink: 0 }}
    >
      <div
        className="group relative rounded-[10px] overflow-hidden cursor-pointer transition-all duration-200 ease-out hover:scale-105 hover:-translate-y-1"
        style={{ width: 148 }}
        onClick={() => navigate(`/detail/${movie.id}`)}
      >
        {/* Poster / Fallback */}
        <div
          className="relative flex items-center justify-center transition-all duration-200 group-hover:brightness-75"
          style={{
            width: 148,
            height: 222,
            background: `linear-gradient(155deg,${movie.color || '#111'},#0c1120)`,
            overflow: 'hidden',
          }}
        >
          {showPoster ? (
            <img
              src={movie.poster}
              alt={movie.title}
              onError={() => setImgError(true)}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
              }}
            />
          ) : (
            <span
              style={{
                fontFamily: 'Syne, sans-serif',
                fontSize: 36,
                fontWeight: 800,
                color: 'rgba(255,255,255,0.12)',
                letterSpacing: 1,
                userSelect: 'none',
              }}
            >
              {initials}
            </span>
          )}
        </div>

        {/* Badge */}
        {badge && (
          <div
            className={`absolute top-[7px] left-[7px] px-[6px] py-[2px] rounded text-[9px] font-bold tracking-[0.5px] ${
              badge === 'NEW' ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
            }`}
            style={{ fontFamily: 'Syne, sans-serif' }}
          >
            {badge}
          </div>
        )}

        {/* Watchlist btn */}
        <button
          onClick={handleWl}
          className={`absolute top-[7px] right-[7px] w-[26px] h-[26px] rounded-full flex items-center justify-center text-[13px] backdrop-blur-sm transition-all duration-200 ${
            inWl
              ? 'opacity-100 border-transparent'
              : 'opacity-0 group-hover:opacity-100 border border-white/10'
          }`}
          style={{
            background: inWl
              ? 'linear-gradient(135deg,#7C3AED,#5B21B6)'
              : 'rgba(7,11,20,0.75)',
          }}
        >
          {inWl ? '✓' : '＋'}
        </button>

        {/* Progress bar */}
        {movie.prog > 0 && movie.prog < 100 && (
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/10">
            <div
              className="h-full rounded-sm"
              style={{
                width: `${movie.prog}%`,
                background: 'linear-gradient(90deg,#7C3AED,#06B6D4)',
                boxShadow: '0 0 8px rgba(124,58,237,0.5)',
              }}
            />
          </div>
        )}

        {/* Hover overlay */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-200 flex flex-col justify-end p-[11px]"
          style={{
            background:
              'linear-gradient(0deg,rgba(7,11,20,0.97) 0%,rgba(7,11,20,0.5) 45%,transparent 100%)',
          }}
        >
          <button
            className="w-8 h-8 rounded-full flex items-center justify-center mb-[7px] transition-all hover:scale-110"
            style={{
              background: 'linear-gradient(135deg,#7C3AED,#5B21B6)',
              boxShadow: '0 0 12px rgba(124,58,237,0.3)',
            }}
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/player/${movie.id}`);
            }}
          >
            <div
              style={{
                width: 0,
                height: 0,
                borderTop: '4px solid transparent',
                borderBottom: '4px solid transparent',
                borderLeft: '7px solid #fff',
                marginLeft: 2,
              }}
            />
          </button>
          <div
            style={{
              fontFamily: 'Syne, sans-serif',
              fontSize: 11,
              fontWeight: 700,
              color: '#F1F5FF',
              marginBottom: 3,
              lineHeight: 1.3,
            }}
          >
            {movie.title}
          </div>
          <div style={{ fontSize: 10, color: '#4B5A75' }}>
            {movie.year} · ★{movie.rating}
          </div>
        </div>

        {/* Info below card */}
        <div className="pt-[9px] px-[3px]">
          <div
            style={{
              fontFamily: 'Syne, sans-serif',
              fontSize: 12,
              fontWeight: 600,
              color: 'var(--t1)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {movie.title}
          </div>
          <div style={{ fontSize: 10, color: 'var(--t3)', marginTop: 2 }}>
            {movie.year} ·{' '}
            {movie.genre
              ? movie.genre.charAt(0).toUpperCase() + movie.genre.slice(1)
              : movie.type === 'show' ? 'Series' : 'Movie'}
          </div>
        </div>
      </div>
    </div>
  );
}
