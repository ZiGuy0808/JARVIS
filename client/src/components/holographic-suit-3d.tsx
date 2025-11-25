import { motion } from 'framer-motion';
import { useMemo } from 'react';

interface HolographicSuit3DProps {
  suitName: string;
  color: string;
  markNumber: number;
}

export function HolographicSuit3D({ suitName, color, markNumber }: HolographicSuit3DProps) {
  const containerVariants = {
    animate: {
      rotateY: 360,
      transition: {
        duration: 20,
        repeat: Infinity,
        ease: 'linear',
      },
    },
  };

  const glowVariants = {
    animate: {
      opacity: [0.5, 1, 0.5],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  // Get suit color hex
  const suitColorHex = useMemo(() => {
    if (color.includes('Gold') || color.includes('Yellow')) return '#FFD700';
    if (color.includes('Red')) return '#DC2626';
    if (color.includes('Silver') || color.includes('Blue')) return '#0EA5E9';
    if (color.includes('Black')) return '#1F2937';
    if (color.includes('Green')) return '#10B981';
    if (color.includes('Purple')) return '#A855F7';
    return '#0EA5E9';
  }, [color]);

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-8">
      {/* 3D Holographic Container */}
      <motion.div
        className="perspective w-full max-w-xs h-80"
        style={{ perspective: '1000px' }}
      >
        <motion.div
          className="relative w-full h-full"
          variants={containerVariants}
          animate="animate"
          style={{
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Suit Visual Representation */}
          <div
            className="absolute inset-0 flex items-center justify-center rounded-lg"
            style={{
              background: `linear-gradient(135deg, ${suitColorHex}33 0%, ${suitColorHex}11 100%)`,
              border: `2px solid ${suitColorHex}88`,
              boxShadow: `
                0 0 20px ${suitColorHex}44,
                inset 0 0 20px ${suitColorHex}22,
                0 0 40px ${suitColorHex}22
              `,
              backfaceVisibility: 'hidden',
            }}
          >
            {/* Inner glow */}
            <motion.div
              className="absolute inset-2 rounded-lg opacity-50"
              style={{
                background: `radial-gradient(ellipse at center, ${suitColorHex}44 0%, transparent 70%)`,
              }}
              variants={glowVariants}
              animate="animate"
            />

            {/* Suit silhouette representation */}
            <div className="relative z-10 text-center">
              <div
                className="text-6xl font-bold font-orbitron mb-2"
                style={{ color: suitColorHex, textShadow: `0 0 10px ${suitColorHex}` }}
              >
                Ⅿ
              </div>
              <div className="text-sm font-rajdhani tracking-wider" style={{ color: suitColorHex }}>
                MARK {markNumber}
              </div>
            </div>

            {/* Rotating ring effect */}
            <motion.div
              className="absolute inset-0 rounded-lg"
              style={{
                border: `1px solid ${suitColorHex}44`,
                boxShadow: `inset 0 0 10px ${suitColorHex}33`,
              }}
              animate={{
                borderColor: [
                  `${suitColorHex}44`,
                  `${suitColorHex}88`,
                  `${suitColorHex}44`,
                ],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
              }}
            />
          </div>

          {/* Front face (mirror image for 3D effect) */}
          <div
            className="absolute inset-0 flex items-center justify-center rounded-lg opacity-40"
            style={{
              background: `linear-gradient(135deg, ${suitColorHex}22 0%, ${suitColorHex}00 100%)`,
              border: `1px solid ${suitColorHex}44`,
              transform: 'rotateY(180deg)',
              backfaceVisibility: 'hidden',
            }}
          />
        </motion.div>
      </motion.div>

      {/* HUD Info Panel */}
      <motion.div
        className="w-full max-w-xs p-4 rounded-lg border backdrop-blur-sm"
        style={{
          borderColor: suitColorHex,
          background: `${suitColorHex}11`,
          boxShadow: `0 0 20px ${suitColorHex}22`,
        }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="space-y-2 text-center">
          <h3 className="font-rajdhani font-bold text-lg" style={{ color: suitColorHex }}>
            {suitName}
          </h3>
          <p className="text-xs font-mono opacity-70">HOLOGRAPHIC PROJECTION ACTIVE</p>
          
          {/* Scan lines effect */}
          <div className="flex justify-center gap-1 my-3">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-1 h-8 rounded-full"
                style={{ backgroundColor: suitColorHex, opacity: 0.6 }}
                animate={{
                  scaleY: [1, 1.5, 1],
                  opacity: [0.3, 1, 0.3],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>

          <p className="text-xs opacity-60 font-mono">Rotating in 3D space</p>
        </div>
      </motion.div>
    </div>
  );
}
