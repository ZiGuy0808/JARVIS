import { useState } from 'react';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, X, Shield, Zap, Target, Cpu, Flame } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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

// Jarvis commentary for suits
const JARVIS_SUIT_COMMENTARY: Record<number, string> = {
    1: "The Mark I, sir. Built in a cave, with a box of scraps. Remarkable ingenuity under duress.",
    2: "The Mark II prototype. I recall the altitude test... the icing problem was rather inconvenient.",
    3: "The Mark III. Sir's first true masterpiece. Gold-titanium alloy - I suggested the color scheme.",
    5: "The Suitcase Armor. Portable, efficient, and I must say, rather stylish for emergencies.",
    7: "The Mark VII. Battle of New York. Sir flew a nuclear missile through a wormhole. I was... concerned.",
    42: "The Mark XLII. Modular design, autonomous assembly. Sir was going through a creative phase.",
    44: "The Hulkbuster, codenamed 'Veronica'. Designed specifically for... managing Dr. Banner.",
    50: "The Mark L. Nanotechnology integration. Sir called it 'bleeding edge'. I find the name rather literal.",
    85: "The Mark LXXXV. Sir's final armor. Capable of channeling the Infinity Stones. His greatest work."
};

const getDefaultCommentary = (suit: IronManSuit) => {
    return `The ${suit.name}. ${suit.specialization}. First deployed in ${suit.filmIntroduced}. Current status: ${suit.status}.`;
};

