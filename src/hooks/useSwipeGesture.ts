// ─── useSwipeGesture Hook ───────────────────────────────────
// Touch-friendly swipe detection for mobile interactions

'use client';

import { useRef, useCallback, useEffect } from 'react';

interface SwipeHandlers {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
}

interface SwipeConfig {
  threshold?: number;    // Minimum distance in px
  timeout?: number;      // Max time in ms for a swipe
  preventDefault?: boolean;
}

const DEFAULT_CONFIG: Required<SwipeConfig> = {
  threshold: 50,
  timeout: 300,
  preventDefault: false,
};

export function useSwipeGesture(
  handlers: SwipeHandlers,
  config?: SwipeConfig
) {
  const { threshold, timeout, preventDefault } = { ...DEFAULT_CONFIG, ...config };
  const startRef = useRef<{ x: number; y: number; time: number } | null>(null);

  const onTouchStart = useCallback(
    (e: TouchEvent) => {
      const touch = e.touches[0];
      startRef.current = { x: touch.clientX, y: touch.clientY, time: Date.now() };
    },
    []
  );

  const onTouchEnd = useCallback(
    (e: TouchEvent) => {
      if (!startRef.current) return;

      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - startRef.current.x;
      const deltaY = touch.clientY - startRef.current.y;
      const elapsed = Date.now() - startRef.current.time;

      startRef.current = null;

      if (elapsed > timeout) return;

      const absX = Math.abs(deltaX);
      const absY = Math.abs(deltaY);

      if (absX < threshold && absY < threshold) return;

      if (preventDefault) {
        e.preventDefault();
      }

      if (absX > absY) {
        // Horizontal swipe
        if (deltaX > 0) handlers.onSwipeRight?.();
        else handlers.onSwipeLeft?.();
      } else {
        // Vertical swipe
        if (deltaY > 0) handlers.onSwipeDown?.();
        else handlers.onSwipeUp?.();
      }
    },
    [handlers, threshold, timeout, preventDefault]
  );

  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    el.addEventListener('touchstart', onTouchStart, { passive: true });
    el.addEventListener('touchend', onTouchEnd, { passive: !preventDefault });

    return () => {
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchend', onTouchEnd);
    };
  }, [onTouchStart, onTouchEnd, preventDefault]);

  return ref;
}
