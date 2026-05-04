// src/store/toastSlice.js
import { createSlice } from '@reduxjs/toolkit';

const toastSlice = createSlice({
  name: 'toast',
  initialState: { message: '', color: '#10B981', visible: false },
  reducers: {
    showToast: (state, action) => {
      state.message = action.payload.message;
      state.color = action.payload.color || '#10B981';
      state.visible = true;
    },
    hideToast: (state) => {
      state.visible = false;
    },
  },
});

export const { showToast, hideToast } = toastSlice.actions;
export default toastSlice.reducer;
