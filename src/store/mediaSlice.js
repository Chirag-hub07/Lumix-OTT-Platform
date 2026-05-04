// src/store/mediaSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { login, logout } from './authSlice';

const BASE = 'https://api.themoviedb.org/3';
const TOKEN = import.meta.env.VITE_TMDB_KEY;

const headers = {
  Authorization: `Bearer ${TOKEN}`,
  'Content-Type': 'application/json',
};

// ── helpers ───────────────────────────────────────────────────────────────────

function normalize(item, mediaType) {
  const isTV = (mediaType || item.media_type) === 'tv';
  return {
    id: String(item.id),
    tmdbId: item.id,
    title: isTV ? (item.name || item.original_name) : (item.title || item.original_title),
    year: parseInt((isTV ? item.first_air_date : item.release_date)?.split('-')[0]) || 0,
    rating: Math.round(item.vote_average * 10) / 10,
    genre: mapGenre(item.genre_ids?.[0]),
    type: isTV ? 'show' : 'movie',
    dur: isTV ? 'Series' : 'Movie',
    prog: 0,
    color: '#0c1120',
    desc: item.overview || '',
    cast: [],
    poster: item.poster_path ? `https://image.tmdb.org/t/p/w342${item.poster_path}` : null,
    backdrop: item.backdrop_path ? `https://image.tmdb.org/t/p/w780${item.backdrop_path}` : null,
    language: item.original_language,
    popularity: item.popularity,
  };
}

function mapGenre(id) {
  const map = {
    28: 'action', 12: 'adventure', 16: 'animation', 35: 'comedy',
    80: 'crime', 99: 'documentary', 18: 'drama', 10751: 'family',
    14: 'fantasy', 36: 'history', 27: 'horror', 10402: 'music',
    9648: 'mystery', 10749: 'romance', 878: 'scifi', 10770: 'tv',
    53: 'thriller', 10752: 'war', 37: 'western',
  };
  return map[id] || 'drama';
}

async function fetchPage(url) {
  const res = await fetch(url, { headers });
  if (!res.ok) throw new Error(`TMDB error: ${res.status}`);
  const data = await res.json();
  return data.results || [];
}

// ── thunks ────────────────────────────────────────────────────────────────────

export const fetchTrending = createAsyncThunk('media/fetchTrending', async () => {
  const results = await fetchPage(`${BASE}/trending/all/week?language=en-US`);
  return results.map((i) => normalize(i, i.media_type));
});

export const fetchBollywood = createAsyncThunk('media/fetchBollywood', async () => {
  const [movies, series] = await Promise.all([
    fetchPage(`${BASE}/discover/movie?with_original_language=hi&sort_by=popularity.desc&region=IN`),
    fetchPage(`${BASE}/discover/tv?with_original_language=hi&sort_by=popularity.desc`),
  ]);
  return [...movies.map((i) => normalize(i, 'movie')), ...series.map((i) => normalize(i, 'tv'))]
    .sort((a, b) => b.popularity - a.popularity);
});

export const fetchTamil = createAsyncThunk('media/fetchTamil', async () => {
  const results = await fetchPage(`${BASE}/discover/movie?with_original_language=ta&sort_by=popularity.desc`);
  return results.map((i) => normalize(i, 'movie'));
});

export const fetchTelugu = createAsyncThunk('media/fetchTelugu', async () => {
  const results = await fetchPage(`${BASE}/discover/movie?with_original_language=te&sort_by=popularity.desc`);
  return results.map((i) => normalize(i, 'movie'));
});

export const fetchKorean = createAsyncThunk('media/fetchKorean', async () => {
  const [movies, series] = await Promise.all([
    fetchPage(`${BASE}/discover/movie?with_original_language=ko&sort_by=popularity.desc`),
    fetchPage(`${BASE}/discover/tv?with_original_language=ko&sort_by=popularity.desc`),
  ]);
  return [...movies.map((i) => normalize(i, 'movie')), ...series.map((i) => normalize(i, 'tv'))]
    .sort((a, b) => b.popularity - a.popularity);
});

export const fetchTopSeries = createAsyncThunk('media/fetchTopSeries', async () => {
  const results = await fetchPage(`${BASE}/tv/top_rated?language=en-US`);
  return results.map((i) => normalize(i, 'tv'));
});

export const fetchNowPlaying = createAsyncThunk('media/fetchNowPlaying', async () => {
  const results = await fetchPage(`${BASE}/movie/now_playing?language=en-US&region=IN`);
  return results.map((i) => normalize(i, 'movie'));
});

export const fetchTopRated = createAsyncThunk('media/fetchTopRated', async () => {
  const [movies, tv] = await Promise.all([
    fetchPage(`${BASE}/movie/top_rated?language=en-US`),
    fetchPage(`${BASE}/tv/top_rated?language=en-US`),
  ]);
  return [...movies.map((i) => normalize(i, 'movie')), ...tv.map((i) => normalize(i, 'tv'))]
    .sort((a, b) => b.rating - a.rating);
});

