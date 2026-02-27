"use client";

import { useCallback, useRef } from "react";

function createBeep(frequency: number, duration: number, type: OscillatorType = "sine") {
  const audioCtx = new AudioContext();
  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime);
  gainNode.gain.setValueAtTime(0.15, audioCtx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

  oscillator.start(audioCtx.currentTime);
  oscillator.stop(audioCtx.currentTime + duration);
}

export function useScanSound() {
  const lastPlayed = useRef(0);

  const playSuccess = useCallback(() => {
    const now = Date.now();
    if (now - lastPlayed.current < 200) return;
    lastPlayed.current = now;
    try {
      createBeep(880, 0.15, "sine");
      setTimeout(() => createBeep(1320, 0.15, "sine"), 80);
    } catch {
      // AudioContext not available
    }
  }, []);

  const playError = useCallback(() => {
    const now = Date.now();
    if (now - lastPlayed.current < 200) return;
    lastPlayed.current = now;
    try {
      createBeep(200, 0.3, "sawtooth");
    } catch {
      // AudioContext not available
    }
  }, []);

  const playNotification = useCallback(() => {
    try {
      createBeep(660, 0.1, "sine");
      setTimeout(() => createBeep(880, 0.12, "sine"), 100);
      setTimeout(() => createBeep(1100, 0.15, "sine"), 200);
    } catch {
      // AudioContext not available
    }
  }, []);

  return { playSuccess, playError, playNotification };
}
