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
import { useJarvisVoice } from '@/hooks/use-jarvis-voice';
import { useJarvisSound } from '@/hooks/use-jarvis-sound';
import { useToast } from '@/hooks/use-toast';
import type { ChatMessage } from '@shared/schema';
import { motion, AnimatePresence } from 'framer-motion';
import { apiRequest } from '@/lib/queryClient';
import { useDeviceDetection, useBatteryStatus } from '@/hooks/use-device-detection';
import { TonysPhoneMirror } from '@/components/tonys-phone-mirror';
import { PhoneNotifications, type Notification } from '@/components/phone-notifications';
import { Zap, Smartphone, Volume2, VolumeX } from 'lucide-react';

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
  const [isRecording, setIsRecording] = useState(false); // input recording
  // The 'isSpeaking' from the hook drives the orb animation now
  const { speak, isSpeaking: isVoiceSpeaking, stop: stopSpeaking } = useJarvisVoice();
  const { playStartup, playAck, playProcess, playError } = useJarvisSound();

  // Voice State - Default to MUTED as requested
  const [isMuted, setIsMuted] = useState(true);

  // Startup State
  const [isStartup, setIsStartup] = useState(true);

  // We keep a local state for 'processing' (thinking)
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(true);
  const [showScan, setShowScan] = useState(false);
  const [showBlueprints, setShowBlueprints] = useState(false);
  const [showPhone, setShowPhone] = useState(false);
  const [scanData, setScanData] = useState<StarkScanData | null>(null);
  const recognitionRef = useRef<any>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const device = useDeviceDetection();
  const battery = useBatteryStatus();
  const [phoneNotifications, setPhoneNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Startup Sequence
    if (isStartup) {
      const runStartup = async () => {
        if (!isMuted) playStartup();
        // Wait for visual sequence
        await new Promise(r => setTimeout(r, 2000));
        if (!isMuted) speak("Importing preferences. Calibration complete. Welcome home, Sir.");
        setIsStartup(false);
      };
      runStartup();
    }
  }, [isStartup, playStartup, speak, isMuted]);

  useEffect(() => {
    // Fetch initial Stark Scan data
    const fetchScanData = async () => {
      // ... (unchanged)

      // ... (skip down to error handler where playError is called) 
      // I need to use replace_file_content carefully here to not break context. 
      // I will just replace the specific blocks.


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
            playError();

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
      }, [toast, playError]);

      const chatMutation = useMutation({
        mutationFn: async (userMessage: string) => {
          console.log('[CHAT DEBUG] 1. mutationFn START - Sending message:', userMessage);
          setIsProcessing(true);
          playProcess();

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
        onSuccess: (data: { response: string; isEasterEgg?: boolean; didSearch?: boolean; newLocation?: any }) => {
          console.log('[CHAT DEBUG] 3. ===== onSuccess CALLED =====');
          console.log('[CHAT DEBUG] 3a. Data received:', data);
          console.log('[CHAT DEBUG] 3a. Data received:', data);
          setIsProcessing(false);
          playAck();

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
            return updated;
          });

          // SPEAK THE RESPONSE
          speak(data.response);
          console.log('[CHAT DEBUG] 6. Triggered Voice');

          // If Tony's location was changed, invalidate the activity query to trigger globe animation
          if (data.newLocation) {
            console.log('[TONY MOVEMENT] New location detected:', data.newLocation.name);
            toast({
              title: "Calling Tony Stark",
              description: `Tony is heading to ${data.newLocation.name}`,
            });
            // Invalidate the query to refetch new location
            setTimeout(() => {
              queryClient.invalidateQueries({ queryKey: ['/api/tony-activity'] });
            }, 500);
          }

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

      // Handle phone notification - Jarvis comments on incoming texts
      const handlePhoneNotification = useCallback((characterId: string, characterName: string, jarvisComment: string) => {
        const assistantMessage: ChatMessage = {
          id: Date.now().toString(),
          role: 'assistant',
          content: jarvisComment,
          timestamp: new Date(),
          isTyping: true,
        };
        setMessages(prev => [...prev, assistantMessage]);
        speak(jarvisComment);

        // Stop speaking animation after a bit
        // setTimeout(() => setIsSpeaking(false), 3000);
      }, []);

      const handlePhoneNotificationDismiss = useCallback((id: string) => {
        setPhoneNotifications(prev => prev.filter(n => n.id !== id));
      }, []);

      const handlePhoneNotificationAdd = useCallback((n: Notification) => {
        setPhoneNotifications(prev => [...prev, n].slice(-3));
      }, []);

      // Track message frequency for dynamic Jarvis reactions
      const messageSpamCountsRef = useRef<Record<string, { count: number, lastTime: number }>>({});

      const handleOpenPhone = () => {
        setShowPhone(true);
        setUnreadCount(0);
        // Reset spam counts when user checks the phone
        messageSpamCountsRef.current = {};
      };

      // Called by TonysPhoneMirror for background messages
      const handleExternalPhoneAlert = useCallback((id: string, name: string, message: string) => {
        // 1. Update Spam Tracking
        const now = Date.now();
        const history = messageSpamCountsRef.current[id] || { count: 0, lastTime: 0 };

        // Reset count if > 45 seconds passed since last message from this person
        if (now - history.lastTime > 45000) {
          history.count = 0;
        }

        history.count++;
        history.lastTime = now;
        messageSpamCountsRef.current[id] = history;

        // 2. Generate Dynamic Jarvis Comment
        let comment = `Sir, incoming message from ${name}.`;
        const count = history.count;

        // Dynamic Reactions based on Character & Count
        if (count > 1) {
          // High Frequency / Spam Logic
          if (count >= 5) {
            if (id === 'peter') comment = `Sir, that is Mr. Parker's ${count}th message. He appears to be panicking.`;
            else if (id === 'pepper') comment = `Sir, Miss Potts has messaged ${count} times. I strongly suggest you respond immediately.`;
            else if (id === 'fury') comment = `Director Fury is up to message ${count}. This looks urgent, Sir.`;
            else if (id === 'happy') comment = `Happy has sent ${count} messages. Likely a badge issue.`;
            else comment = `Sir, that is message number ${count} from ${name}. Quite persistent.`;
          }
          else if (count >= 3) {
            if (id === 'peter') comment = `Another message from the Spider-ling.`;
            else if (id === 'pepper') comment = `Miss Potts is following up, Sir.`;
            else comment = `You have another update from ${name}.`;
          }
          else {
            // Count = 2
            comment = `And another one from ${name}.`;
          }
        } else {
          // Single Message (Random variations)
          const intros = [
            `Sir, incoming message from ${name}.`,
            `New communication from ${name}.`,
            `${name} just messaged you.`,
            `Text alert: ${name}.`,
            `Incoming transmission: ${name}.`
          ];
          comment = intros[Math.floor(Math.random() * intros.length)];
        }

        // 3. Show Bubble UI
        const newNotification: Notification = {
          id: Date.now().toString(),
          characterId: id,
          message: message,
          time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
        };
        setPhoneNotifications(prev => [...prev, newNotification].slice(-3));

        // 4. Trigger Jarvis Voice
        handlePhoneNotification(id, name, comment);

        // 5. Auto dismiss bubble
        setTimeout(() => {
          setPhoneNotifications(prev => prev.filter(n => n.id !== newNotification.id));
        }, 8000);

        // 6. Increment badge if phone is closed
        if (!showPhone) {
          setUnreadCount(prev => prev + 1);
        }
      }, [handlePhoneNotification, showPhone]);

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

        // We rely on the voice hook for the speaking state now, so we don't need to manually set it false.
        // The typing effect is purely visual text typing.
        // setTimeout(() => setIsSpeaking(false), 500);
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

          <AnimatePresence>
            {isStartup && (
              <motion.div
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1 }}
                className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black text-primary font-orbitron"
              >
                <motion.div
                  animate={{ scale: [0.8, 1.2, 0.8], rotate: [0, 180, 360] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-32 h-32 border-4 border-t-primary border-r-transparent border-b-primary border-l-transparent rounded-full mb-8"
                />
                <h1 className="text-4xl font-bold tracking-[0.5em] animate-pulse">J.A.R.V.I.S.</h1>
                <p className="mt-4 text-xs text-primary/70 font-mono">INITIALIZING SYSTEMS...</p>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="relative z-10 w-full lg:h-screen lg:flex lg:flex-col flex flex-col">
            {/* Header */}
            <motion.header
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="px-2 md:px-4 py-2 md:py-3 relative flex-shrink-0 border-b border-primary/10"
            >
              <div className="absolute right-4 top-2 flex items-center gap-2">
                {battery && device.isMobile && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-1 px-3 py-1 bg-primary/10 rounded-full border border-primary/20"
                  >
                    <Zap className="w-3 h-3 text-primary" />
                    <span className="text-xs font-mono font-bold">{battery.level}%</span>
                    {battery.charging && <motion.span animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="text-xs text-green-500">•</motion.span>}
                  </motion.div>
                )}
                <button
                  onClick={() => {
                    if (!isMuted) stopSpeaking();
                    setIsMuted(!isMuted);
                  }}
                  className="p-2 hover:bg-primary/10 rounded-full transition-colors text-primary"
                  title={isMuted ? "Enable Voice" : "Disable Voice"}
                >
                  {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>
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

                {/* Phone Mirror Button on Desktop */}
                <motion.button
                  onClick={handleOpenPhone}
                  className="relative w-full px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/40 hover:from-cyan-500/30 hover:to-blue-500/30 rounded-lg text-sm font-orbitron text-cyan-400 transition-colors flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  data-testid="button-phone-mirror"
                >
                  <Smartphone className="w-4 h-4" />
                  Tony's Phone
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-lg animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </motion.button>

                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center justify-center flex-1"
                >
                  <WaveformOrb isActive={isRecording || isProcessing} isSpeaking={isVoiceSpeaking} />
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
                    className="flex-1 flex flex-col rounded-lg border border-cyan-500/30 bg-background/50 backdrop-blur-sm min-h-0"
                  >
                    {/* Desktop Header with Close */}
                    <div className="hidden lg:flex items-center justify-between gap-2 p-3 border-b border-cyan-500/20 flex-shrink-0">
                      <h3 className="font-orbitron text-lg text-cyan-400">Holographic Blueprints</h3>
                      <button
                        onClick={() => setShowBlueprints(false)}
                        className="px-3 py-1.5 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 rounded text-cyan-400 text-xs font-orbitron transition-colors"
                        data-testid="button-close-blueprints-desktop"
                      >
                        Close
                      </button>
                    </div>
                    {/* Mobile Header with Close */}
                    <div className="lg:hidden flex items-center justify-between gap-2 p-3 border-b border-cyan-500/20 flex-shrink-0">
                      <h3 className="font-orbitron text-sm text-cyan-400">Holographic Blueprints</h3>
                      <button
                        onClick={() => setShowBlueprints(false)}
                        className="px-3 py-1.5 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 rounded text-cyan-400 text-xs font-orbitron transition-colors"
                        data-testid="button-close-blueprints"
                      >
                        Close
                      </button>
                    </div>
                    {/* Content */}
                    <div className="flex-1 overflow-hidden">
                      <BlueprintViewer />
                    </div>
                  </motion.div>
                )}

                {/* Stark Scan Modal/Overlay */}
                {showScan && scanData && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="flex-1 flex flex-col rounded-lg border border-primary/30 bg-background/50 backdrop-blur-sm min-h-0 md:max-h-96 md:overflow-y-auto"
                  >
                    {/* Mobile Header with Close */}
                    <div className="lg:hidden flex items-center justify-between gap-2 p-3 border-b border-primary/20 flex-shrink-0">
                      <h3 className="font-orbitron text-sm text-primary">Stark Scan</h3>
                      <button
                        onClick={() => setShowScan(false)}
                        className="px-3 py-1.5 bg-primary/20 hover:bg-primary/30 border border-primary/40 rounded text-primary text-xs font-orbitron transition-colors"
                        data-testid="button-close-stark-scan"
                      >
                        Close
                      </button>
                    </div>
                    {/* Content */}
                    <div className="flex-1 overflow-y-auto">
                      <StarkScan data={scanData} />
                    </div>
                  </motion.div>
                )}

                {/* Chat - Takes all remaining space */}
                <div className={`flex-1 lg:min-h-0 overflow-y-auto lg:overflow-hidden ${(showScan || showBlueprints) ? 'hidden lg:block' : ''}`}>
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
                        className={`flex-1 px-2 md:px-3 py-2 md:py-3 bg-primary/20 border border-primary/40 hover:bg-primary/30 rounded-lg text-[0.65rem] md:text-xs font-orbitron text-primary transition-colors active:scale-95 ${device.isIPhone ? 'min-h-11 md:min-h-12 touch-target' : 'min-h-10 md:min-h-11'
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
                      className={`flex-1 px-2 md:px-3 py-2 md:py-3 bg-cyan-500/20 border border-cyan-500/40 hover:bg-cyan-500/30 rounded-lg text-[0.65rem] md:text-xs font-orbitron text-cyan-400 transition-colors active:scale-95 ${device.isIPhone ? 'min-h-11 md:min-h-12 touch-target' : 'min-h-10 md:min-h-11'
                        }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      data-testid="button-toggle-blueprints-mobile"
                    >
                      {showBlueprints ? '← Prints' : 'Prints →'}
                    </motion.button>
                    <motion.button
                      onClick={() => navigate('/quiz')}
                      className={`flex-1 px-2 md:px-3 py-2 md:py-3 bg-purple-500/20 border border-purple-500/40 hover:bg-purple-500/30 rounded-lg text-[0.65rem] md:text-xs font-orbitron text-purple-400 transition-colors active:scale-95 ${device.isIPhone ? 'min-h-11 md:min-h-12 touch-target' : 'min-h-10 md:min-h-11'
                        }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      data-testid="button-start-quiz-mobile"
                    >
                      Quiz
                    </motion.button>
                    <motion.button
                      onClick={handleOpenPhone}
                      className={`relative flex-1 px-2 md:px-3 py-2 md:py-3 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/40 hover:from-cyan-500/30 hover:to-blue-500/30 rounded-lg text-[0.65rem] md:text-xs font-orbitron text-cyan-400 transition-colors active:scale-95 ${device.isIPhone ? 'min-h-11 md:min-h-12 touch-target' : 'min-h-10 md:min-h-11'
                        }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      data-testid="button-phone-mirror-mobile"
                    >
                      Phone
                      {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 flex h-3 w-3 items-center justify-center rounded-full bg-red-500 text-[8px] font-bold text-white shadow-lg animate-pulse">
                          {unreadCount}
                        </span>
                      )}
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
          </div>

          {/* Phone Notifications - Shows incoming texts on main screen */}
          <PhoneNotifications
            onOpenPhone={() => setShowPhone(true)}
            onNotification={handlePhoneNotification}
            notifications={phoneNotifications}
            onDismiss={handlePhoneNotificationDismiss}
            onAddInternal={handlePhoneNotificationAdd}
          />

          {/* Phone Mirror Component - Rendered at root level for overlay */}
          <TonysPhoneMirror
            isOpen={showPhone}
            onClose={() => setShowPhone(false)}
            onNotification={handleExternalPhoneAlert}
          />
        </div>
      );
    }
