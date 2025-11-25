import { useState, useEffect, useRef } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { WaveformOrb } from '@/components/waveform-orb';
import { ChatInterface } from '@/components/chat-interface';
import { DashboardWidgets } from '@/components/dashboard-widgets';
import { TonyTracker } from '@/components/tony-tracker';
import { VoiceButton } from '@/components/voice-button';
import { TextInput } from '@/components/text-input';
import { ThemeToggle } from '@/components/theme-toggle';
import { ParticlesBackground } from '@/components/particles-background';
import { useToast } from '@/hooks/use-toast';
import type { ChatMessage } from '@shared/schema';
import { motion } from 'framer-motion';
import { apiRequest } from '@/lib/queryClient';

export default function JarvisPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(true);
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    // Initialize speech synthesis
    if ('speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }

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
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  const chatMutation = useMutation({
    mutationFn: async (userMessage: string) => {
      setIsProcessing(true);
      return await apiRequest('POST', '/api/chat', { message: userMessage });
    },
    onSuccess: (data: { response: string; isEasterEgg?: boolean }) => {
      setIsProcessing(false);
      
      const assistantMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
        isTyping: true,
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Start speaking/waveform animation immediately
      setIsSpeaking(true);

      // Speak the response (but don't stop isSpeaking here - let the typing complete callback handle it)
      if (synthRef.current) {
        const utterance = new SpeechSynthesisUtterance(data.response);
        utterance.lang = 'en-GB'; // British accent
        utterance.rate = 0.9;
        utterance.pitch = 1.0;

        synthRef.current.speak(utterance);
      }

      if (data.isEasterEgg) {
        toast({
          title: "Easter Egg Activated!",
          description: "Special Jarvis response triggered.",
        });
      }
    },
    onError: (error: Error) => {
      setIsProcessing(false);
      setIsSpeaking(false);
      toast({
        title: "Communication Error",
        description: error.message || "Failed to communicate with Jarvis.",
        variant: "destructive",
      });
    },
  });

  const handleUserMessage = (text: string) => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    chatMutation.mutate(text);
  };

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
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      {/* Animated particles background */}
      <ParticlesBackground />
      
      {/* Background effects */}
      <div className="fixed inset-0 bg-gradient-to-br from-background via-background to-primary/5" style={{ zIndex: 0 }} />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" style={{ zIndex: 0 }} />

      <div className="relative z-10 container mx-auto px-2 md:px-4 py-3 md:py-6 max-w-7xl h-screen flex flex-col">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-3 md:mb-6 relative flex-shrink-0"
        >
          <div className="absolute right-0 top-0">
            <ThemeToggle />
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-orbitron font-bold text-center bg-gradient-to-r from-primary via-primary to-primary/50 bg-clip-text text-transparent">
            J.A.R.V.I.S.
          </h1>
          <p className="text-center text-xs md:text-sm text-muted-foreground font-rajdhani tracking-wider mt-1">
            JUST A RATHER VERY INTELLIGENT SYSTEM
          </p>
        </motion.header>

        {/* Compact Info Row - Mobile optimized */}
        <div className="mb-3 md:mb-6 flex-shrink-0 space-y-3 md:space-y-4">
          {/* Dashboard Widgets - compact on mobile */}
          <div className="md:mb-0">
            <DashboardWidgets />
          </div>

          {/* Tony Tracker - compact on mobile */}
          <div>
            <TonyTracker />
          </div>
        </div>

        {/* Main Content - Chat takes priority */}
        <div className="flex-1 flex flex-col lg:flex-row gap-3 md:gap-6 min-h-0 overflow-hidden">
          {/* Waveform Orb - Desktop only */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="hidden lg:flex items-center justify-center lg:w-80 flex-shrink-0"
          >
            <WaveformOrb isActive={isRecording || isProcessing} isSpeaking={isSpeaking} />
          </motion.div>

          {/* Chat Interface - Full height, prominent */}
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            <div className="flex-1 min-h-0 overflow-hidden">
              <ChatInterface 
                messages={messages}
                onTypingComplete={() => {
                  setTimeout(() => setIsSpeaking(false), 500);
                }}
              />
            </div>
            
            {/* Input Controls - Fixed at bottom on mobile */}
            <div className="flex-shrink-0 space-y-3 pt-3 pb-safe">
              {/* Voice Button */}
              <div className="flex justify-center">
                <VoiceButton
                  isRecording={isRecording}
                  onToggle={toggleRecording}
                  disabled={chatMutation.isPending || !voiceSupported}
                />
              </div>

              {/* Text Input - Always available */}
              <div className="px-0 md:px-4">
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
          className="lg:hidden fixed bottom-40 right-4 pointer-events-none z-20"
        >
          <div className="scale-[0.35]">
            <WaveformOrb isActive={isRecording || isProcessing} isSpeaking={isSpeaking} />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
