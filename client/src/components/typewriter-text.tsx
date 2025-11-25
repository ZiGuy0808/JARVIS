import { useEffect, useState } from 'react';

interface TypewriterTextProps {
  text: string;
  speed?: number;
  onComplete?: () => void;
  className?: string;
}

export function TypewriterText({ text = '', speed = 30, onComplete, className = '' }: TypewriterTextProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hasCompleted, setHasCompleted] = useState(false);

  // Reset when text changes
  useEffect(() => {
    console.log('[TYPEWRITER DEBUG] Text changed, resetting typewriter:', text.substring(0, 50), 'Length:', text.length);
    setDisplayedText('');
    setCurrentIndex(0);
    setHasCompleted(false);
  }, [text]);

  // Main typing effect
  useEffect(() => {
    if (!text || hasCompleted) {
      if (hasCompleted) console.log('[TYPEWRITER DEBUG] Skipping - already completed');
      if (!text) console.log('[TYPEWRITER DEBUG] Skipping - no text');
      return;
    }
    
    if (currentIndex < text.length) {
      console.log('[TYPEWRITER DEBUG] Typing character', currentIndex, 'of', text.length, ':', text[currentIndex]);
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);

      return () => clearTimeout(timeout);
    } else if (currentIndex === text.length && text.length > 0 && !hasCompleted) {
      console.log('[TYPEWRITER DEBUG] TYPING FINISHED! Calling onComplete. Text:', text.substring(0, 50));
      setHasCompleted(true);
      if (onComplete) {
        console.log('[TYPEWRITER DEBUG] Calling onComplete callback');
        onComplete();
      } else {
        console.warn('[TYPEWRITER DEBUG] WARNING - onComplete callback is undefined!');
      }
    }
  }, [currentIndex, text, speed, onComplete, hasCompleted]);

  return <span className={className}>{displayedText}</span>;
}
