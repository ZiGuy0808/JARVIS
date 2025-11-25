import { useState, useEffect, useRef, useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { WaveformOrb } from '@/components/waveform-orb';
import { ChatInterface } from '@/components/chat-interface';
import { DashboardWidgets } from '@/components/dashboard-widgets';
import { TonyTracker } from '@/components/tony-tracker';
import { StarkScan } from '@/components/stark-scan';
import { BlueprintViewer } from '@/components/blueprint-viewer';
import { VoiceButton } from '@/components/voice-button';
import { TextInput } from '@/components/text-input';
import { ThemeToggle } from '@/components/theme-toggle';
import { ParticlesBackground } from '@/components/particles-background';
import { useToast } from '@/hooks/use-toast';
import type { ChatMessage } from '@shared/schema';
import { motion } from 'framer-motion';
import { apiRequest } from '@/lib/queryClient';
import { useDeviceDetection, useBatteryStatus } from '@/hooks/use-device-detection';
import { Zap } from 'lucide-react';

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

export default function JarvisPage() {
  const [, navigate] = useLocation();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(true);
  const [showScan, setShowScan] = useState(false);
  const [showBlueprints, setShowBlueprints] = useState(false);
  const [scanData, setScanData] = useState<StarkScanData | null>(null);
  const recognitionRef = useRef<any>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const device = useDeviceDetection();
  const battery = useBatteryStatus();

  useEffect(() => {
    // Fetch initial Stark Scan data
    const fetchScanData = async () => {
      try {
        const response = await fetch('/api/stark-scan');
        const data = await response.json();
        setScanData(data);
      } catch (error) {
        console.error('Failed to fetch Stark Scan data:', error);
      }
    };
    
    fetchScanData();
    
    // Refresh scan data every 5 seconds to show changing stats
    const interval = setInterval(fetchScanData, 5000);

    // Initialize speech recognition with feature detection
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setVoiceSupported(false);
      console.warn('Speech recognition not supported in this browser');
      return;
    }

    try {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        handleUserMessage(transcript);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
        
        if (event.error === 'not-allowed' || event.error === 'permission-denied') {
          setVoiceSupported(false);
          toast({
            title: "Microphone Permission Denied",
            description: "Please enable microphone access or use text input instead.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Voice Recognition Error",
            description: "Could not recognize speech. Please try text input.",
            variant: "destructive",
          });
        }
      };

      recognitionRef.current.onend = () => {
        setIsRecording(false);
      };
    } catch (error) {
      console.error('Failed to initialize speech recognition:', error);
      setVoiceSupported(false);
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          // Ignore errors during cleanup
        }
      }
      clearInterval(interval);
    };
  }, [toast]);

  const chatMutation = useMutation({
    mutationFn: async (userMessage: string) => {
      console.log('[CHAT DEBUG] 1. mutationFn START - Sending message:', userMessage);
      setIsProcessing(true);
      
      // Check if this might need a search
      const mightNeedSearch = 
        userMessage.toLowerCase().includes('quote') ||
        userMessage.toLowerCase().includes('movie') ||
        userMessage.toLowerCase().includes('scene') ||
        userMessage.toLowerCase().includes('when') ||
        userMessage.toLowerCase().includes('what') ||
        userMessage.toLowerCase().includes('who') ||
        userMessage.toLowerCase().includes('which');
      
      if (mightNeedSearch) {
        setIsSearching(true);
      }
      
      try {
        // Fetch current Tony activity to provide location context
        const tonyRes = await fetch('/api/tony-activity');
        const tonyData = await tonyRes.json();
        
        const result = await apiRequest('POST', '/api/chat', { 
          message: userMessage,
          tonyLocation: tonyData
        });
        console.log('[CHAT DEBUG] 2. mutationFn SUCCESS - Got response:', result);
        setIsSearching(false);
        return result;
      } catch (err) {
        console.error('[CHAT DEBUG] 2b. mutationFn FAILED:', err);
        setIsSearching(false);
        throw err;
      }
    },
    onSuccess: (data: { response: string; isEasterEgg?: boolean; didSearch?: boolean }) => {
      console.log('[CHAT DEBUG] 3. ===== onSuccess CALLED =====');
      console.log('[CHAT DEBUG] 3a. Data received:', data);
      setIsProcessing(false);
      
      const assistantMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
        isTyping: true,
      };

      console.log('[CHAT DEBUG] 4. Created assistant message:', assistantMessage);
      setMessages(prev => {
        const updated = [...prev, assistantMessage];
        console.log('[CHAT DEBUG] 5. State update - messages array now:', updated.length, 'messages');
        updated.forEach((m, i) => {
          console.log(`[CHAT DEBUG] 5.${i} Message ${i}:`, { role: m.role, isTyping: m.isTyping, contentPreview: m.content.substring(0, 30) });
        });
        return updated;
      });

      // Start waveform animation immediately
      setIsSpeaking(true);
      console.log('[CHAT DEBUG] 6. Set isSpeaking to true for waveform animation');

      if (data.isEasterEgg) {
        toast({
          title: "Easter Egg Activated!",
          description: "Special Jarvis response triggered.",
        });
      }

      if (data.didSearch) {
        toast({
          title: "Web Search Complete",
          description: "Accessed MCU database for accurate information.",
        });
      }
      console.log('[CHAT DEBUG] 8. ===== onSuccess COMPLETED =====');
    },
    onError: (error: Error) => {
      console.error('[CHAT DEBUG] ===== onError CALLED =====');
      console.error('[CHAT DEBUG] ERROR:', error);
      setIsProcessing(false);
      setIsSpeaking(false);
      toast({
        title: "Communication Error",
        description: error.message || "Failed to communicate with Jarvis.",
        variant: "destructive",
      });
    },
    onSettled: () => {
      console.log('[CHAT DEBUG] 11. ===== onSettled CALLED (mutation complete) =====');
    },
  });

  const handleUserMessage = (text: string) => {
    console.log('[CHAT DEBUG] handleUserMessage called with:', text);
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    console.log('[CHAT DEBUG] Adding user message, triggering mutation');
    setMessages(prev => [...prev, userMessage]);
    chatMutation.mutate(text);
  };

  const handleTypingComplete = useCallback(() => {
    console.log('[CHAT DEBUG] 8. handleTypingComplete called');
    setMessages(prev => {
      const updated = [...prev];
      let found = false;
      for (let i = updated.length - 1; i >= 0; i--) {
        if (updated[i].role === 'assistant' && updated[i].isTyping) {
          console.log('[CHAT DEBUG] 9. Marking message as done typing:', updated[i].content.substring(0, 50));
          updated[i] = { ...updated[i], isTyping: false };
          found = true;
          break;
        }
      }
      if (!found) {
        console.warn('[CHAT DEBUG] 9b. WARNING - No typing message found to mark as complete');
        console.warn('[CHAT DEBUG] Messages:', prev.map(m => ({ role: m.role, isTyping: m.isTyping, content: m.content.substring(0, 30) })));
      }
      return updated;
    });
    
    setTimeout(() => {
      console.log('[CHAT DEBUG] 10. Setting isSpeaking to false');
      setIsSpeaking(false);
    }, 500);
  }, []);

  const toggleRecording = () => {
    if (!recognitionRef.current || !voiceSupported) {
      toast({
        title: "Voice Not Available",
        description: "Please use the text input below instead.",
      });
      return;
    }

    if (isRecording) {
      try {
        recognitionRef.current.stop();
      } catch (error) {
        console.error('Error stopping recognition:', error);
      }
      setIsRecording(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (error) {
        console.error('Error starting recognition:', error);
        setVoiceSupported(false);
        toast({
          title: "Microphone Error",
          description: "Could not access microphone. Please use text input instead.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Animated particles background */}
      <ParticlesBackground />

      <div className="relative z-10 w-full lg:h-screen lg:flex lg:flex-col flex flex-col">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-2 md:px-4 py-2 md:py-3 relative flex-shrink-0 border-b border-primary/10"
        >
          <div className="absolute right-4 top-2 flex items-center gap-2">
            {battery && device.isIPhone && (
              <div className="flex items-center gap-1 px-3 py-1 bg-primary/10 rounded-full border border-primary/20">
                <Zap className="w-3 h-3 text-primary" />
                <span className="text-xs font-mono">{battery.level}%</span>
                {battery.charging && <span className="text-xs text-green-500">•</span>}
              </div>
            )}
            <ThemeToggle />
          </div>
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-orbitron font-bold text-center bg-gradient-to-r from-primary via-primary to-primary/50 bg-clip-text text-transparent">
            J.A.R.V.I.S.
          </h1>
          <p className="text-center text-xs md:text-sm text-muted-foreground font-rajdhani tracking-wider">
            {device.isIPhone ? 'iOS System Active' : 'Just A Rather Very Intelligent System'}
          </p>
        </motion.header>

        {/* Main content area - flexible layout */}
        <div className="flex-1 overflow-y-auto lg:overflow-hidden flex flex-col lg:flex-row gap-2 md:gap-4 p-2 md:p-4 lg:min-h-0">
          {/* Left sidebar - Info panels (desktop) / top (mobile) */}
          <div className="lg:w-96 lg:flex lg:flex-col gap-2 md:gap-4 hidden lg:flex lg:flex-shrink-0 lg:overflow-y-auto">
            <DashboardWidgets />
            <TonyTracker />
            {/* Stark Scan Toggle on Desktop */}
            {scanData && (
              <motion.button
                onClick={() => setShowScan(!showScan)}
                className="w-full px-4 py-2 bg-primary/20 border border-primary/40 hover:bg-primary/30 rounded-lg text-sm font-orbitron text-primary transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                data-testid="button-toggle-stark-scan"
              >
                {showScan ? 'Hide Stark Scan' : 'Show Stark Scan'}
              </motion.button>
            )}
            {/* Blueprint Viewer Toggle on Desktop */}
            <motion.button
              onClick={() => setShowBlueprints(!showBlueprints)}
              className="w-full px-4 py-2 bg-cyan-500/20 border border-cyan-500/40 hover:bg-cyan-500/30 rounded-lg text-sm font-orbitron text-cyan-400 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              data-testid="button-toggle-blueprints"
            >
              {showBlueprints ? 'Close Blueprints' : 'Holographic Blueprints'}
            </motion.button>
            {/* Quiz Button on Desktop */}
            <motion.button
              onClick={() => navigate('/quiz')}
              className="w-full px-4 py-2 bg-purple-500/20 border border-purple-500/40 hover:bg-purple-500/30 rounded-lg text-sm font-orbitron text-purple-400 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              data-testid="button-start-quiz"
            >
              MCU Quiz
            </motion.button>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center justify-center flex-1"
            >
              <WaveformOrb isActive={isRecording || isProcessing} isSpeaking={isSpeaking} />
            </motion.div>
          </div>

          {/* Center/Main - Chat PROMINENT */}
          <div className="flex-1 flex flex-col min-h-0 gap-2">
            {/* Top info on mobile */}
            <div className="lg:hidden flex flex-col gap-2">
              <DashboardWidgets />
              <TonyTracker />
            </div>

            {/* Blueprint Viewer Modal/Overlay */}
            {showBlueprints && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="h-[500px] md:h-[600px] overflow-hidden rounded-lg border border-cyan-500/30 bg-background/50 backdrop-blur-sm"
              >
                <BlueprintViewer />
              </motion.div>
            )}

            {/* Stark Scan Modal/Overlay */}
            {showScan && scanData && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-h-96 overflow-y-auto"
              >
                <StarkScan data={scanData} />
              </motion.div>
            )}

            {/* Chat - Takes all remaining space */}
            <div className={`flex-1 lg:min-h-0 overflow-y-auto lg:overflow-hidden ${(showScan || showBlueprints) ? 'hidden md:block' : ''}`}>
              <ChatInterface 
                messages={messages}
                onTypingComplete={handleTypingComplete}
                isSearching={isSearching}
              />
            </div>

            {/* Input Controls */}
            <div className="flex-shrink-0 space-y-1.5 md:space-y-2 pt-1 md:pt-2 px-0.5 md:px-0 pb-safe">
              {/* Toggles on Mobile - Optimized for iPhone */}
              <div className={`flex gap-1.5 md:gap-2 justify-center lg:hidden flex-wrap ${device.isIPhone ? 'px-1 md:px-2' : ''}`}>
                {scanData && (
                  <motion.button
                    onClick={() => setShowScan(!showScan)}
                    className={`flex-1 px-2 md:px-3 py-2 md:py-3 bg-primary/20 border border-primary/40 hover:bg-primary/30 rounded-lg text-[0.65rem] md:text-xs font-orbitron text-primary transition-colors active:scale-95 ${
                      device.isIPhone ? 'min-h-11 md:min-h-12 touch-target' : 'min-h-10 md:min-h-11'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    data-testid="button-toggle-stark-scan-mobile"
                  >
                    {showScan ? '← Scan' : 'Scan →'}
                  </motion.button>
                )}
                <motion.button
                  onClick={() => setShowBlueprints(!showBlueprints)}
                  className={`flex-1 px-2 md:px-3 py-2 md:py-3 bg-cyan-500/20 border border-cyan-500/40 hover:bg-cyan-500/30 rounded-lg text-[0.65rem] md:text-xs font-orbitron text-cyan-400 transition-colors active:scale-95 ${
                    device.isIPhone ? 'min-h-11 md:min-h-12 touch-target' : 'min-h-10 md:min-h-11'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  data-testid="button-toggle-blueprints-mobile"
                >
                  {showBlueprints ? '← Prints' : 'Prints →'}
                </motion.button>
                <motion.button
                  onClick={() => navigate('/quiz')}
                  className={`flex-1 px-2 md:px-3 py-2 md:py-3 bg-purple-500/20 border border-purple-500/40 hover:bg-purple-500/30 rounded-lg text-[0.65rem] md:text-xs font-orbitron text-purple-400 transition-colors active:scale-95 ${
                    device.isIPhone ? 'min-h-11 md:min-h-12 touch-target' : 'min-h-10 md:min-h-11'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  data-testid="button-start-quiz-mobile"
                >
                  Quiz
                </motion.button>
              </div>
              <div className="flex justify-center">
                <VoiceButton
                  isRecording={isRecording}
                  onToggle={toggleRecording}
                  disabled={chatMutation.isPending || !voiceSupported}
                />
              </div>
              <div className="px-1 md:px-0">
                <TextInput
                  onSubmit={handleUserMessage}
                  disabled={chatMutation.isPending}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Orb - floating, smaller */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="lg:hidden fixed bottom-36 right-2 md:right-4 pointer-events-none z-20"
        >
          <div className="scale-[0.25] md:scale-[0.3]">
            <WaveformOrb isActive={isRecording || isProcessing} isSpeaking={isSpeaking} />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
