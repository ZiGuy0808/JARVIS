import { useState, useEffect, useCallback, useRef } from 'react';

export function useJarvisVoice() {
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
    const synth = window.speechSynthesis;

    useEffect(() => {
        // Load voices
        const updateVoices = () => {
            setVoices(synth.getVoices());
        };

        updateVoices();
        if (synth.onvoiceschanged !== undefined) {
            synth.onvoiceschanged = updateVoices;
        }
    }, [synth]);

    const speak = useCallback((text: string) => {
        if (synth.speaking) {
            synth.cancel();
        }

        const utterance = new SpeechSynthesisUtterance(text);

        // Find a British male voice (Daniel is standard on Mac, otherwise look for GB/UK)
        const jarvisVoice = voices.find(v => v.name === 'Daniel') ||
            voices.find(v => v.lang.includes('en-GB') && v.name.includes('Male')) ||
            voices.find(v => v.lang.includes('en-GB'));

        if (jarvisVoice) {
            utterance.voice = jarvisVoice;
        }

        // Jarvis characteristics: precise, slightly slower, slightly lower pitch
        utterance.rate = 0.9;
        utterance.pitch = 0.9;
        utterance.volume = 1.0;

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);

        synth.speak(utterance);
    }, [voices, synth]);

    const stop = useCallback(() => {
        if (synth.speaking) {
            synth.cancel();
            setIsSpeaking(false);
        }
    }, [synth]);

    return { speak, stop, isSpeaking };
}
