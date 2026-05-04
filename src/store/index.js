// src/store/index.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import mediaReducer from './mediaSlice';
import toastReducer from './toastSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    media: mediaReducer,
    toast: toastReducer,
  },
});

export default store;
