import { motion } from 'framer-motion';
import { Activity, Zap, Heart, Thermometer, Shield, Brain, Droplet, Wind, Zap as Muscles } from 'lucide-react';

interface StarkScanData {
  timestamp: number;
  suit: string;
  outfit: string;
  heartRate: number;
  mood: string;
  bodyTemperature: number;
  energyLevel: number;
  armorIntegrity: number;
  location: string;
  activity: string;
  coordinates: { lat: number; lng: number };
  vitals: {
    adrenaline: number;
    cortisol: number;
    oxygenation: number;
  };
  systems: {
    neural: number;
    circulatory: number;
    respiratory: number;
    muscular: number;
  };
}

interface StarkScanProps {
  data: StarkScanData;
}

export function StarkScan({ data }: StarkScanProps) {
  return (
    <div className="w-full bg-gradient-to-br from-primary/10 via-background to-primary/5 rounded-lg border border-primary/20 p-6 overflow-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="border-b border-primary/20 pb-4">
          <div className="flex items-center gap-3 mb-2">
            <motion.div
              animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-primary"
            >
              <Activity className="w-5 h-5" />
            </motion.div>
            <h2 className="text-lg font-orbitron font-bold text-primary uppercase tracking-wider">
              STARK SCAN - SYSTEM STATUS
            </h2>
          </div>
          <p className="text-xs text-muted-foreground/70 font-rajdhani">
            Real-time Biometric Analysis • {new Date(data.timestamp).toLocaleTimeString()}
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Left: Physical Status */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            {/* Outfit & Suit */}
            <div className="bg-card/40 border border-primary/15 rounded-lg p-4 backdrop-blur-sm">
              <h3 className="text-xs font-orbitron uppercase text-primary/80 mb-3 tracking-wider">
                Current Attire
              </h3>
              <div className="space-y-2">
                <div>
                  <p className="text-xs text-muted-foreground">SUIT:</p>
                  <p className="text-sm font-rajdhani text-foreground">{data.suit}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">OUTFIT:</p>
                  <p className="text-sm font-rajdhani text-foreground">{data.outfit}</p>
                </div>
              </div>
            </div>

            {/* Mood & Activity */}
            <div className="bg-card/40 border border-primary/15 rounded-lg p-4 backdrop-blur-sm">
              <h3 className="text-xs font-orbitron uppercase text-primary/80 mb-3 tracking-wider">
                Status Report
              </h3>
              <div className="space-y-2">
                <div>
                  <p className="text-xs text-muted-foreground">MOOD:</p>
                  <p className="text-sm font-rajdhani text-foreground font-semibold">{data.mood}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">CURRENT ACTIVITY:</p>
                  <p className="text-xs font-rajdhani text-foreground/80">{data.activity}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">LOCATION:</p>
                  <p className="text-xs font-rajdhani text-foreground/80">{data.location}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right: Vital Signs */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            {/* Heart Rate */}
            <div className="bg-card/40 border border-red-500/20 rounded-lg p-4 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-red-500" />
                  <h3 className="text-xs font-orbitron uppercase text-red-500/80 tracking-wider">
                    Heart Rate
                  </h3>
                </div>
                <span className="text-xl font-bold text-red-500">{data.heartRate}</span>
              </div>
              <div className="w-full bg-background/50 rounded-full h-2 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(data.heartRate / 160) * 100}%` }}
                  transition={{ duration: 0.8 }}
                  className="h-full bg-gradient-to-r from-red-500 to-red-400"
                />
              </div>
              <p className="text-xs text-muted-foreground/70 mt-1">BPM</p>
            </div>

            {/* Energy Level */}
            <div className="bg-card/40 border border-yellow-500/20 rounded-lg p-4 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-yellow-500" />
                  <h3 className="text-xs font-orbitron uppercase text-yellow-500/80 tracking-wider">
                    Energy Level
                  </h3>
                </div>
                <span className="text-xl font-bold text-yellow-500">{data.energyLevel}%</span>
              </div>
              <div className="w-full bg-background/50 rounded-full h-2 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${data.energyLevel}%` }}
                  transition={{ duration: 0.8 }}
                  className="h-full bg-gradient-to-r from-yellow-500 to-yellow-400"
                />
              </div>
            </div>

            {/* Temperature */}
            <div className="bg-card/40 border border-orange-500/20 rounded-lg p-4 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Thermometer className="w-4 h-4 text-orange-500" />
                  <h3 className="text-xs font-orbitron uppercase text-orange-500/80 tracking-wider">
                    Body Temp
                  </h3>
                </div>
                <span className="text-xl font-bold text-orange-500">{data.bodyTemperature}°C</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Detailed Vitals */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-card/40 border border-primary/15 rounded-lg p-4 backdrop-blur-sm"
        >
          <h3 className="text-xs font-orbitron uppercase text-primary/80 mb-4 tracking-wider">
            Detailed Vitals Analysis
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {/* Adrenaline */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Droplet className="w-3 h-3 text-pink-500" />
                <span className="text-xs text-muted-foreground">Adrenaline</span>
              </div>
              <div className="bg-background/50 rounded h-2 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${data.vitals.adrenaline}%` }}
                  transition={{ duration: 0.8 }}
                  className="h-full bg-pink-500"
                />
              </div>
              <p className="text-xs font-rajdhani font-bold">{data.vitals.adrenaline}%</p>
            </div>

            {/* Cortisol */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Zap className="w-3 h-3 text-cyan-500" />
                <span className="text-xs text-muted-foreground">Cortisol</span>
              </div>
              <div className="bg-background/50 rounded h-2 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${data.vitals.cortisol}%` }}
                  transition={{ duration: 0.8 }}
                  className="h-full bg-cyan-500"
                />
              </div>
              <p className="text-xs font-rajdhani font-bold">{data.vitals.cortisol}%</p>
            </div>

            {/* Oxygenation */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Wind className="w-3 h-3 text-blue-500" />
                <span className="text-xs text-muted-foreground">O₂ Level</span>
              </div>
              <div className="bg-background/50 rounded h-2 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${data.vitals.oxygenation}%` }}
                  transition={{ duration: 0.8 }}
                  className="h-full bg-blue-500"
                />
              </div>
              <p className="text-xs font-rajdhani font-bold">{data.vitals.oxygenation}%</p>
            </div>

            {/* Armor Integrity */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Shield className="w-3 h-3 text-green-500" />
                <span className="text-xs text-muted-foreground">Armor</span>
              </div>
              <div className="bg-background/50 rounded h-2 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${data.armorIntegrity}%` }}
                  transition={{ duration: 0.8 }}
                  className="h-full bg-green-500"
                />
              </div>
              <p className="text-xs font-rajdhani font-bold">{data.armorIntegrity}%</p>
            </div>
          </div>
        </motion.div>

        {/* System Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-card/40 border border-primary/15 rounded-lg p-4 backdrop-blur-sm"
        >
          <h3 className="text-xs font-orbitron uppercase text-primary/80 mb-4 tracking-wider">
            System Integrity
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { name: 'Neural', icon: Brain, value: data.systems.neural },
              { name: 'Circulatory', icon: Activity, value: data.systems.circulatory },
              { name: 'Respiratory', icon: Wind, value: data.systems.respiratory },
              { name: 'Muscular', icon: Muscles, value: data.systems.muscular },
            ].map((system, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex items-center gap-2">
                  <system.icon className="w-3 h-3 text-primary" />
                  <span className="text-xs text-muted-foreground">{system.name}</span>
                </div>
                <div className="bg-background/50 rounded h-2 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${system.value}%` }}
                    transition={{ duration: 0.8, delay: idx * 0.1 }}
                    className="h-full bg-gradient-to-r from-primary to-primary/50"
                  />
                </div>
                <p className="text-xs font-rajdhani font-bold">{system.value}%</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Scanning Animation */}
        <motion.div
          className="absolute inset-0 pointer-events-none overflow-hidden rounded-lg"
          style={{ opacity: 0.1 }}
        >
          <motion.div
            className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent"
            animate={{ y: [0, 400, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
