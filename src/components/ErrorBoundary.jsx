// src/components/ErrorBoundary.jsx
import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center flex-col gap-4" style={{ background: 'var(--bg)' }}>
          <div style={{ fontSize: 48 }}>⚠️</div>
          <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 24, fontWeight: 700, color: 'var(--t1)' }}>Something went wrong</div>
          <div style={{ fontSize: 13, color: 'var(--t3)' }}>{this.state.error?.message}</div>
          <button onClick={() => window.location.reload()} className="px-6 py-3 rounded-lg text-white text-sm font-semibold cursor-pointer" style={{ background: 'linear-gradient(135deg,#7C3AED,#5B21B6)', fontFamily: 'Syne, sans-serif', border: 'none' }}>
            Reload Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
