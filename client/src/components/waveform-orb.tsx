import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface WaveformOrbProps {
  isActive: boolean;
  isSpeaking: boolean;
}

export function WaveformOrb({ isActive, isSpeaking }: WaveformOrbProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle high DPI displays
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;
    const centerX = width / 2;
    const centerY = height / 2;

    let animationId: number;
    let phase = 0;

    const draw = () => {
      ctx.clearRect(0, 0, width * dpr, height * dpr);

      const bars = 32;
      const maxBarHeight = isActive || isSpeaking ? 60 : 30;

      for (let i = 0; i < bars; i++) {
        const angle = (i / bars) * Math.PI * 2;
        const barHeight = Math.sin(phase + i * 0.5) * maxBarHeight * (isSpeaking ? 1.5 : 0.7) + maxBarHeight;
        
        const x1 = centerX + Math.cos(angle) * 50;
        const y1 = centerY + Math.sin(angle) * 50;
        const x2 = centerX + Math.cos(angle) * (50 + barHeight);
        const y2 = centerY + Math.sin(angle) * (50 + barHeight);

        const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
        gradient.addColorStop(0, 'rgba(34, 211, 238, 0.3)');
        gradient.addColorStop(1, 'rgba(34, 211, 238, 0.9)');

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }

      phase += 0.05;
      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [isActive, isSpeaking]);

  return (
    <div className="relative flex items-center justify-center" data-testid="waveform-orb">
      <motion.div
        className="absolute inset-0 rounded-full bg-primary/20 blur-3xl"
        animate={{
          scale: isActive || isSpeaking ? [1, 1.2, 1] : 1,
          opacity: isActive || isSpeaking ? [0.5, 0.8, 0.5] : 0.3,
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      <canvas
        ref={canvasRef}
        className="relative z-10 w-[300px] h-[300px]"
        data-testid="canvas-waveform"
      />

      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          className="w-24 h-24 rounded-full border-2 border-primary/50"
          animate={{
            scale: isActive || isSpeaking ? [1, 1.1, 1] : 1,
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>
    </div>
  );
}
