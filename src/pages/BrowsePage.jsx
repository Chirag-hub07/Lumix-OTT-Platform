// src/pages/BrowsePage.jsx
import { useEffect, useMemo, useState, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchTrending, fetchBollywood, fetchTamil, fetchTelugu,
  fetchKorean, fetchTopSeries, fetchNowPlaying, fetchTopRated,
  setBrowseFilter, loadMoreBrowse, selectAllMedia,
} from '../store/mediaSlice';
import MovieCard from '../components/MovieCard';

const PAGE_SIZE = 20;

const GENRE_FILTERS = [
  { label: 'Action', value: 'action' },
  { label: 'Drama', value: 'drama' },
  { label: 'Sci-Fi', value: 'scifi' },
  { label: 'Thriller', value: 'thriller' },
  { label: 'Crime', value: 'crime' },
  { label: 'Comedy', value: 'comedy' },
  { label: 'Horror', value: 'horror' },
  { label: 'Romance', value: 'romance' },
];

const LANG_FILTERS = [
  { label: 'Hollywood', value: 'en' },
  { label: 'Bollywood', value: 'hi' },
  { label: 'Korean', value: 'ko' },
  { label: 'Tamil', value: 'ta' },
  { label: 'Telugu', value: 'te' },
];

export default function BrowsePage() {
  const dispatch = useDispatch();
  const allMedia = useSelector(selectAllMedia);
  const { loading, browseFilter, browsePage } = useSelector((s) => s.media);
  const [localQuery, setLocalQuery] = useState(browseFilter.query || '');
  const [langFilter, setLangFilter] = useState(null);
  const timerRef = useRef(null);

  const isLoading = Object.values(loading).some(Boolean);

  useEffect(() => {
    // Fetch all categories if not already loaded
    const s = window.__lumixStore?.getState().media;
    if (!s?.trending?.length) dispatch(fetchTrending());
    if (!s?.bollywood?.length) dispatch(fetchBollywood());
    if (!s?.tamil?.length) dispatch(fetchTamil());
    if (!s?.telugu?.length) dispatch(fetchTelugu());
    if (!s?.korean?.length) dispatch(fetchKorean());
    if (!s?.topSeries?.length) dispatch(fetchTopSeries());
    if (!s?.nowPlaying?.length) dispatch(fetchNowPlaying());
    if (!s?.topRated?.length) dispatch(fetchTopRated());
  }, [dispatch]);

  useEffect(() => {
    setLocalQuery(browseFilter.query || '');
  }, [browseFilter.query]);

  const handleSearch = useCallback((val) => {
    setLocalQuery(val);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      dispatch(setBrowseFilter({ query: val }));
    }, 300);
  }, [dispatch]);

  const filtered = useMemo(() => {
    let list = [...allMedia];

    if (browseFilter.query) {
      const q = browseFilter.query.toLowerCase();
      list = list.filter((m) =>
        m.title?.toLowerCase().includes(q) ||
        m.genre?.includes(q) ||
        m.desc?.toLowerCase().includes(q)
      );
    }
    if (browseFilter.type !== 'all') {
      list = list.filter((m) => m.type === browseFilter.type);
    }
    if (browseFilter.genre) {
      list = list.filter((m) => m.genre === browseFilter.genre);
    }
    if (langFilter) {
      list = list.filter((m) => m.language === langFilter);
    }
    if (browseFilter.sort === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    } else if (browseFilter.sort === 'year') {
      list.sort((a, b) => b.year - a.year);
    } else {
      list.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
    }
    return list;
  }, [allMedia, browseFilter, langFilter]);

  const displayed = filtered.slice(0, browsePage * PAGE_SIZE);
  const hasMore = displayed.length < filtered.length;

  const setFilter = (key, val) => dispatch(setBrowseFilter({ [key]: val }));

  const FcBtn = ({ label, active, onClick }) => (
    <button
      onClick={onClick}
      className="px-4 py-[7px] rounded-lg text-[12px] font-semibold transition-all cursor-pointer"
      style={{
        fontFamily: 'Syne, sans-serif',
        background: active ? 'rgba(124,58,237,0.15)' : 'rgba(255,255,255,0.04)',
        color: active ? '#9B5CF6' : 'var(--t3)',
        border: `1px solid ${active ? 'rgba(124,58,237,0.4)' : 'rgba(255,255,255,0.06)'}`,
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </button>
  );

  return (
    <div className="pg-fade" style={{ padding: '24px 24px 40px' }}>
      {/* Search */}
      <div
        className="flex items-center gap-3 rounded-xl px-4 py-3 mb-5 focus-within:border-[rgba(124,58,237,0.5)] transition-all"
        style={{ background: 'var(--bg2)', border: '1px solid var(--bg4)' }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--t3)', flexShrink: 0 }}>
          <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
        </svg>
        <input
          value={localQuery}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search movies, series, genres…"
          className="flex-1 bg-transparent border-none outline-none text-[15px]"
          style={{ color: 'var(--t1)', fontFamily: 'Inter, sans-serif' }}
        />
        {localQuery && (
          <button
            onClick={() => { setLocalQuery(''); dispatch(setBrowseFilter({ query: '' })); }}
            style={{ background: 'none', border: 'none', color: 'var(--t3)', cursor: 'pointer', fontSize: 16 }}
          >
            ✕
          </button>
        )}
      </div>

      {/* Type filters */}
      <div className="flex items-center gap-2 flex-wrap mb-3">
        <FcBtn label="All" active={browseFilter.type === 'all'} onClick={() => setFilter('type', 'all')} />
        <FcBtn label="Movies" active={browseFilter.type === 'movie'} onClick={() => setFilter('type', 'movie')} />
        <FcBtn label="Series" active={browseFilter.type === 'show'} onClick={() => setFilter('type', 'show')} />
        <div style={{ width: 1, height: 24, background: 'var(--bg4)', margin: '0 4px' }} />
        {LANG_FILTERS.map((f) => (
          <FcBtn
            key={f.value}
            label={f.label}
            active={langFilter === f.value}
            onClick={() => setLangFilter(langFilter === f.value ? null : f.value)}
          />
        ))}
      </div>

      {/* Genre filters */}
      <div className="flex items-center gap-2 flex-wrap mb-4">
        {GENRE_FILTERS.map((g) => (
          <FcBtn
            key={g.value}
            label={g.label}
            active={browseFilter.genre === g.value}
            onClick={() => setFilter('genre', browseFilter.genre === g.value ? null : g.value)}
          />
        ))}
        <div style={{ width: 1, height: 24, background: 'var(--bg4)', margin: '0 4px' }} />
        <select
          value={browseFilter.sort}
          onChange={(e) => setFilter('sort', e.target.value)}
          className="px-3 py-[7px] rounded-lg text-[12px] cursor-pointer outline-none"
          style={{ background: 'var(--bg3)', border: '1px solid var(--bg5)', color: 'var(--t2)', fontFamily: 'Syne, sans-serif' }}
        >
          <option value="pop">Popularity</option>
          <option value="rating">Top Rated</option>
          <option value="year">Newest First</option>
        </select>
      </div>

      {/* Results count */}
      <div style={{ fontSize: 12, color: 'var(--t3)', marginBottom: 18 }}>
        {isLoading && allMedia.length === 0
          ? 'Loading titles…'
          : `${filtered.length} title${filtered.length !== 1 ? 's' : ''} found`}
      </div>

      {/* Grid */}
      {isLoading && allMedia.length === 0 ? (
        <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill,minmax(148px,1fr))' }}>
          {[...Array(20)].map((_, i) => (
            <div key={i} className="rounded-[10px] animate-pulse" style={{ height: 222, background: 'var(--bg3)' }} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div style={{ fontSize: 48 }}>🔍</div>
          <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 20, fontWeight: 700, color: 'var(--t1)' }}>No results found</div>
          <div style={{ fontSize: 13, color: 'var(--t3)' }}>Try a different search or filter</div>
        </div>
      ) : (
        <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill,minmax(148px,1fr))' }}>
          {displayed.map((m) => <MovieCard key={m.id} movie={m} />)}
        </div>
      )}

      {/* Load more */}
      {hasMore && !isLoading && (
        <div className="flex justify-center mt-8">
          <button
            onClick={() => dispatch(loadMoreBrowse())}
            className="flex items-center gap-2 px-6 py-3 rounded-lg text-[13px] font-semibold transition-all hover:bg-white/10 cursor-pointer"
            style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--t1)', border: '1px solid rgba(255,255,255,0.1)', fontFamily: 'Syne, sans-serif' }}
          >
            Load more ↓ ({filtered.length - displayed.length} remaining)
          </button>
        </div>
      )}
    </div>
  );
}
