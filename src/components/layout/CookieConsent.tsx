'use client';

import { useState, useEffect } from 'react';

export default function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('nf_cookie_consent');
    if (!consent) {
      setShow(true);
    }
  }, []);

  const accept = () => {
    localStorage.setItem('nf_cookie_consent', 'accepted');
    setShow(false);
  };

  const decline = () => {
    localStorage.setItem('nf_cookie_consent', 'declined');
    setShow(false);
  };

  if (!show) return null;

  return (
    <div
      className="fixed bottom-20 md:bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-[28rem] z-50 bg-zinc-900/95 backdrop-blur-xl border border-zinc-800 rounded-2xl p-5 shadow-2xl animate-slide-up"
      role="alert"
      aria-label="Cookie consent"
    >
      <p className="text-sm text-zinc-300 leading-relaxed">
        We use cookies and local storage to provide essential platform features including offline support, session management, and saved preferences.{' '}
        <a href="/privacy" className="text-red-400 underline hover:text-red-300">
          Learn more
        </a>
      </p>
      <div className="flex gap-3 mt-4">
        <button
          onClick={accept}
          className="flex-1 py-2.5 bg-red-600 text-white text-sm font-semibold rounded-xl hover:bg-red-500 transition-colors active:scale-[0.98]"
        >
          Accept All
        </button>
        <button
          onClick={decline}
          className="flex-1 py-2.5 bg-zinc-800 text-zinc-300 text-sm font-semibold rounded-xl hover:bg-zinc-700 transition-colors active:scale-[0.98]"
        >
          Essential Only
        </button>
      </div>
    </div>
  );
}
