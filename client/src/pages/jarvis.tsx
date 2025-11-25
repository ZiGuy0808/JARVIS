import { useState, useEffect, useRef, useCallback } from 'react';
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
      console.log('[CHAT DEBUG] 1. mutationFn START - Sending message:', userMessage);
      setIsProcessing(true);
      try {
        const result = await apiRequest('POST', '/api/chat', { message: userMessage });
        console.log('[CHAT DEBUG] 2. mutationFn SUCCESS - Got response:', result);
        return result;
      } catch (err) {
        console.error('[CHAT DEBUG] 2b. mutationFn FAILED:', err);
        throw err;
      }
    },
    onSuccess: (data: { response: string; isEasterEgg?: boolean }) => {
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

      // Start speaking/waveform animation immediately
      setIsSpeaking(true);
      console.log('[CHAT DEBUG] 6. Set isSpeaking to true');

      // Speak the response (but don't stop isSpeaking here - let the typing complete callback handle it)
      if (synthRef.current) {
        const utterance = new SpeechSynthesisUtterance(data.response);
        utterance.lang = 'en-GB'; // British accent
        utterance.rate = 0.9;
        utterance.pitch = 1.0;

        synthRef.current.speak(utterance);
        console.log('[CHAT DEBUG] 7. Started speaking');
      } else {
        console.log('[CHAT DEBUG] 7b. synthRef.current is null, no speech');
      }

      if (data.isEasterEgg) {
        toast({
          title: "Easter Egg Activated!",
          description: "Special Jarvis response triggered.",
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
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      {/* Animated particles background */}
      <ParticlesBackground />
      
      {/* Background effects */}
      <div className="fixed inset-0 bg-gradient-to-br from-background via-background to-primary/5" style={{ zIndex: 0 }} />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" style={{ zIndex: 0 }} />

      <div className="relative z-10 w-full h-screen flex flex-col">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-2 md:px-4 py-2 md:py-3 relative flex-shrink-0 border-b border-primary/10"
        >
          <div className="absolute right-4 top-2">
            <ThemeToggle />
          </div>
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-orbitron font-bold text-center bg-gradient-to-r from-primary via-primary to-primary/50 bg-clip-text text-transparent">
            J.A.R.V.I.S.
          </h1>
          <p className="text-center text-xs md:text-sm text-muted-foreground font-rajdhani tracking-wider">
            Just A Rather Very Intelligent System
          </p>
        </motion.header>

        {/* Main content area - flexible layout */}
        <div className="flex-1 overflow-hidden flex flex-col lg:flex-row gap-2 md:gap-4 p-2 md:p-4 min-h-0">
          {/* Left sidebar - Info panels (desktop) / top (mobile) */}
          <div className="lg:w-96 lg:flex lg:flex-col gap-2 md:gap-4 hidden lg:flex flex-shrink-0 overflow-y-auto">
            <DashboardWidgets />
            <TonyTracker />
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
            <div className="lg:hidden flex flex-col gap-2 flex-shrink-0">
              <DashboardWidgets />
              <TonyTracker />
            </div>

            {/* Chat - Takes all remaining space */}
            <div className="flex-1 min-h-0 overflow-hidden">
              <ChatInterface 
                messages={messages}
                onTypingComplete={handleTypingComplete}
              />
            </div>

            {/* Input Controls */}
            <div className="flex-shrink-0 space-y-2 pt-2 pb-safe">
              <div className="flex justify-center">
                <VoiceButton
                  isRecording={isRecording}
                  onToggle={toggleRecording}
                  disabled={chatMutation.isPending || !voiceSupported}
                />
              </div>
              <div className="px-0">
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