export const fetchMediaDetail = createAsyncThunk('media/fetchMediaDetail', async ({ tmdbId, type }) => {
  const endpoint = type === 'show' ? 'tv' : 'movie';
  const [detail, credits] = await Promise.all([
    fetch(`${BASE}/${endpoint}/${tmdbId}?language=en-US`, { headers }).then((r) => r.json()),
    fetch(`${BASE}/${endpoint}/${tmdbId}/credits?language=en-US`, { headers }).then((r) => r.json()),
  ]);
  const isTV = endpoint === 'tv';
  const cast = (credits.cast || []).slice(0, 8).map((c) => c.name);
  const runtimeMins = isTV ? null : detail.runtime;
  return {
    id: String(detail.id),
    tmdbId: detail.id,
    title: isTV ? detail.name : detail.title,
    year: parseInt((isTV ? detail.first_air_date : detail.release_date)?.split('-')[0]) || 0,
    rating: Math.round(detail.vote_average * 10) / 10,
    genre: mapGenre(detail.genres?.[0]?.id),
    genres: detail.genres?.map((g) => g.name) || [],
    type: isTV ? 'show' : 'movie',
    dur: isTV
      ? `${detail.number_of_seasons} Season${detail.number_of_seasons > 1 ? 's' : ''}`
      : runtimeMins ? `${Math.floor(runtimeMins / 60)}h ${runtimeMins % 60}m` : 'Movie',
    runtimeMins: runtimeMins || 90,
    prog: 0,
    color: '#0c1120',
    desc: detail.overview || '',
    cast,
    poster: detail.poster_path ? `https://image.tmdb.org/t/p/w342${detail.poster_path}` : null,
    backdrop: detail.backdrop_path ? `https://image.tmdb.org/t/p/w1280${detail.backdrop_path}` : null,
    language: detail.original_language,
    tagline: detail.tagline || '',
  };
});

export const fetchSimilar = createAsyncThunk('media/fetchSimilar', async ({ tmdbId, type }) => {
  const endpoint = type === 'show' ? 'tv' : 'movie';
  const results = await fetchPage(`${BASE}/${endpoint}/${tmdbId}/similar?language=en-US`);
  return results.slice(0, 8).map((i) => normalize(i, endpoint === 'tv' ? 'tv' : 'movie'));
});

export const fetchTrailer = createAsyncThunk('media/fetchTrailer', async ({ tmdbId, type }) => {
  const endpoint = type === 'show' ? 'tv' : 'movie';
  const res = await fetch(`${BASE}/${endpoint}/${tmdbId}/videos?language=en-US`, { headers });
  if (!res.ok) return null;
  const data = await res.json();
  const videos = data.results || [];
  const trailer =
    videos.find((v) => v.site === 'YouTube' && v.type === 'Trailer' && v.official) ||
    videos.find((v) => v.site === 'YouTube' && v.type === 'Trailer') ||
    videos.find((v) => v.site === 'YouTube');
  return trailer ? trailer.key : null;
});

export const fetchMovies = createAsyncThunk('media/fetchMovies', async (_, { dispatch }) => {
  dispatch(fetchTrending());
  dispatch(fetchBollywood());
  dispatch(fetchTamil());
  dispatch(fetchTelugu());
  dispatch(fetchKorean());
  dispatch(fetchTopSeries());
  dispatch(fetchNowPlaying());
  dispatch(fetchTopRated());
  return [];
});

// ── slice ─────────────────────────────────────────────────────────────────────

function loadingReducers(builder, thunk, key) {
  builder
    .addCase(thunk.pending, (state) => { state.loading[key] = true; })
    .addCase(thunk.fulfilled, (state, action) => { state.loading[key] = false; state[key] = action.payload; })
    .addCase(thunk.rejected, (state) => { state.loading[key] = false; });
}

function getStoredSessionEmail() {
  try {
    const raw = localStorage.getItem('lumix_session');
    if (!raw) return null;
    return JSON.parse(raw).user?.email || null;
  } catch {
    return null;
  }
}

