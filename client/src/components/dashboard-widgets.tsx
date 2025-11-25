import { useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { Cloud, Battery, Clock } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import type { WeatherData, BatteryData } from '@shared/schema';

export function DashboardWidgets() {
  const { data: weather } = useQuery<WeatherData>({
    queryKey: ['/api/weather'],
    refetchInterval: 600000, // 10 minutes
  });

  const [battery, setBattery] = useState<BatteryData>({ level: 100, charging: false });

  useEffect(() => {
    // Use browser Battery API if available
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((batteryManager: any) => {
        const updateBattery = () => {
          setBattery({
            level: Math.round(batteryManager.level * 100),
            charging: batteryManager.charging
          });
        };

        updateBattery();
        batteryManager.addEventListener('levelchange', updateBattery);
        batteryManager.addEventListener('chargingchange', updateBattery);

        return () => {
          batteryManager.removeEventListener('levelchange', updateBattery);
          batteryManager.removeEventListener('chargingchange', updateBattery);
        };
      });
    }
  }, []);

  const currentTime = new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4" data-testid="dashboard-widgets">
      {/* Weather Widget */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="backdrop-blur-lg bg-card/40 border-primary/20 p-4" data-testid="widget-weather">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Cloud className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-xs uppercase tracking-wider text-muted-foreground font-rajdhani">Weather</p>
              {weather ? (
                <>
                  <p className="text-2xl font-orbitron font-bold text-foreground" data-testid="text-temperature">
                    {Math.round(weather.temp)}°
                  </p>
                  <p className="text-xs text-muted-foreground">{weather.condition}</p>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">Loading...</p>
              )}
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Battery Widget */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="backdrop-blur-lg bg-card/40 border-primary/20 p-4" data-testid="widget-battery">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Battery className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-xs uppercase tracking-wider text-muted-foreground font-rajdhani">Arc Reactor</p>
              <p className="text-2xl font-orbitron font-bold text-foreground" data-testid="text-battery">
                {battery.level}%
              </p>
              <p className="text-xs text-muted-foreground">
                {battery.charging ? 'Charging' : 'Active'}
              </p>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Time Widget */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="backdrop-blur-lg bg-card/40 border-primary/20 p-4" data-testid="widget-time">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Clock className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-xs uppercase tracking-wider text-muted-foreground font-rajdhani">Current Time</p>
              <p className="text-2xl font-orbitron font-bold text-foreground">{currentTime}</p>
              <p className="text-xs text-muted-foreground">{currentDate}</p>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
