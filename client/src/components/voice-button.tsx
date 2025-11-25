import { Mic, MicOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface VoiceButtonProps {
  isRecording: boolean;
  onToggle: () => void;
  disabled?: boolean;
}

export function VoiceButton({ isRecording, onToggle, disabled }: VoiceButtonProps) {
  return (
    <div className="relative flex items-center justify-center">
      {isRecording && (
        <>
          <motion.div
            className="absolute w-20 h-20 rounded-full border-2 border-primary/30"
            animate={{
              scale: [1, 1.5],
              opacity: [0.5, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeOut",
            }}
          />
          <motion.div
            className="absolute w-20 h-20 rounded-full border-2 border-primary/30"
            animate={{
              scale: [1, 1.5],
              opacity: [0.5, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeOut",
              delay: 0.5,
            }}
          />
        </>
      )}

      <Button
        size="icon"
        onClick={onToggle}
        disabled={disabled}
        className={`relative z-10 w-16 h-16 rounded-full ${
          isRecording
            ? 'bg-primary hover:bg-primary/90 animate-pulse-glow'
            : 'bg-primary/20 hover:bg-primary/30 border border-primary/50'
        }`}
        data-testid={isRecording ? "button-stop-recording" : "button-start-recording"}
      >
        {isRecording ? (
          <MicOff className="w-7 h-7 text-primary-foreground" />
        ) : (
          <Mic className="w-7 h-7 text-primary" />
        )}
      </Button>
    </div>
  );
}
