// src/hooks/useToast.js
import { useDispatch } from 'react-redux';
import { showToast, hideToast } from '../store/toastSlice';

export function useToast() {
  const dispatch = useDispatch();
  return (message, color = '#10B981') => {
    dispatch(showToast({ message, color }));
    setTimeout(() => dispatch(hideToast()), 2600);
  };
}

// src/hooks/useDebounce.js — inline for simplicity
export function useDebounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}
