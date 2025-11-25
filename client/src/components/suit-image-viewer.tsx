import { motion } from 'framer-motion';
import { useState, useMemo } from 'react';

interface SuitImageViewerProps {
  suitName: string;
  markNumber: number;
  color: string;
}

// Mapping of mark numbers to generated image paths
const SUIT_IMAGE_MAP: Record<number, string> = {
  1: 'mark_i_suit_silver_bronze_armor.png',
  2: 'mark_ii_red_gold_sleek_armor.png',
  3: 'mark_iii_classic_red_gold_suit.png',
  4: 'mark_iv_enhanced_red_gold_suit.png',
  5: 'mark_v_compact_portable_suit.png',
  6: 'mark_vi_advanced_red_gold.png',
  7: 'mark_vii_battle_armor.png',
  8: 'mark_viii_refined_armor.png',
  41: 'mark_xli_bones_skeletal_suit.png',
  42: 'mark_xlii_modular_segments.png',
  43: 'mark_xliii_age_of_ultron.png',
  44: 'mark_xliv_hulkbuster_giant.png',
  47: 'mark_xlvii_civil_war_armor.png',
  50: 'mark_l_nanotech_armor.png',
  85: 'mark_lxxxv_final_suit.png',
};

export function SuitImageViewer({ suitName, markNumber, color }: SuitImageViewerProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  const imagePath = useMemo(() => {
    const imageName = SUIT_IMAGE_MAP[markNumber];
    if (imageName) {
      return `/generated_images/${imageName}`;
    }
    return null;
  }, [markNumber]);

  // Get suit color hex for glow effect
  const suitColorHex = useMemo(() => {
    if (color.includes('Gold') || color.includes('Yellow')) return '#FFD700';
    if (color.includes('Red')) return '#DC2626';
    if (color.includes('Silver') || color.includes('Blue')) return '#0EA5E9';
    if (color.includes('Black')) return '#1F2937';
    if (color.includes('Green')) return '#10B981';
    if (color.includes('Purple')) return '#A855F7';
    return '#0EA5E9';
  }, [color]);

  const glowVariants = {
    animate: {
      boxShadow: [
        `0 0 20px ${suitColorHex}44, inset 0 0 20px ${suitColorHex}22`,
        `0 0 40px ${suitColorHex}66, inset 0 0 30px ${suitColorHex}33`,
        `0 0 20px ${suitColorHex}44, inset 0 0 20px ${suitColorHex}22`,
      ],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  if (!imagePath) {
    return (
      <div className="w-full h-64 flex items-center justify-center rounded-lg bg-card/50 border border-primary/30">
        <p className="text-xs text-muted-foreground">Image not available</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-2">
      {/* Image Container with Glow Effect */}
      <motion.div
        className="relative w-full h-40 md:h-64 rounded-lg overflow-hidden border-2"
        style={{
          borderColor: suitColorHex,
          background: `linear-gradient(135deg, ${suitColorHex}11 0%, ${suitColorHex}05 100%)`,
        }}
        variants={glowVariants}
        animate="animate"
      >
        {/* Corner accents */}
        <div
          className="absolute top-0 left-0 w-2 h-2 rounded-full"
          style={{ backgroundColor: suitColorHex, opacity: 0.8 }}
        />
        <div
          className="absolute top-0 right-0 w-2 h-2 rounded-full"
          style={{ backgroundColor: suitColorHex, opacity: 0.8 }}
        />
        <div
          className="absolute bottom-0 left-0 w-2 h-2 rounded-full"
          style={{ backgroundColor: suitColorHex, opacity: 0.8 }}
        />
        <div
          className="absolute bottom-0 right-0 w-2 h-2 rounded-full"
          style={{ backgroundColor: suitColorHex, opacity: 0.8 }}
        />

        {/* Suit Image */}
        <motion.img
          src={imagePath}
          alt={suitName}
          className="w-full h-full object-cover"
          onLoad={() => setIsLoaded(true)}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: isLoaded ? 1 : 0, scale: 1 }}
          transition={{ duration: 0.3 }}
        />

        {/* Holographic overlay lines */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{
            backgroundPosition: ['0% 0%', '0% 100%'],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'linear',
          }}
          style={{
            backgroundImage: `linear-gradient(
              to bottom,
              transparent 0%,
              ${suitColorHex}22 20%,
              transparent 40%,
              transparent 60%,
              ${suitColorHex}22 80%,
              transparent 100%
            )`,
            backgroundSize: '100% 200%',
          }}
        />
      </motion.div>

      {/* Info Label */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <p className="text-xs font-mono" style={{ color: suitColorHex }}>
          {suitName}
        </p>
      </motion.div>
    </div>
  );
}