export default function SuitsPage() {
    const [, navigate] = useLocation();
    const [selectedSuit, setSelectedSuit] = useState<IronManSuit | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const { data: suitsData, isLoading } = useQuery<{ suits: IronManSuit[]; count: number }>({
        queryKey: ['all-suits'],
        queryFn: async () => {
            const res = await fetch('/api/blueprints/all');
            return res.json();
        },
    });

    const suits = suitsData?.suits || [];

    const getSuitColorHex = (color: string) => {
        if (color.includes('Gold') || color.includes('Yellow')) return '#FFD700';
        if (color.includes('Red')) return '#DC2626';
        if (color.includes('Silver')) return '#94A3B8';
        if (color.includes('Blue')) return '#0EA5E9';
        if (color.includes('Black')) return '#1F2937';
        if (color.includes('Green')) return '#10B981';
        if (color.includes('Orange')) return '#F97316';
        return '#0EA5E9';
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Active': return 'bg-green-500/20 text-green-400 border-green-500/50';
            case 'Retired': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
            case 'Destroyed': return 'bg-red-500/20 text-red-400 border-red-500/50';
            case 'Upgraded': return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
            default: return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
        }
    };

    const openSuitModal = (suit: IronManSuit) => {
        setIsAnalyzing(true);
        setSelectedSuit(suit);
        // Simulate Jarvis analyzing
        setTimeout(() => setIsAnalyzing(false), 1500);
    };

    return (
        <div className="w-full min-h-screen bg-gradient-to-b from-background to-background/80 p-4">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between mb-8 max-w-7xl mx-auto"
            >
                <div className="flex items-center gap-4">
                    <Button onClick={() => navigate('/')} variant="ghost" size="sm">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Jarvis
                    </Button>
                </div>
                <div className="text-center">
                    <h1 className="text-3xl md:text-4xl font-orbitron font-bold bg-gradient-to-r from-primary via-cyan-400 to-blue-500 bg-clip-text text-transparent">
                        IRON MAN SUIT ARCHIVE
                    </h1>
                    <p className="text-muted-foreground text-sm font-rajdhani">
                        {suits.length} Suits Catalogued • Touch any suit to analyze
                    </p>
                </div>
                <div className="w-24" /> {/* Spacer for centering */}
            </motion.div>

            {/* Loading State */}
            {isLoading && (
                <div className="flex items-center justify-center h-64">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                        className="text-6xl"
                    >
                        ⚙️
                    </motion.div>
                </div>
            )}

            {/* Suits Grid */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 max-w-7xl mx-auto"
            >
                {suits.map((suit, index) => {
                    const glowColor = getSuitColorHex(suit.color);
                    return (
                        <motion.div
                            key={suit.markNumber}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            whileHover={{ scale: 1.05, y: -5 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Card
                                onClick={() => openSuitModal(suit)}
                                className="cursor-pointer overflow-hidden border-2 transition-all duration-300 hover:shadow-lg"
                                style={{
                                    borderColor: `${glowColor}44`,
                                    boxShadow: `0 0 20px ${glowColor}22`,
                                }}
                            >
                                <CardContent className="p-4 relative">
                                    {/* Holographic Preview */}
                                    <div
                                        className="w-full h-24 rounded-lg flex items-center justify-center mb-3 relative overflow-hidden"
                                        style={{
                                            background: `linear-gradient(135deg, ${glowColor}22 0%, ${glowColor}11 100%)`,
                                            border: `1px solid ${glowColor}44`,
                                        }}
                                    >
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                                            className="text-3xl font-bold font-orbitron"
                                            style={{ color: glowColor, textShadow: `0 0 10px ${glowColor}` }}
                                        >
                                            Ⅿ
                                        </motion.div>
                                        <div className="absolute bottom-1 right-1 text-xs font-mono opacity-60">
                                            MK{suit.markNumber}
                                        </div>
                                    </div>

                                    {/* Suit Info */}
                                    <h3 className="font-rajdhani font-bold text-sm truncate" title={suit.name}>
                                        {suit.name}
                                    </h3>
                                    <p className="text-xs text-muted-foreground truncate">
                                        {suit.specialization}
                                    </p>
                                    <Badge className={`mt-2 text-xs ${getStatusColor(suit.status)}`}>
                                        {suit.status}
                                    </Badge>
                                </CardContent>
                            </Card>
                        </motion.div>
                    );
                })}
            </motion.div>

            {/* Suit Detail Modal */}
            <AnimatePresence>
                {selectedSuit && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
                        onClick={() => setSelectedSuit(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            transition={{ type: 'spring', damping: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto"
                        >
                            {/* Close Button */}
                            <Button
                                onClick={() => setSelectedSuit(null)}
                                variant="ghost"
                                size="icon"
                                className="absolute top-4 right-4 z-10 bg-background/50 backdrop-blur-sm rounded-full"
                            >
                                <X className="w-5 h-5" />
                            </Button>

                            <Card
                                className="border-2 overflow-hidden"
                                style={{
                                    borderColor: getSuitColorHex(selectedSuit.color),
                                    boxShadow: `0 0 60px ${getSuitColorHex(selectedSuit.color)}44`,
                                }}
                            >
                                <CardContent className="p-0">
                                    {/* Analyzing State */}
                                    {isAnalyzing ? (
                                        <div className="h-96 flex flex-col items-center justify-center">
                                            <motion.div
                                                animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
                                                transition={{ duration: 1, repeat: Infinity }}
                                                className="w-32 h-32 rounded-full flex items-center justify-center mb-6"
                                                style={{
                                                    background: `linear-gradient(135deg, ${getSuitColorHex(selectedSuit.color)}44 0%, ${getSuitColorHex(selectedSuit.color)}22 100%)`,
                                                    boxShadow: `0 0 40px ${getSuitColorHex(selectedSuit.color)}66`,
                                                }}
                                            >
                                                <span className="text-5xl">🔍</span>
                                            </motion.div>
                                            <motion.p
                                                className="text-xl font-orbitron"
                                                animate={{ opacity: [1, 0.5, 1] }}
                                                transition={{ duration: 0.8, repeat: Infinity }}
                                                style={{ color: getSuitColorHex(selectedSuit.color) }}
                                            >
                                                ANALYZING SUIT DATA...
                                            </motion.p>
                                            {/* Scan line */}
                                            <motion.div
                                                className="w-48 h-1 mt-4 rounded"
                                                style={{ backgroundColor: getSuitColorHex(selectedSuit.color) }}
                                                animate={{ scaleX: [0, 1, 0], opacity: [0, 1, 0] }}
                                                transition={{ duration: 1.5, repeat: Infinity }}
                                            />
                                        </div>
                                    ) : (
                                        <div className="grid md:grid-cols-2 gap-6 p-6">
                                            {/* Left: 3D Hologram */}
                                            <div className="flex flex-col items-center justify-center">
                                                <motion.div
                                                    className="relative w-64 h-64"
                                                    style={{ perspective: '1000px' }}
                                                >
                                                    <motion.div
                                                        animate={{ rotateY: 360 }}
                                                        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                                                        className="w-full h-full flex items-center justify-center rounded-lg"
                                                        style={{
                                                            transformStyle: 'preserve-3d',
                                                            background: `linear-gradient(135deg, ${getSuitColorHex(selectedSuit.color)}33 0%, ${getSuitColorHex(selectedSuit.color)}11 100%)`,
                                                            border: `2px solid ${getSuitColorHex(selectedSuit.color)}88`,
                                                            boxShadow: `0 0 40px ${getSuitColorHex(selectedSuit.color)}44, inset 0 0 30px ${getSuitColorHex(selectedSuit.color)}22`,
                                                        }}
                                                    >
                                                        <div className="text-center">
                                                            <div
                                                                className="text-7xl font-bold font-orbitron"
                                                                style={{
                                                                    color: getSuitColorHex(selectedSuit.color),
                                                                    textShadow: `0 0 20px ${getSuitColorHex(selectedSuit.color)}`,
                                                                }}
                                                            >
                                                                Ⅿ
                                                            </div>
                                                            <div
                                                                className="text-2xl font-orbitron mt-2"
                                                                style={{ color: getSuitColorHex(selectedSuit.color) }}
                                                            >
                                                                MARK {selectedSuit.markNumber}
                                                            </div>
                                                        </div>
                                                    </motion.div>

                                                    {/* Orbiting particles */}
                                                    {[0, 1, 2].map((i) => (
                                                        <motion.div
                                                            key={i}
                                                            className="absolute w-2 h-2 rounded-full"
                                                            style={{
                                                                backgroundColor: getSuitColorHex(selectedSuit.color),
                                                                boxShadow: `0 0 10px ${getSuitColorHex(selectedSuit.color)}`,
                                                                top: '50%',
                                                                left: '50%',
                                                            }}
                                                            animate={{
                                                                rotate: 360,
                                                            }}
                                                            transition={{
                                                                duration: 5 + i * 2,
                                                                repeat: Infinity,
                                                                ease: 'linear',
                                                            }}
                                                            initial={{
                                                                x: -4 + Math.cos((i * 2 * Math.PI) / 3) * 140,
                                                                y: -4 + Math.sin((i * 2 * Math.PI) / 3) * 140,
                                                            }}
                                                        />
                                                    ))}
                                                </motion.div>

                                                <p className="text-xs font-mono opacity-60 mt-4">HOLOGRAPHIC PROJECTION ACTIVE</p>
                                            </div>

                                            {/* Right: Analysis Panels */}
                                            <div className="space-y-4">
                                                {/* Header */}
                                                <motion.div
                                                    initial={{ opacity: 0, x: 20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: 0.1 }}
                                                >
                                                    <h2 className="text-2xl font-orbitron font-bold" style={{ color: getSuitColorHex(selectedSuit.color) }}>
                                                        {selectedSuit.name}
                                                    </h2>
                                                    <p className="text-muted-foreground">{selectedSuit.specialization}</p>
                                                    <div className="flex gap-2 mt-2">
                                                        <Badge className={getStatusColor(selectedSuit.status)}>
                                                            {selectedSuit.status}
                                                        </Badge>
                                                        <Badge variant="outline">{selectedSuit.filmIntroduced}</Badge>
                                                    </div>
                                                </motion.div>

                                                {/* Jarvis Commentary */}
                                                <motion.div
                                                    initial={{ opacity: 0, x: 20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: 0.2 }}
                                                    className="p-4 rounded-lg bg-gradient-to-r from-primary/10 to-cyan-500/10 border border-primary/30"
                                                >
                                                    <p className="text-sm italic font-rajdhani">
                                                        "{JARVIS_SUIT_COMMENTARY[selectedSuit.markNumber] || getDefaultCommentary(selectedSuit)}"
                                                    </p>
                                                    <p className="text-xs text-muted-foreground mt-1">— J.A.R.V.I.S.</p>
                                                </motion.div>

                                                {/* Technical Specs */}
                                                <motion.div
                                                    initial={{ opacity: 0, x: 20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: 0.3 }}
                                                    className="space-y-2"
                                                >
                                                    <h3 className="font-semibold flex items-center gap-2">
                                                        <Cpu className="w-4 h-4" /> Technical Specifications
                                                    </h3>
                                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                                        <div className="p-2 rounded bg-muted/30">
                                                            <p className="text-xs text-muted-foreground">Armor</p>
                                                            <p className="font-medium">{selectedSuit.technicalSpecs.armor}</p>
                                                        </div>
                                                        <div className="p-2 rounded bg-muted/30">
                                                            <p className="text-xs text-muted-foreground">Power</p>
                                                            <p className="font-medium">{selectedSuit.technicalSpecs.power}</p>
                                                        </div>
                                                    </div>
                                                </motion.div>

                                                {/* Capabilities */}
                                                <motion.div
                                                    initial={{ opacity: 0, x: 20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: 0.4 }}
                                                    className="space-y-2"
                                                >
                                                    <h3 className="font-semibold flex items-center gap-2">
                                                        <Zap className="w-4 h-4" /> Capabilities
                                                    </h3>
                                                    <div className="flex flex-wrap gap-1">
                                                        {selectedSuit.technicalSpecs.capabilities.map((cap, i) => (
                                                            <Badge key={i} variant="secondary" className="text-xs">
                                                                {cap}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                </motion.div>

                                                {/* Notable Moments */}
                                                <motion.div
                                                    initial={{ opacity: 0, x: 20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: 0.5 }}
                                                    className="space-y-2"
                                                >
                                                    <h3 className="font-semibold flex items-center gap-2">
                                                        <Target className="w-4 h-4" /> Notable Moments
                                                    </h3>
                                                    <ul className="text-sm space-y-1">
                                                        {selectedSuit.notableMoments.slice(0, 3).map((moment, i) => (
                                                            <li key={i} className="flex items-start gap-2">
                                                                <Flame className="w-3 h-3 mt-1 text-orange-400 flex-shrink-0" />
                                                                <span>{moment}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </motion.div>

                                                {/* Weaknesses */}
                                                {selectedSuit.weaknesses && (
                                                    <motion.div
                                                        initial={{ opacity: 0, x: 20 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: 0.6 }}
                                                        className="p-3 rounded-lg bg-red-500/10 border border-red-500/30"
                                                    >
                                                        <h3 className="font-semibold flex items-center gap-2 text-red-400 text-sm">
                                                            <Shield className="w-4 h-4" /> Known Weaknesses
                                                        </h3>
                                                        <p className="text-sm mt-1">{selectedSuit.weaknesses}</p>
                                                    </motion.div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
