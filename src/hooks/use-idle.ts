
"use client";

import { useState, useEffect, useRef } from 'react';

interface UseIdleOptions {
  onIdle: () => void;
  idleTime: number; // in seconds
}

export function useIdle({ onIdle, idleTime }: UseIdleOptions) {
  const timeoutRef = useRef<NodeJS.Timeout>();

  const resetTimer = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(onIdle, idleTime * 1000);
  };

  useEffect(() => {
    const events = ['mousemove', 'keydown', 'touchstart', 'scroll'];

    const handleEvent = () => {
      resetTimer();
    };

    events.forEach(event => {
      window.addEventListener(event, handleEvent);
    });

    resetTimer(); // Start the timer on mount

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      events.forEach(event => {
        window.removeEventListener(event, handleEvent);
      });
    };
  }, [onIdle, idleTime]);

  return {};
}
