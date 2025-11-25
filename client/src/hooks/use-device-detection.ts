import { useState, useEffect } from 'react';

export interface DeviceInfo {
  isIPhone: boolean;
  isMacBook: boolean;
  isTablet: boolean;
  isMobile: boolean;
  osType: 'iOS' | 'macOS' | 'Android' | 'Windows' | 'Linux' | 'Unknown';
  userAgent: string;
}

export function useDeviceDetection(): DeviceInfo {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    isIPhone: false,
    isMacBook: false,
    isTablet: false,
    isMobile: false,
    osType: 'Unknown',
    userAgent: '',
  });

  useEffect(() => {
    const ua = navigator.userAgent;
    
    // Detect OS and device
    const isIPhone = /iPhone/.test(ua) && !/iPad/.test(ua);
    const isMacBook = /Macintosh/.test(ua) && !/iPhone|iPad|Android/.test(ua);
    const isIPad = /iPad|Mac OS X.*Safari/.test(ua) && !/iPhone/.test(ua);
    const isAndroidTablet = /Android/.test(ua) && !/Mobile/.test(ua);
    const isAndroid = /Android/.test(ua);
    const isTablet = isIPad || isAndroidTablet;
    const isMobile = isIPhone || (isAndroid && !isAndroidTablet);
    
    let osType: 'iOS' | 'macOS' | 'Android' | 'Windows' | 'Linux' | 'Unknown' = 'Unknown';
    if (isIPhone || isIPad) osType = 'iOS';
    else if (isMacBook) osType = 'macOS';
    else if (isAndroid) osType = 'Android';
    else if (/Windows/.test(ua)) osType = 'Windows';
    else if (/Linux/.test(ua)) osType = 'Linux';

    setDeviceInfo({
      isIPhone,
      isMacBook,
      isTablet,
      isMobile,
      osType,
      userAgent: ua,
    });
  }, []);

  return deviceInfo;
}

export function useBatteryStatus() {
  const [battery, setBattery] = useState<{
    level: number;
    charging: boolean;
    chargingTime: number;
    dischargingTime: number;
  } | null>(null);

  useEffect(() => {
    const getBattery = async () => {
      try {
        // @ts-ignore - Battery API not in standard types yet
        const batteryManager = await (navigator as any).getBattery?.();
        
        if (batteryManager) {
          const updateBattery = () => {
            setBattery({
              level: Math.round(batteryManager.level * 100),
              charging: batteryManager.charging,
              chargingTime: batteryManager.chargingTime,
              dischargingTime: batteryManager.dischargingTime,
            });
          };

          updateBattery();
          
          batteryManager.addEventListener('levelchange', updateBattery);
          batteryManager.addEventListener('chargingchange', updateBattery);
          batteryManager.addEventListener('chargingtimechange', updateBattery);
          batteryManager.addEventListener('dischargingtimechange', updateBattery);

          return () => {
            batteryManager.removeEventListener('levelchange', updateBattery);
            batteryManager.removeEventListener('chargingchange', updateBattery);
            batteryManager.removeEventListener('chargingtimechange', updateBattery);
            batteryManager.removeEventListener('dischargingtimechange', updateBattery);
          };
        }
      } catch (error) {
        // Battery API not supported
        console.debug('Battery API not supported');
      }
    };

    getBattery();
  }, []);

  return battery;
}
