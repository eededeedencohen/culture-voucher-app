import { useCallback, useRef } from 'react';

const AudioCtx = window.AudioContext || window.webkitAudioContext;

export function useAudio() {
  const ctxRef = useRef(null);

  const getCtx = () => {
    if (!ctxRef.current) ctxRef.current = new AudioCtx();
    return ctxRef.current;
  };

  const playTone = useCallback((frequency, duration = 0.15, type = 'sine') => {
    try {
      const ctx = getCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      // audio not available
    }
  }, []);

  const playSuccess = useCallback(() => {
    playTone(880, 0.1);
    setTimeout(() => playTone(1108, 0.1), 100);
    setTimeout(() => playTone(1320, 0.2), 200);
  }, [playTone]);

  const playError = useCallback(() => {
    playTone(330, 0.2, 'square');
    setTimeout(() => playTone(220, 0.3, 'square'), 200);
  }, [playTone]);

  const playScan = useCallback(() => {
    playTone(1200, 0.08);
  }, [playTone]);

  return { playSuccess, playError, playScan };
}
