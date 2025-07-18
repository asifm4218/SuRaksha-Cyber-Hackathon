
"use client";

import { useState, useEffect, useRef, useCallback } from 'react';

interface UseIdleOptions {
  onIdle: () => void;
  idleTime: number; // in seconds
}

export function useIdle({ onIdle, idleTime }: UseIdleOptions) {
  const timeoutRef = useRef<NodeJS.Timeout>();

  const resetTimer = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(onIdle, idleTime * 1000);
  }, [onIdle, idleTime]);

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
  }, [resetTimer]);

  return { reset: resetTimer };
}