function getStoredPrefs(email) {
  if (!email) return {};
  try {
    const raw = localStorage.getItem(`lumix_media_prefs_${email}`);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function savePrefs(state) {
  try {
    const email = state.currentUserEmail;
    if (!email) return;
    localStorage.setItem(`lumix_media_prefs_${email}`, JSON.stringify({
      watchlist: state.watchlist,
      history: state.history,
      selectedGenres: state.selectedGenres,
      theme: state.theme
    }));
  } catch {}
}

const initialEmail = getStoredSessionEmail();
const storedPrefs = getStoredPrefs(initialEmail);

const initialState = {
  currentUserEmail: initialEmail,
  trending: [],
  bollywood: [],
  tamil: [],
  telugu: [],
  korean: [],
  topSeries: [],
  nowPlaying: [],
  topRated: [],
  currentDetail: null,
  similar: [],
  trailer: null,
  loading: {},
  error: null,
  watchlist: storedPrefs.watchlist || [],
  history: storedPrefs.history || [],
  selectedGenres: storedPrefs.selectedGenres || [],
  browseFilter: { type: 'all', genre: null, sort: 'pop', query: '' },
  browsePage: 1,
  theme: storedPrefs.theme || 'dark',
};

const mediaSlice = createSlice({
  name: 'media',
  initialState,
  reducers: {
    toggleWatchlist: (state, action) => {
      const id = action.payload;
      const idx = state.watchlist.indexOf(id);
      if (idx >= 0) state.watchlist.splice(idx, 1);
      else state.watchlist.push(id);
      savePrefs(state);
    },
    // action.payload = { id, title, genre, type, runtimeMins }
    addToHistory: (state, action) => {
      const { id, title, genre, type, runtimeMins } = action.payload;
      // Remove existing entry for same id so it moves to top
      state.history = state.history.filter((h) => h.id !== id);
      state.history.unshift({
        id,
        title: title || '',
        genre: genre || 'drama',
        type: type || 'movie',
        runtimeMins: runtimeMins || 90,
        watchedAt: Date.now(),
      });
      savePrefs(state);
    },
    toggleGenre: (state, action) => {
      const g = action.payload;
      const idx = state.selectedGenres.indexOf(g);
      if (idx >= 0) state.selectedGenres.splice(idx, 1);
      else state.selectedGenres.push(g);
      savePrefs(state);
    },
    setBrowseFilter: (state, action) => {
      state.browseFilter = { ...state.browseFilter, ...action.payload };
      state.browsePage = 1;
    },
    loadMoreBrowse: (state) => { state.browsePage += 1; },
    toggleTheme: (state) => { 
      state.theme = state.theme === 'dark' ? 'light' : 'dark'; 
      savePrefs(state);
    },
    clearDetail: (state) => { state.currentDetail = null; state.similar = []; },
  },
  extraReducers: (builder) => {
    loadingReducers(builder, fetchTrending, 'trending');
    loadingReducers(builder, fetchBollywood, 'bollywood');
    loadingReducers(builder, fetchTamil, 'tamil');
    loadingReducers(builder, fetchTelugu, 'telugu');
    loadingReducers(builder, fetchKorean, 'korean');
    loadingReducers(builder, fetchTopSeries, 'topSeries');
    loadingReducers(builder, fetchNowPlaying, 'nowPlaying');
    loadingReducers(builder, fetchTopRated, 'topRated');
    loadingReducers(builder, fetchSimilar, 'similar');

    builder
      .addCase(fetchMediaDetail.pending, (state) => { state.loading.detail = true; state.currentDetail = null; })
      .addCase(fetchMediaDetail.fulfilled, (state, action) => { state.loading.detail = false; state.currentDetail = action.payload; })
      .addCase(fetchMediaDetail.rejected, (state) => { state.loading.detail = false; });

    builder
      .addCase(fetchTrailer.pending, (state) => { state.loading.trailer = true; state.trailer = null; })
      .addCase(fetchTrailer.fulfilled, (state, action) => { state.loading.trailer = false; state.trailer = action.payload; })
      .addCase(fetchTrailer.rejected, (state) => { state.loading.trailer = false; state.trailer = null; });

    builder.addCase(fetchMovies.fulfilled, () => {});

    builder.addCase(login, (state, action) => {
      const email = action.payload.email;
      state.currentUserEmail = email;
      try {
        const raw = localStorage.getItem(`lumix_media_prefs_${email}`);
        const prefs = raw ? JSON.parse(raw) : {};
        state.watchlist = prefs.watchlist || [];
        state.history = prefs.history || [];
        state.selectedGenres = prefs.selectedGenres || [];
        state.theme = prefs.theme || 'dark';
      } catch {}
    });

    builder.addCase(logout, (state) => {
      state.currentUserEmail = null;
      state.watchlist = [];
      state.history = [];
      state.selectedGenres = [];
      state.theme = 'dark';
    });
  },
});

export const {
  toggleWatchlist, addToHistory, toggleGenre,
  setBrowseFilter, loadMoreBrowse, toggleTheme, clearDetail,
} = mediaSlice.actions;

// ── selectors ─────────────────────────────────────────────────────────────────

export const selectAllMedia = (state) => {
  const { trending, bollywood, tamil, telugu, korean, topSeries, nowPlaying, topRated } = state.media;
  const seen = new Set();
  return [...trending, ...bollywood, ...tamil, ...telugu, ...korean, ...topSeries, ...nowPlaying, ...topRated]
    .filter((m) => { if (seen.has(m.id)) return false; seen.add(m.id); return true; });
};

export const selectIsAnyLoading = (state) => Object.values(state.media.loading).some(Boolean);

export default mediaSlice.reducer;