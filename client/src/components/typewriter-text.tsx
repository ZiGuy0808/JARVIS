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
    console.log('📝 Text changed, resetting typewriter:', text.substring(0, 50));
    setDisplayedText('');
    setCurrentIndex(0);
    setHasCompleted(false);
  }, [text]);

  // Main typing effect
  useEffect(() => {
    if (!text || hasCompleted) return;
    
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);

      return () => clearTimeout(timeout);
    } else if (currentIndex === text.length && text.length > 0 && !hasCompleted) {
      console.log('✍️ Typing complete, calling onComplete:', text.substring(0, 50));
      setHasCompleted(true);
      if (onComplete) {
        onComplete();
      }
    }
  }, [currentIndex, text, speed, onComplete, hasCompleted]);

  return <span className={className}>{displayedText}</span>;
}
