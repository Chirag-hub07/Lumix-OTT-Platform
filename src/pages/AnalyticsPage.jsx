// src/pages/AnalyticsPage.jsx
import { useEffect, useRef, useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Chart, registerables } from 'chart.js';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { selectAllMedia } from '../store/mediaSlice';
import { GENRES, GENRE_COLORS } from '../data/movies';
Chart.register(...registerables);

// ── helpers ───────────────────────────────────────────────────────────────────

function timeAgo(ts) {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  const hrs = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 2) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  if (hrs < 24) return `${hrs}h ago`;
  return `${days}d ago`;
}

function formatHours(mins) {
  if (!mins) return '0h';
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

// Build bar chart data from real watch history grouped by day/week/month
function buildBarData(history, period) {
  const now = Date.now();
  const DAY = 86400000;

  if (period === 'week') {
    const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const data = new Array(7).fill(0);
    history.forEach((h) => {
      const diff = now - h.watchedAt;
      if (diff <= 7 * DAY) {
        const d = new Date(h.watchedAt).getDay(); // 0=Sun
        const idx = d === 0 ? 6 : d - 1; // Mon=0
        data[idx] = +(data[idx] + (h.runtimeMins || 90) / 60).toFixed(1);
      }
    });
    return { labels, data };
  }

  if (period === 'month') {
    const labels = ['W1', 'W2', 'W3', 'W4'];
    const data = new Array(4).fill(0);
    history.forEach((h) => {
      const diff = now - h.watchedAt;
      if (diff <= 28 * DAY) {
        const week = Math.min(3, Math.floor(diff / (7 * DAY)));
        const idx = 3 - week; // most recent = W4
        data[idx] = +(data[idx] + (h.runtimeMins || 90) / 60).toFixed(1);
      }
    });
    return { labels, data };
  }

  // year
  const labels = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const data = new Array(12).fill(0);
  history.forEach((h) => {
    const diff = now - h.watchedAt;
    if (diff <= 365 * DAY) {
      const month = new Date(h.watchedAt).getMonth();
      data[month] = +(data[month] + (h.runtimeMins || 90) / 60).toFixed(1);
    }
  });
  return { labels, data };
}

// Build 8-week trend from real history
function buildTrendData(history) {
  const now = Date.now();
  const WEEK = 7 * 86400000;
  const data = new Array(8).fill(0);
  history.forEach((h) => {
    const diff = now - h.watchedAt;
    if (diff <= 8 * WEEK) {
      const weekIdx = Math.min(7, Math.floor(diff / WEEK));
      const idx = 7 - weekIdx;
      data[idx] = +(data[idx] + (h.runtimeMins || 90) / 60).toFixed(1);
    }
  });
  return data;
}

// ── Empty placeholders ────────────────────────────────────────────────────────

function EmptyChart({ message, icon = '📊' }) {
  return (
    <div style={{
      height: 180, display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: 10,
      background: 'rgba(255,255,255,0.02)', borderRadius: 10,
      border: '1px dashed rgba(255,255,255,0.08)',
    }}>
      <div style={{ fontSize: 32 }}>{icon}</div>
      <div style={{ fontSize: 12, color: 'var(--t3)', textAlign: 'center', maxWidth: 220, lineHeight: 1.6 }}>{message}</div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function AnalyticsPage() {
  const { watchlist, history, selectedGenres } = useSelector((s) => s.media);
  const [period, setPeriod] = useState('week');
  useScrollReveal();

  const barRef = useRef(null);
  const lineRef = useRef(null);
  const pieRef = useRef(null);
  const barInst = useRef(null);
  const lineInst = useRef(null);
  const pieInst = useRef(null);

  const hasHistory = history.length > 0;
  const hasWatchlist = watchlist.length > 0;
  const isEmpty = !hasHistory && !hasWatchlist;

  // ── Derived stats ─────────────────────────────────────────────────────────

  const totalMins = useMemo(() =>
    history.reduce((acc, h) => acc + (h.runtimeMins || 90), 0), [history]);

  const genreBreakdown = useMemo(() => {
    if (!hasHistory) return [];
    const counts = {};
    history.forEach((h) => { if (h.genre) counts[h.genre] = (counts[h.genre] || 0) + 1; });
    const total = Object.values(counts).reduce((a, b) => a + b, 0);
    return Object.entries(counts)
      .map(([genre, count]) => {
        const gIdx = GENRES.findIndex((g) => g.id === genre);
        const g = GENRES[gIdx] || { name: genre.charAt(0).toUpperCase() + genre.slice(1), emoji: '🎬' };
        return {
          n: g.name, emoji: g.emoji,
          pct: Math.round((count / total) * 100),
          c: GENRE_COLORS[gIdx >= 0 ? gIdx % GENRE_COLORS.length : 0],
        };
      })
      .sort((a, b) => b.pct - a.pct)
      .slice(0, 6);
  }, [history]);

  const topGenre = genreBreakdown[0];
  const movieCount = history.filter((h) => h.type === 'movie').length;
  const seriesCount = history.filter((h) => h.type === 'show').length;
  const splitTotal = movieCount + seriesCount || 1;
  const moviePct = Math.round((movieCount / splitTotal) * 100);
  const seriesPct = 100 - moviePct;

  const recentActivity = useMemo(() => {
    const acts = [];
    history.slice(0, 5).forEach((h) => {
      acts.push({
        txt: `Watched ${h.title} — ${formatHours(h.runtimeMins)}`,
        time: timeAgo(h.watchedAt),
        col: GENRE_COLORS[GENRES.findIndex((g) => g.id === h.genre) % GENRE_COLORS.length] || '#7C3AED',
        emoji: '▶',
      });
    });
    watchlist.slice(0, 3).forEach((id, i) => {
      acts.push({
        txt: `Saved a title to watchlist`,
        time: `Recently`,
        col: '#06B6D4',
        emoji: '+',
      });
    });
    return acts.slice(0, 7);
  }, [history, watchlist]);

  const barData = useMemo(() => buildBarData(history, period), [history, period]);
  const trendData = useMemo(() => buildTrendData(history), [history]);

  const stats = [
    {
      label: 'Watch Time',
      val: hasHistory ? formatHours(totalMins) : '0h',
      change: hasHistory ? `Across ${history.length} title${history.length > 1 ? 's' : ''}` : 'Watch something to start',
      accent: '#7C3AED',
    },
    {
      label: 'Titles Watched',
      val: history.length,
      change: hasHistory ? `${movieCount} movie${movieCount !== 1 ? 's' : ''}, ${seriesCount} series` : 'None yet',
      accent: '#06B6D4',
    },
    {
      label: 'Top Genre',
      val: topGenre ? `${topGenre.emoji} ${topGenre.n}` : '—',
      change: topGenre ? `${topGenre.pct}% of watches` : 'Watch to discover your taste',
      accent: '#10B981',
    },
    {
      label: 'Watchlist',
      val: watchlist.length,
      change: hasWatchlist ? `${watchlist.length} title${watchlist.length > 1 ? 's' : ''} saved` : 'Nothing saved yet',
      accent: '#F59E0B',
    },
  ];

  // ── Chart colours ─────────────────────────────────────────────────────────

  const gridC = 'rgba(255,255,255,0.05)';
  const tickC = 'rgba(255,255,255,0.3)';
  const chartOpts = {
    responsive: true, maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { backgroundColor: '#1A2235', titleColor: '#F1F5FF', bodyColor: '#94A3C0', borderColor: 'rgba(255,255,255,0.1)', borderWidth: 1 },
    },
    scales: {
      x: { grid: { color: gridC }, ticks: { color: tickC, font: { size: 11 } } },
      y: { grid: { color: gridC }, ticks: { color: tickC, font: { size: 11 }, callback: (v) => v + 'h' }, beginAtZero: true },
    },
  };

  // ── Charts ────────────────────────────────────────────────────────────────

  useEffect(() => {
    if (!hasHistory) return;

    if (barRef.current) {
      if (barInst.current) barInst.current.destroy();
      const peak = barData.data.indexOf(Math.max(...barData.data));
      barInst.current = new Chart(barRef.current, {
        type: 'bar',
        data: {
          labels: barData.labels,
          datasets: [{
            label: 'Hours', data: barData.data,
            backgroundColor: barData.data.map((_, i) => i === peak ? 'rgba(124,58,237,0.9)' : 'rgba(124,58,237,0.45)'),
            hoverBackgroundColor: 'rgba(155,92,246,0.9)', borderRadius: 5, borderSkipped: false,
          }],
        },
        options: chartOpts,
      });
    }

    if (lineRef.current) {
      if (lineInst.current) lineInst.current.destroy();
      lineInst.current = new Chart(lineRef.current, {
        type: 'line',
        data: {
          labels: ['Wk 1','Wk 2','Wk 3','Wk 4','Wk 5','Wk 6','Wk 7','Wk 8'],
          datasets: [{
            label: 'Hours', data: trendData,
            borderColor: '#06B6D4', backgroundColor: 'rgba(6,182,212,0.08)',
            borderWidth: 2, pointBackgroundColor: '#06B6D4',
            pointRadius: 3, pointHoverRadius: 5, fill: true, tension: 0.4,
          }],
        },
        options: chartOpts,
      });
    }

    if (pieRef.current) {
      if (pieInst.current) pieInst.current.destroy();
      pieInst.current = new Chart(pieRef.current, {
        type: 'doughnut',
        data: {
          labels: ['Movies', 'Series'],
          datasets: [{
            data: [moviePct, seriesPct],
            backgroundColor: ['rgba(124,58,237,0.85)', 'rgba(6,182,212,0.85)'],
            hoverBackgroundColor: ['rgba(155,92,246,0.95)', 'rgba(34,211,238,0.95)'],
            borderWidth: 0, hoverOffset: 4,
          }],
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, cutout: '72%' },
      });
    }

    return () => {
      if (barInst.current) barInst.current.destroy();
      if (lineInst.current) lineInst.current.destroy();
      if (pieInst.current) pieInst.current.destroy();
    };
  }, [hasHistory, trendData, moviePct, seriesPct]);

  // Update bar chart on period change
  useEffect(() => {
    if (!barInst.current || !hasHistory) return;
    const d = buildBarData(history, period);
    const peak = d.data.indexOf(Math.max(...d.data));
    barInst.current.data.labels = d.labels;
    barInst.current.data.datasets[0].data = d.data;
    barInst.current.data.datasets[0].backgroundColor = d.data.map((_, i) =>
      i === peak ? 'rgba(124,58,237,0.9)' : 'rgba(124,58,237,0.45)'
    );
    barInst.current.update();
  }, [period, history]);

  const card = (children, extraStyle = {}) => (
    <div className="rounded-xl p-5 scroll-reveal" style={{ background: 'var(--bg2)', border: '1px solid var(--bg4)', ...extraStyle }}>
      {children}
    </div>
  );

  return (
    <div className="pg-fade" style={{ padding: '0 24px 32px' }}>
      <div style={{ paddingTop: 28, marginBottom: 24 }}>
        <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 24, fontWeight: 800, color: 'var(--t1)', marginBottom: 4 }}>
          Your Watch Analytics
        </div>
        <div style={{ fontSize: 13, color: 'var(--t3)' }}>
          {isEmpty
            ? 'Start watching and saving titles to see your personalised insights'
            : `Based on ${history.length} watched title${history.length !== 1 ? 's' : ''} and ${watchlist.length} saved`}
        </div>
      </div>

      {/* Empty state */}
      {isEmpty && (
        <div className="rounded-xl p-10 mb-6 flex flex-col items-center gap-4 text-center"
          style={{ background: 'var(--bg2)', border: '1px dashed var(--bg5)' }}>
          <div style={{ fontSize: 48 }}>🎬</div>
          <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 18, fontWeight: 700, color: 'var(--t1)' }}>
            Your analytics will appear here
          </div>
          <div style={{ fontSize: 13, color: 'var(--t3)', maxWidth: 340, lineHeight: 1.7 }}>
            Browse movies, hit Play on anything you like, and save titles to your watchlist. Your charts and insights will update automatically.
          </div>
        </div>
      )}

      {/* Stat cards — always visible, zeros for new users */}
      <div className="grid gap-[10px] mb-6" style={{ gridTemplateColumns: 'repeat(4,1fr)' }}>
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl p-[18px]"
            style={{ background: 'var(--bg2)', border: `1px solid ${s.accent}22`, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: -20, right: -20, width: 80, height: 80, borderRadius: '50%', background: s.accent + '0d', filter: 'blur(20px)' }} />
            <div style={{ fontSize: 11, color: 'var(--t3)', fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: 8 }}>{s.label}</div>
            <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 28, fontWeight: 800, color: 'var(--t1)', lineHeight: 1 }}>{s.val}</div>
            <div style={{ fontSize: 11, marginTop: 6, color: 'var(--t3)' }}>{s.change}</div>
          </div>
        ))}
      </div>

      {/* Period tabs */}
      <div className="flex gap-1 mb-5 p-1 rounded-lg" style={{ background: 'var(--bg2)', border: '1px solid var(--bg4)', display: 'inline-flex' }}>
        {['week', 'month', 'year'].map((p) => (
          <button key={p} onClick={() => setPeriod(p)}
            className="px-4 py-[6px] rounded-md text-[13px] font-semibold capitalize cursor-pointer transition-all"
            style={{
              fontFamily: 'Syne, sans-serif',
              background: period === p ? 'rgba(124,58,237,0.15)' : 'transparent',
              color: period === p ? '#9B5CF6' : 'var(--t3)',
              border: period === p ? '1px solid rgba(124,58,237,0.3)' : '1px solid transparent',
            }}>
            {p === 'week' ? 'This Week' : p === 'month' ? 'This Month' : 'This Year'}
          </button>
        ))}
      </div>

      {/* Charts row 1 */}
      <div className="grid gap-[14px] mb-[14px]" style={{ gridTemplateColumns: '1fr 1fr' }}>
        {card(<>
          <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, color: 'var(--t1)', marginBottom: 2 }}>Watch Time</div>
          <div style={{ fontSize: 12, color: 'var(--t3)', marginBottom: 14 }}>Hours watched per period</div>
          {hasHistory
            ? <div style={{ position: 'relative', width: '100%', height: 180 }}><canvas ref={barRef} /></div>
            : <EmptyChart icon="⏱" message="Watch your first title and this chart will show your viewing hours by day, week, or month." />
          }
        </>)}

        {card(<>
          <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, color: 'var(--t1)', marginBottom: 2 }}>Genre Breakdown</div>
          <div style={{ fontSize: 12, color: 'var(--t3)', marginBottom: 14 }}>What you watch most</div>
          {genreBreakdown.length > 0 ? (
            genreBreakdown.map((g) => (
              <div key={g.n} className="flex items-center gap-3 mb-3">
                <div style={{ width: 68, fontSize: 12, color: 'var(--t2)', fontWeight: 600, flexShrink: 0 }}>{g.emoji} {g.n}</div>
                <div style={{ flex: 1, height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ width: `${g.pct}%`, height: '100%', background: g.c, borderRadius: 3, transition: 'width 0.6s ease' }} />
                </div>
                <div style={{ width: 36, fontSize: 11, color: 'var(--t3)', textAlign: 'right', flexShrink: 0 }}>{g.pct}%</div>
              </div>
            ))
          ) : (
            <EmptyChart icon="🎭" message="Your genre preferences will appear here as you watch more titles across different categories." />
          )}
        </>)}
      </div>

      {/* Charts row 2 */}
      <div className="grid gap-[14px] mb-[14px]" style={{ gridTemplateColumns: '1fr 1fr' }}>
        {card(<>
          <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, color: 'var(--t1)', marginBottom: 2 }}>Activity Trend</div>
          <div style={{ fontSize: 12, color: 'var(--t3)', marginBottom: 14 }}>Watch time over 8 weeks</div>
          {hasHistory
            ? <div style={{ position: 'relative', width: '100%', height: 160 }}><canvas ref={lineRef} /></div>
            : <EmptyChart icon="📈" message="Your weekly viewing trend will appear here once you start watching. Come back after watching a few titles." />
          }
        </>)}

        {card(<>
          <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, color: 'var(--t1)', marginBottom: 2 }}>Content Split</div>
          <div style={{ fontSize: 12, color: 'var(--t3)', marginBottom: 14 }}>Movies vs Series</div>
          {hasHistory ? (
            <div className="flex items-center gap-4">
              <div style={{ position: 'relative', width: 110, height: 110, flexShrink: 0 }}><canvas ref={pieRef} /></div>
              <div style={{ flex: 1 }}>
                {[
                  { label: 'Movies', pct: moviePct, c: '#7C3AED', count: movieCount },
                  { label: 'Series', pct: seriesPct, c: '#06B6D4', count: seriesCount },
                ].map((it) => (
                  <div key={it.label} style={{ marginBottom: 10 }}>
                    <div className="flex items-center gap-2 mb-1">
                      <div style={{ width: 9, height: 9, borderRadius: 2, background: it.c, flexShrink: 0 }} />
                      <span style={{ fontSize: 12, color: 'var(--t2)', fontWeight: 600 }}>
                        {it.label} — {it.count} ({it.pct}%)
                      </span>
                    </div>
                    <div style={{ height: 5, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ width: `${it.pct}%`, height: '100%', background: it.c, borderRadius: 3 }} />
                    </div>
                  </div>
                ))}
                <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px solid var(--bg4)' }}>
                  <div style={{ fontSize: 10, color: 'var(--t3)', fontWeight: 700, letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: 6 }}>Top Genre</div>
                  {topGenre ? (
                    <>
                      <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 20, fontWeight: 800, color: '#9B5CF6' }}>{topGenre.emoji} {topGenre.n}</div>
                      <div style={{ fontSize: 11, color: 'var(--t3)' }}>{topGenre.pct}% of all watches</div>
                    </>
                  ) : (
                    <div style={{ fontSize: 13, color: 'var(--t3)' }}>—</div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <EmptyChart icon="🎬" message="Watch a mix of movies and series to see how your content preference splits." />
          )}
        </>)}
      </div>

      {/* Recent Activity */}
      {card(<>
        <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, color: 'var(--t1)', marginBottom: 12 }}>Recent Activity</div>
        {recentActivity.length > 0 ? (
          recentActivity.map((a, i) => (
            <div key={i} className="flex items-center gap-3 py-3"
              style={{ borderBottom: i < recentActivity.length - 1 ? '1px solid var(--bg4)' : 'none' }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%',
                background: a.col + '22', border: `1px solid ${a.col}44`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, color: a.col, flexShrink: 0, fontWeight: 700,
              }}>
                {a.emoji}
              </div>
              <div style={{ flex: 1, fontSize: 13, color: 'var(--t2)' }}>{a.txt}</div>
              <div style={{ fontSize: 11, color: 'var(--t3)', flexShrink: 0 }}>{a.time}</div>
            </div>
          ))
        ) : (
          <div style={{ padding: '20px 0', textAlign: 'center' }}>
            <div style={{ fontSize: 32, marginBottom: 10 }}>🕐</div>
            <div style={{ fontSize: 13, color: 'var(--t3)' }}>No activity yet. Start watching to build your history.</div>
          </div>
        )}
      </>)}

      {/* Taste profile */}
      {selectedGenres.length > 0 && card(<>
        <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, color: 'var(--t1)', marginBottom: 12 }}>My Taste Profile</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {selectedGenres.map((id) => {
            const idx = GENRES.findIndex((g) => g.id === id);
            const g = GENRES[idx];
            if (!g) return null;
            const color = GENRE_COLORS[idx % GENRE_COLORS.length];
            return (
              <div key={id} style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '6px 14px', borderRadius: 24, fontSize: 12, fontWeight: 600,
                fontFamily: 'Syne, sans-serif', background: color + '22', color,
                border: `1px solid ${color}55`,
              }}>
                {g.emoji} {g.name}
              </div>
            );
          })}
        </div>
      </>, { marginTop: 14 })}
    </div>
  );
}