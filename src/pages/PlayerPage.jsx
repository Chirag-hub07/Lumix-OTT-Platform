// src/pages/PlayerPage.jsx
import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectAllMedia, fetchTrailer, addToHistory } from '../store/mediaSlice';
import MovieCard from '../components/MovieCard';

export default function PlayerPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const allMedia = useSelector(selectAllMedia);
  const { trailer, loading, currentDetail } = useSelector((s) => s.media);

  // Use currentDetail if available (has runtimeMins), fall back to allMedia
  const movie = currentDetail?.id === id ? currentDetail : allMedia.find((m) => m.id === id) || allMedia[0];
  const nextUp = allMedia.filter((m) => m.id !== id).slice(0, 8);

  useEffect(() => {
    if (id && movie) {
      dispatch(fetchTrailer({ tmdbId: id, type: movie.type }));
      // Log to history with real metadata
      dispatch(addToHistory({
        id,
        title: movie.title,
        genre: movie.genre,
        type: movie.type,
        runtimeMins: movie.runtimeMins || 90,
      }));
    }
  }, [id]);

  const genre = movie?.genre
    ? movie.genre.charAt(0).toUpperCase() + movie.genre.slice(1)
    : movie?.type === 'show' ? 'Series' : 'Movie';

  if (!movie) {
    return (
      <div className="pg-fade" style={{ padding: '18px 24px' }}>
        <div className="animate-pulse rounded-xl" style={{ aspectRatio: '16/9', background: 'var(--bg3)' }} />
      </div>
    );
  }

  return (
    <div className="pg-fade" style={{ padding: '18px 24px' }}>
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-[6px] px-[14px] py-[7px] rounded-[20px] text-[12px] font-medium mb-[14px] cursor-pointer transition-all hover:text-t1"
        style={{ background: 'rgba(7,11,20,0.65)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--t2)' }}
      >
        ← Back
      </button>

      {/* Player */}
      <div
        className="relative rounded-xl overflow-hidden mb-[14px]"
        style={{ background: '#000', border: '1px solid rgba(255,255,255,0.06)', aspectRatio: '16/9', width: '100%' }}
      >
        {loading.trailer ? (
          <div className="w-full h-full flex flex-col items-center justify-center gap-4"
            style={{ background: 'radial-gradient(ellipse at center,#0d0c1f,#000)' }}>
            <div className="animate-pulse" style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(124,58,237,0.3)' }} />
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)', fontFamily: 'Syne, sans-serif' }}>Loading trailer…</div>
          </div>
        ) : trailer ? (
          <iframe
            src={`https://www.youtube.com/embed/${trailer}?autoplay=1&rel=0&modestbranding=1`}
            title={movie?.title || 'Trailer'}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-4"
            style={{
              background: movie?.backdrop
                ? `linear-gradient(rgba(0,0,0,0.7),rgba(0,0,0,0.7)), url(${movie.backdrop}) center/cover`
                : 'radial-gradient(ellipse at center,#0d0c1f,#000)',
            }}>
            <div style={{ fontSize: 48 }}>🎬</div>
            <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 16, fontWeight: 700, color: 'rgba(255,255,255,0.8)' }}>No trailer available</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>TMDB has no trailer for this title</div>
          </div>
        )}
      </div>

      <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 20, fontWeight: 700, color: 'var(--t1)', marginBottom: 4 }}>{movie.title}</div>
      <div style={{ fontSize: 12, color: 'var(--t3)', marginBottom: 20 }}>{movie.year} · {genre} · {movie.dur}</div>

      <div className="flex items-center gap-[10px] mb-4" style={{ fontFamily: 'Syne, sans-serif', fontSize: 16, fontWeight: 700, color: 'var(--t1)' }}>
        <div style={{ width: 3, height: 18, background: 'linear-gradient(to bottom,#9B5CF6,#06B6D4)', borderRadius: 2 }} />
        Up Next
      </div>
      <div className="crow">
        {nextUp.map((m) => <MovieCard key={m.id} movie={m} />)}
      </div>
    </div>
  );
}