// src/App.jsx
import { lazy, Suspense, useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Navbar from './components/Navbar';
import Toast from './components/Toast';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import SplashScreen from './components/Splashscreen';
import { fetchMovies } from './store/mediaSlice';

const AuthPage      = lazy(() => import('./pages/AuthPage'));
const SignupPage    = lazy(() => import('./pages/SignupPage'));
const OnboardPage   = lazy(() => import('./pages/OnboardPage'));
const HomePage      = lazy(() => import('./pages/HomePage'));
const BrowsePage    = lazy(() => import('./pages/BrowsePage'));
const DetailPage    = lazy(() => import('./pages/DetailPage'));
const PlayerPage    = lazy(() => import('./pages/PlayerPage'));
const AnalyticsPage = lazy(() => import('./pages/AnalyticsPage'));
const ProfilePage   = lazy(() => import('./pages/ProfilePage'));

function PageLoader() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', color: 'var(--t3)' }}>
      <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 14 }}>Loading…</div>
    </div>
  );
}

export default function App() {
  const theme    = useSelector((s) => s.media.theme);
  const dispatch = useDispatch();
  const [splashDone, setSplashDone] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('light', theme === 'light');
    document.body.classList.toggle('light', theme === 'light');
  }, [theme]);

  useEffect(() => {
    dispatch(fetchMovies());
  }, [dispatch]);

  // Show ONLY splash until it finishes
  if (!splashDone) {
    return (
      <ErrorBoundary>
        <SplashScreen onDone={() => setSplashDone(true)} />
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <div style={{
        width: '100%', minHeight: '100vh',
        background: 'var(--bg)', color: 'var(--t1)',
        display: 'flex', flexDirection: 'column',
        overflowX: 'hidden',
        animation: 'pgFade 0.5s ease forwards',
      }}>
        <Navbar />
        <main style={{ flex: 1, width: '100%', minWidth: 0 }}>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Public */}
              <Route path="/"        element={<AuthPage />} />
              <Route path="/signup"  element={<SignupPage />} />
              <Route path="/onboard" element={<ProtectedRoute><OnboardPage /></ProtectedRoute>} />

              {/* Protected */}
              <Route path="/home"             element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
              <Route path="/browse"           element={<ProtectedRoute><BrowsePage /></ProtectedRoute>} />
              <Route path="/detail/:type/:id" element={<ProtectedRoute><DetailPage /></ProtectedRoute>} />
              <Route path="/detail/:id"       element={<ProtectedRoute><DetailPage /></ProtectedRoute>} />
              <Route path="/player/:type/:id" element={<ProtectedRoute><PlayerPage /></ProtectedRoute>} />
              <Route path="/player/:id"       element={<ProtectedRoute><PlayerPage /></ProtectedRoute>} />
              <Route path="/activity"         element={<ProtectedRoute><AnalyticsPage /></ProtectedRoute>} />
              <Route path="/analytics"        element={<Navigate to="/activity" replace />} />
              <Route path="/profile"          element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </main>
        <footer style={{
          textAlign: 'center',
          padding: '24px',
          color: 'var(--t3)',
          fontSize: '14px',
          borderTop: '1px solid rgba(124, 58, 237, 0.1)'
        }}>
          &copy; {new Date().getFullYear()} Lumix. All rights reserved.
        </footer>
        <Toast />
      </div>
    </ErrorBoundary>
  );
}