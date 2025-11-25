import { useQuery } from '@tanstack/react-query';
import { MapPin, Activity } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import type { TonyActivity } from '@shared/schema';
import { useEffect, useRef, useState, Suspense, lazy } from 'react';

const Globe = lazy(() => import('react-globe.gl'));

export function TonyTracker() {
  const { data: activity } = useQuery<TonyActivity>({
    queryKey: ['/api/tony-activity'],
  });

  const globeEl = useRef<any>();
  const [globeReady, setGlobeReady] = useState(false);
  const [useGlobe, setUseGlobe] = useState(true);

  useEffect(() => {
    // Check WebGL support
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) {
      setUseGlobe(false);
    }
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
          className="relative w-full h-48 md:h-64 bg-background/50 rounded-lg border border-primary/10 overflow-hidden"
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
                  el.innerHTML = `
                    <div style="
                      width: 20px;
                      height: 20px;
                      border-radius: 50%;
                      background: radial-gradient(circle, rgba(0,255,255,1) 0%, rgba(0,255,255,0.5) 50%, rgba(0,255,255,0) 100%);
                      box-shadow: 0 0 20px rgba(0,255,255,0.8);
                      animation: pulse-marker 2s ease-in-out infinite;
                    "></div>
                    <style>
                      @keyframes pulse-marker {
                        0%, 100% { transform: scale(1); opacity: 1; }
                        50% { transform: scale(1.5); opacity: 0.7; }
                      }
                    </style>
                  `;
                  return el;
                }}
                onGlobeReady={() => setGlobeReady(true)}
                width={undefined}
                height={undefined}
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
