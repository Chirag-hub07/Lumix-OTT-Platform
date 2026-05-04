// src/store/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const STORAGE_KEY = 'lumix_users';

// Built-in demo account
const DEMO_USER = {
  name: 'Aditya Kumar',
  email: 'aditya@lumix.com',
  password: 'lumix123',
  initials: 'AK',
};

function getStoredUsers() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [DEMO_USER];
  } catch {
    return [DEMO_USER];
  }
}

function saveUser(user) {
  try {
    const users = getStoredUsers();
    const exists = users.find((u) => u.email.toLowerCase() === user.email.toLowerCase());
    if (!exists) {
      users.push(user);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    }
  } catch { /* localStorage not available */ }
}

const SESSION_KEY = 'lumix_session';

function getSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

const session = getSession();

const initialState = {
  isLoggedIn: !!session,
  user: session ? session.user : null,
  onboarded: session ? session.onboarded : false,
  loginError: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      state.isLoggedIn = true;
      state.loginError = null;
      state.user = action.payload;
      try {
        localStorage.setItem(SESSION_KEY, JSON.stringify({ user: state.user, onboarded: state.onboarded }));
      } catch {}
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.user = null;
      state.onboarded = false;
      state.loginError = null;
      try {
        localStorage.removeItem(SESSION_KEY);
      } catch {}
    },
    completeOnboarding: (state) => {
      state.onboarded = true;
      try {
        const raw = localStorage.getItem(SESSION_KEY);
        const session = raw ? JSON.parse(raw) : {};
        session.onboarded = true;
        localStorage.setItem(SESSION_KEY, JSON.stringify(session));
      } catch {}
    },
    setLoginError: (state, action) => {
      state.loginError = action.payload;
    },
    clearLoginError: (state) => {
      state.loginError = null;
    },
  },
});

export const { login, logout, completeOnboarding, setLoginError, clearLoginError } = authSlice.actions;

// Thunk: login — checks against all stored users including demo
export const attemptLogin = (email, password) => (dispatch) => {
  if (!email || !password) {
    dispatch(setLoginError('Please fill in all fields'));
    return false;
  }
  if (password.length < 6) {
    dispatch(setLoginError('Password must be at least 6 characters'));
    return false;
  }

  const users = getStoredUsers();
  const match = users.find(
    (u) =>
      u.email.toLowerCase() === email.trim().toLowerCase() &&
      u.password === password
  );

  if (!match) {
    dispatch(setLoginError('Incorrect email or password'));
    return false;
  }

  dispatch(login({
    name: match.name,
    email: match.email,
    initials: match.initials,
  }));
  return true;
};

// Thunk: signup — validates, persists to localStorage, then logs in
export const attemptSignup = (name, email, password) => (dispatch) => {
  const errors = {};
  if (!name.trim()) errors.name = 'Name is required';
  if (!email.includes('@') || !email.includes('.')) errors.email = 'Valid email required';
  if (password.length < 8) errors.password = 'Minimum 8 characters';
  if (Object.keys(errors).length) return errors;

  const users = getStoredUsers();
  const exists = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
  if (exists) return { email: 'An account with this email already exists' };

  const initials = name.trim().split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
  const newUser = { name: name.trim(), email: email.trim().toLowerCase(), password, initials };

  saveUser(newUser);

  dispatch(login({ name: newUser.name, email: newUser.email, initials: newUser.initials }));
  return {};
};

export default authSlice.reducer;