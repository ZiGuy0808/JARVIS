import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { SuitImageViewer } from '@/components/suit-image-viewer';
import { TypewriterText } from '@/components/typewriter-text';
import { motion } from 'framer-motion';
import { ChevronRight, Zap, Shield, Cpu, Target, Flame, Layers, X } from 'lucide-react';

interface IronManSuit {
  name: string;
  markNumber: number;
  filmIntroduced: string;
  yearsActive: string[];
  color: string;
  specialization: string;
  technicalSpecs: {
    armor: string;
    power: string;
    capabilities: string[];
  };
  keyUsages: string[];
  weaknesses?: string;
  upgrades?: string;
  status: 'Active' | 'Retired' | 'Destroyed' | 'Upgraded';
  notableMoments: string[];
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const headerVariants = {
  hidden: { opacity: 0, y: -30, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: 'easeOut' } },
};

export function BlueprintViewer() {
  const [selectedMark, setSelectedMark] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const { data: allSuits, isLoading: suitsLoading } = useQuery({
    queryKey: ['/api/blueprints/all'],
  }) as any;

  const { data: selectedSuit, isLoading: isSuitLoading, isFetching: isSuitFetching } = useQuery({
    queryKey: ['/api/blueprints/mark', selectedMark],
    enabled: selectedMark !== null,
  }) as any;

  const { data: searchResults } = useQuery({
    queryKey: ['/api/blueprints/search', searchQuery],
    enabled: searchQuery.length > 0,
  }) as any;

  const suits: IronManSuit[] = searchQuery ? searchResults?.results : allSuits?.suits || [];
  const suit: IronManSuit | undefined = selectedSuit?.suit;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-500/20 text-green-600 dark:text-green-400';
      case 'Retired':
        return 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400';
      case 'Destroyed':
        return 'bg-red-500/20 text-red-600 dark:text-red-400';
      case 'Upgraded':
        return 'bg-blue-500/20 text-blue-600 dark:text-blue-400';
      default:
        return 'bg-gray-500/20 text-gray-600 dark:text-gray-400';
    }
  };

  const getSuitColorHex = (color: string) => {
    if (color.includes('Gold') || color.includes('Yellow')) return '#FFD700';
    if (color.includes('Red')) return '#DC2626';
    if (color.includes('Silver') || color.includes('Blue')) return '#0EA5E9';
    if (color.includes('Black')) return '#1F2937';
    if (color.includes('Green')) return '#10B981';
    if (color.includes('Purple')) return '#A855F7';
    return '#0EA5E9';
  };

  const glowColor = suit ? getSuitColorHex(suit.color) : '#0EA5E9';

  return (
    <div className="w-full h-full flex flex-col gap-2 md:gap-4 p-2 md:p-4 bg-gradient-to-b from-background to-background/80">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-1"
      >
        <div>
          <h2 className="text-lg md:text-2xl font-bold text-foreground">Iron Man Gallery</h2>
          <p className="text-xs md:text-sm text-muted-foreground">{suits.length} Suits</p>
        </div>
      </motion.div>

      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex gap-2"
      >
        <Input
          placeholder="Search suits..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 text-xs md:text-sm"
          data-testid="input-blueprint-search"
        />
      </motion.div>

      {/* Two Panel Layout - Responsive */}
      <div className="flex-1 flex flex-col md:flex-row gap-2 md:gap-4 overflow-hidden min-h-0">
        {/* Left: 3D Grid of All Suits */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex-1 md:flex-1 overflow-y-auto border rounded-lg bg-card/30 backdrop-blur p-2 md:p-4"
        >
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-4">
            {suits.map((s: IronManSuit, idx: number) => (
              <motion.div
                key={s.markNumber}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => setSelectedMark(s.markNumber)}
                className={`cursor-pointer rounded-lg border-2 transition-all hover-elevate ${selectedMark === s.markNumber
                    ? 'border-cyan-500/80 bg-cyan-500/10 shadow-lg shadow-cyan-500/20'
                    : 'border-primary/30 hover:border-primary/60'
                  }`}
                data-testid={`suit-card-3d-${s.markNumber}`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Suit Image Container */}
                <div className="p-2">
                  <SuitImageViewer
                    suitName={s.name}
                    color={s.color}
                    markNumber={s.markNumber}
                  />
                </div>

                {/* Suit Info Below */}
                <div className="px-2 md:px-3 pb-2 md:pb-3 text-center border-t border-primary/20 pt-1 md:pt-2">
                  <h3 className="font-rajdhani font-bold text-xs truncate">{s.name}</h3>
                  <p className="text-xs text-muted-foreground text-[0.65rem]">{s.filmIntroduced}</p>
                  <div className="mt-1 md:mt-2 flex justify-center">
                    <Badge
                      className={`text-xs ${getStatusColor(s.status)}`}
                      data-testid={`badge-suit-status-${s.status}`}
                    >
                      {s.status}
                    </Badge>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {suits.length === 0 && (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <p>No suits found</p>
            </div>
          )}
        </motion.div>

        {/* Right: Detailed View - Desktop only */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="hidden md:flex md:flex-col md:w-96 overflow-y-auto border rounded-lg bg-card/30 backdrop-blur"
        >
          <SuitDetailsContent
            suit={suit}
            isSuitLoading={isSuitLoading}
            isSuitFetching={isSuitFetching}
            getStatusColor={getStatusColor}
            glowColor={glowColor}
            selectedMark={selectedMark}
          />
        </motion.div>
      </div>

      {/* Mobile: Suit Details Modal */}
      <Dialog open={selectedMark !== null} onOpenChange={(open) => !open && setSelectedMark(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto max-w-2xl">
          <DialogHeader className="sticky top-0 z-10 bg-background/95 pb-4">
            <DialogTitle className="text-2xl">Suit Details</DialogTitle>
          </DialogHeader>
          <SuitDetailsContent
            suit={suit}
            isSuitLoading={isSuitLoading}
            isSuitFetching={isSuitFetching}
            getStatusColor={getStatusColor}
            glowColor={glowColor}
            selectedMark={selectedMark}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

function SuitDetailsContent({ suit, isSuitLoading, isSuitFetching, getStatusColor, glowColor, selectedMark }: any) {
  // If we have a selected mark but no suit yet, we are loading (or failed).
  // This prevents the "Select a suit" screen from showing while fetching.
  const isLoading = isSuitLoading || isSuitFetching || (selectedMark !== null && !suit);

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="m-4 h-96 flex items-center justify-center rounded-lg bg-gradient-to-br from-primary/10 to-transparent border border-primary/30"
      >
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          >
            <Cpu className="w-12 h-12 mx-auto mb-2 text-primary" />
          </motion.div>
          <p className="text-muted-foreground">Initializing blueprint scan...</p>
        </div>
      </motion.div>
    );
  }

  if (suit) {
    return (
      <motion.div
        className="p-4 space-y-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Holographic Header */}
        <motion.div variants={headerVariants} className="relative">
          <div
            className="absolute inset-0 rounded-lg blur-lg opacity-20"
            style={{ backgroundColor: glowColor }}
          />
          <Card className="relative bg-gradient-to-br from-primary/20 via-primary/5 to-transparent border-2 border-primary/50 shadow-lg overflow-hidden">
            <motion.div
              className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r"
              style={{ backgroundImage: `linear-gradient(to right, transparent, ${glowColor}, transparent)` }}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            <CardHeader className="pb-4">
              <motion.div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <CardTitle className="text-3xl font-orbitron bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                      <TypewriterText text={suit.name} speed={30} />
                    </CardTitle>
                    <CardTitle className="text-sm mt-2 font-rajdhani text-muted-foreground">
                      <TypewriterText text={suit.specialization} speed={30} />
                    </CardTitle>
                  </motion.div>
                </div>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.3 }}
                >
                  <Badge className={getStatusColor(suit.status)}>{suit.status}</Badge>
                </motion.div>
              </motion.div>
            </CardHeader>
            <CardContent>
              <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-primary/10 rounded-lg border border-primary/30">
                  <p className="text-xs font-semibold text-muted-foreground mb-1">Film Debut</p>
                  <p className="font-bold text-sm">
                    <TypewriterText text={suit.filmIntroduced} speed={30} />
                  </p>
                </div>
                <div className="p-3 bg-primary/10 rounded-lg border border-primary/30">
                  <p className="text-xs font-semibold text-muted-foreground mb-1">Color</p>
                  <div className="flex items-center gap-2 mt-1">
                    <motion.div
                      className="w-5 h-5 rounded-full border-2 border-primary shadow-lg"
                      style={{ backgroundColor: suit.color === 'Red and Gold' ? '#DC2626' : '#999' }}
                      animate={{ boxShadow: [`0 0 10px ${glowColor}44`, `0 0 20px ${glowColor}88`, `0 0 10px ${glowColor}44`] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <span className="text-xs font-medium">
                      <TypewriterText text={suit.color} speed={30} />
                    </span>
                  </div>
                </div>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Technical Specs */}
        <motion.div variants={itemVariants}>
          <Card className="bg-gradient-to-br from-blue-500/10 to-transparent border-blue-500/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}>
                  <Zap className="w-4 h-4 text-blue-500" />
                </motion.div>
                Specifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="font-semibold text-muted-foreground mb-1 text-xs">Armor Material</p>
                <p className="text-sm bg-blue-500/10 px-2 py-1 rounded border border-blue-500/30">
                  <TypewriterText text={suit.technicalSpecs.armor} speed={20} />
                </p>
              </div>
              <div>
                <p className="font-semibold text-muted-foreground mb-1 text-xs">Power Source</p>
                <p className="text-sm bg-blue-500/10 px-2 py-1 rounded border border-blue-500/30">
                  <TypewriterText text={suit.technicalSpecs.power} speed={20} />
                </p>
              </div>
              <div>
                <p className="font-semibold text-muted-foreground mb-2 text-xs">Capabilities</p>
                <div className="flex flex-wrap gap-1">
                  {suit.technicalSpecs.capabilities.map((cap: string, i: number) => (
                    <motion.div
                      key={cap}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.6 + i * 0.05 }}
                    >
                      <Badge variant="secondary" className="text-xs bg-blue-500/20 text-blue-600 dark:text-blue-400">
                        {cap}
                      </Badge>
                    </motion.div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Combat Info */}
        <motion.div variants={itemVariants}>
          <Card className="bg-gradient-to-br from-red-500/10 to-transparent border-red-500/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Shield className="w-4 h-4 text-red-500" />
                Combat Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="font-semibold text-muted-foreground mb-2 text-xs flex items-center gap-1">
                  <Target className="w-3 h-3 text-red-500" />
                  Key Usages
                </p>
                <ul className="space-y-1">
                  {suit.keyUsages.map((usage: string, i: number) => (
                    <motion.li
                      key={i}
                      className="flex gap-2 text-xs p-2 rounded bg-red-500/5 border border-red-500/20"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 + i * 0.08 }}
                    >
                      <span className="text-red-500 font-bold">{i + 1}.</span>
                      <span>{usage}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
              {suit.weaknesses && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="p-2 rounded bg-orange-500/10 border border-orange-500/30"
                >
                  <p className="font-semibold text-orange-600 dark:text-orange-400 text-xs mb-1 flex items-center gap-1">
                    <Flame className="w-3 h-3" />
                    Weaknesses
                  </p>
                  <p className="text-xs text-orange-600 dark:text-orange-400">
                    <TypewriterText text={suit.weaknesses} speed={20} />
                  </p>
                </motion.div>
              )}
              {suit.upgrades && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9 }}
                  className="p-2 rounded bg-green-500/10 border border-green-500/30"
                >
                  <p className="font-semibold text-green-600 dark:text-green-400 text-xs mb-1">Upgrades</p>
                  <p className="text-xs text-green-600 dark:text-green-400">
                    <TypewriterText text={suit.upgrades} speed={20} />
                  </p>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Notable Moments */}
        <motion.div variants={itemVariants}>
          <Card className="bg-gradient-to-br from-purple-500/10 to-transparent border-purple-500/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Layers className="w-4 h-4 text-purple-500" />
                Notable Moments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {suit.notableMoments.map((moment: string, i: number) => (
                  <motion.li
                    key={i}
                    className="flex gap-2 text-xs p-2 rounded bg-purple-500/5 border border-purple-500/20"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1 + i * 0.1 }}
                    whileHover={{ x: 4, backgroundColor: 'rgba(168, 85, 247, 0.15)' }}
                  >
                    <span className="text-purple-500 font-bold flex-shrink-0">{i + 1}.</span>
                    <span>{moment}</span>
                  </motion.li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    );
  }

  // Fallback: This only renders if selectedMark IS null (i.e. nothing selected)
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center justify-center h-full text-muted-foreground"
    >
      <p className="text-sm">Select a suit to view details</p>
    </motion.div>
  );
}
