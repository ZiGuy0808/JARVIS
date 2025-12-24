import { useCallback } from 'react';
import useSound from 'use-sound';

// Since we might not have actual assets effectively yet, we'll create a synth-based fallback or just placeholders.
// Ideally usage: const { playAck, playTyping } = useJarvisSound();
// For now, we'll implement a simple oscillator-based "beep" if files aren't found, 
// OR we can rely on standard HTML5 Audio with data URIs for simple beeps.

// Simple beep generator (no external files needed)
const playBeep = (freq = 440, type: OscillatorType = 'sine', duration = 0.1) => {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.type = type;
    oscillator.frequency.value = freq;

    gainNode.gain.value = 0.1;

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.start();
    setTimeout(() => {
        oscillator.stop();
    }, duration * 1000);
};

export function useJarvisSound() {

    const playStartup = useCallback(() => {
        // "Power up" sound - rising pitch
        playBeep(200, 'sawtooth', 0.1);
        setTimeout(() => playBeep(400, 'sawtooth', 0.1), 100);
        setTimeout(() => playBeep(800, 'sawtooth', 0.2), 200);
    }, []);

    const playAck = useCallback(() => {
        // "Acknowledged" - soft high chirp
        playBeep(1200, 'sine', 0.05);
    }, []);

    const playProcess = useCallback(() => {
        // "Thinking" - rapid low clicks
        playBeep(100, 'square', 0.03);
        setTimeout(() => playBeep(100, 'square', 0.03), 50);
        setTimeout(() => playBeep(100, 'square', 0.03), 100);
    }, []);

    const playError = useCallback(() => {
        // "Error" - low buzz
        playBeep(150, 'sawtooth', 0.3);
    }, []);

    return { playStartup, playAck, playProcess, playError };
}
