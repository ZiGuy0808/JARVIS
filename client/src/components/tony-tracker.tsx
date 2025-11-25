import { useQuery } from '@tanstack/react-query';
import { MapPin, Activity } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import type { TonyActivity } from '@shared/schema';
import { useEffect, useRef, useState, Suspense, lazy } from 'react';

const Globe = lazy(() => import('react-globe.gl'));

interface StarkScan {
  energyLevel: number;
}

export function TonyTracker() {
  const { data: activity } = useQuery<TonyActivity>({
    queryKey: ['/api/tony-activity'],
  });

  const { data: starkScan } = useQuery<StarkScan>({
    queryKey: ['/api/stark-scan'],
  });

  const globeEl = useRef<any>();
  const containerRef = useRef<HTMLDivElement>(null);
  const [globeReady, setGlobeReady] = useState(false);
  const [useGlobe, setUseGlobe] = useState(true);
  const [dimensions, setDimensions] = useState({ width: 400, height: 300 });

  const batteryPercentage = starkScan?.energyLevel ?? 100;

  useEffect(() => {
    // Check WebGL support
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) {
      setUseGlobe(false);
    }
  }, []);

  useEffect(() => {
    // Update dimensions on mount and resize
    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setDimensions({ width: Math.max(rect.width, 300), height: Math.max(rect.height, 250) });
      }
    };

    updateDimensions();
    const resizeObserver = new ResizeObserver(updateDimensions);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    if (!globeEl.current || !activity || !globeReady) return;

    // Auto-rotate globe
    globeEl.current.controls().autoRotate = true;
    globeEl.current.controls().autoRotateSpeed = 0.5;

    // Point camera at Tony's location
    const { lat, lng } = activity.coordinates;
    globeEl.current.pointOfView({ lat, lng, altitude: 2.5 }, 2000);
  }, [activity, globeReady]);

  // Get Arc Reactor color based on battery level
  const getArcReactorColor = (battery: number) => {
    if (battery > 75) return 'rgba(0, 255, 200, 1)'; // Cyan - Full
    if (battery > 50) return 'rgba(0, 255, 150, 1)'; // Bright Cyan - Good
    if (battery > 25) return 'rgba(255, 200, 0, 1)'; // Orange - Low
    return 'rgba(255, 100, 100, 1)'; // Red - Critical
  };

  const arcReactorColor = getArcReactorColor(batteryPercentage);

  const markerData = activity ? [{
    lat: activity.coordinates.lat,
    lng: activity.coordinates.lng,
    size: 0.8,
    color: 'rgba(0, 255, 255, 0.8)'
  }] : [];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2 }}
      data-testid="tony-tracker"
    >
      <Card className="backdrop-blur-lg bg-card/40 border-primary/20 p-4 md:p-6 overflow-hidden">
        <div className="mb-4">
          <h3 className="text-xs uppercase tracking-wider text-muted-foreground font-rajdhani mb-2 flex items-center gap-2">
            <Activity className="w-3 h-3" />
            Stark Location Monitor
          </h3>
          {activity ? (
            <>
              <p className="text-sm md:text-lg font-orbitron font-semibold text-foreground mb-1" data-testid="text-tony-activity">
                {activity.activity}
              </p>
              <p className="text-xs md:text-sm text-muted-foreground flex items-center gap-2" data-testid="text-tony-location">
                <MapPin className="w-3 h-3 md:w-4 md:h-4" />
                {activity.location}
              </p>
              <p className="text-xs font-mono text-muted-foreground/70 mt-1">
                {activity.coordinates.lat.toFixed(4)}, {activity.coordinates.lng.toFixed(4)}
              </p>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">Scanning global satellites...</p>
          )}
        </div>

        <div 
          ref={containerRef}
          className="relative w-full h-48 md:h-56 bg-background/50 rounded-lg border border-primary/10 overflow-hidden"
          data-testid="map-container"
        >
          {useGlobe && activity ? (
            <Suspense fallback={
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-xs text-muted-foreground animate-pulse">Loading globe...</div>
              </div>
            }>
              <Globe
                ref={globeEl}
                globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
                bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
                backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
                htmlElementsData={markerData}
                htmlElement={(d: any) => {
                  const el = document.createElement('div');
                  const battery = batteryPercentage;
                  const glowIntensity = battery > 50 ? 12 : battery > 25 ? 8 : 4;
                  const ringOpacity = Math.max(0.3, battery / 100);
                  const outerGlowColor = `rgba(${battery > 75 ? '0, 255, 200' : battery > 50 ? '0, 255, 150' : battery > 25 ? '255, 200, 0' : '255, 100, 100'}, ${ringOpacity})`;
                  const coreColor = arcReactorColor;
                  
                  el.innerHTML = `
                    <svg width="28" height="28" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg" style="filter: drop-shadow(0 0 ${glowIntensity}px ${coreColor}); animation: arc-reactor-pulse 2s ease-in-out infinite;">
                      <!-- Outer glow -->
                      <circle cx="18" cy="18" r="16" fill="none" stroke="${outerGlowColor}" stroke-width="2" opacity="${Math.max(0.2, battery / 150)}"/>
                      <!-- Outer ring -->
                      <circle cx="18" cy="18" r="14" fill="none" stroke="${coreColor}" stroke-width="1.5" opacity="${ringOpacity * 0.8}"/>
                      <!-- Middle ring -->
                      <circle cx="18" cy="18" r="10" fill="none" stroke="${coreColor}" stroke-width="1.5" opacity="${ringOpacity * 0.9}"/>
                      <!-- Inner ring -->
                      <circle cx="18" cy="18" r="6" fill="none" stroke="${coreColor}" stroke-width="1.5" opacity="${ringOpacity}"/>
                      <!-- Core -->
                      <circle cx="18" cy="18" r="3" fill="${coreColor}" opacity="0.9"/>
                      <!-- Triangular segments (Arc reactor design) -->
                      <path d="M 18 18 L 24 10 L 26 12" stroke="${coreColor}" stroke-width="0.8" fill="none" opacity="0.7"/>
                      <path d="M 18 18 L 26 24 L 24 26" stroke="${coreColor}" stroke-width="0.8" fill="none" opacity="0.7"/>
                      <path d="M 18 18 L 12 26 L 10 24" stroke="${coreColor}" stroke-width="0.8" fill="none" opacity="0.7"/>
                      <path d="M 18 18 L 10 12 L 12 10" stroke="${coreColor}" stroke-width="0.8" fill="none" opacity="0.7"/>
                      <!-- Battery percentage text -->
                      <text x="18" y="38" text-anchor="middle" font-size="8" fill="${coreColor}" font-family="monospace" font-weight="bold" opacity="0.8">${battery.toFixed(0)}%</text>
                    </svg>
                    <style>
                      @keyframes arc-reactor-pulse {
                        0%, 100% { transform: scale(1) rotate(0deg); opacity: 1; }
                        50% { transform: scale(${1 + battery / 200}) rotate(180deg); opacity: ${0.8 + battery / 500}; }
                      }
                    </style>
                  `;
                  return el;
                }}
                onGlobeReady={() => setGlobeReady(true)}
                width={dimensions.width}
                height={dimensions.height}
                animateIn={true}
              />
            </Suspense>
          ) : (
            // Fallback 2D map for devices without WebGL
            <div className="absolute inset-0">
              <div className="absolute inset-0 opacity-20">
                <div className="absolute inset-0" style={{
                  backgroundImage: `
                    linear-gradient(to right, hsl(var(--primary) / 0.1) 1px, transparent 1px),
                    linear-gradient(to bottom, hsl(var(--primary) / 0.1) 1px, transparent 1px)
                  `,
                  backgroundSize: '20px 20px'
                }} />
              </div>
              
              {activity && (
                <motion.div
                  className="absolute w-3 h-3 -ml-1.5 -mt-1.5"
                  style={{
                    left: `${((activity.coordinates.lng + 180) / 360) * 100}%`,
                    top: `${((90 - activity.coordinates.lat) / 180) * 100}%`
                  }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  <div className="relative">
                    <div className="absolute inset-0 rounded-full bg-primary animate-pulse-ring" />
                    <div className="absolute inset-0 rounded-full bg-primary shadow-lg shadow-primary/50" />
                  </div>
                </motion.div>
              )}
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
}
