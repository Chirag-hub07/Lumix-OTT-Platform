// src/data/movies.js
// Static UI data — actual movie/series data now comes from TMDB via mediaSlice

export const GENRES = [
  { id: 'scifi',    name: 'Sci-Fi',   emoji: '🚀' },
  { id: 'thriller', name: 'Thriller', emoji: '🔍' },
  { id: 'drama',    name: 'Drama',    emoji: '🎭' },
  { id: 'action',   name: 'Action',   emoji: '⚡' },
  { id: 'crime',    name: 'Crime',    emoji: '🕵' },
  { id: 'comedy',   name: 'Comedy',   emoji: '😄' },
  { id: 'horror',   name: 'Horror',   emoji: '👻' },
  { id: 'romance',  name: 'Romance',  emoji: '💫' },
  { id: 'animation',name: 'Animation',emoji: '🎨' },
  { id: 'adventure',name: 'Adventure',emoji: '🌍' },
];

export const GENRE_COLORS = [
  '#7C3AED','#06B6D4','#10B981','#F59E0B',
  '#F43F5E','#8B5CF6','#14B8A6','#F97316',
];

export const COLLECTIONS = [
  { title: 'Award Winners',  sub: 'Best picture nominees',    count: '14 titles', bg: 'linear-gradient(135deg,#1a0824,#0c1120)' },
  { title: 'Mind-Bending',   sub: 'Sci-Fi essentials',        count: '22 titles', bg: 'linear-gradient(135deg,#08101a,#070b18)' },
  { title: 'Late Night',     sub: 'Thriller & Crime',         count: '18 titles', bg: 'linear-gradient(135deg,#18080a,#0c0c14)' },
  { title: 'Hidden Gems',    sub: 'Underrated masterpieces',  count: '31 titles', bg: 'linear-gradient(135deg,#081014,#0a0810)' },
];
