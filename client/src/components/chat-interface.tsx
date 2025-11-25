import { useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TypewriterText } from './typewriter-text';
import type { ChatMessage } from '@shared/schema';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, User, Search } from 'lucide-react';

interface ChatInterfaceProps {
  messages: ChatMessage[];
  onTypingComplete?: () => void;
  isSearching?: boolean;
}

export function ChatInterface({ messages, onTypingComplete, isSearching }: ChatInterfaceProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log('[CHAT INTERFACE DEBUG] Messages updated:', messages.length, 'messages');
    messages.forEach((msg, idx) => {
      console.log(`[CHAT INTERFACE DEBUG] Message ${idx}:`, {
        role: msg.role,
        isTyping: msg.isTyping,
        content: msg.content.substring(0, 50)
      });
    });
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    console.log('[CHAT INTERFACE DEBUG] onTypingComplete callback received:', typeof onTypingComplete);
  }, [onTypingComplete]);

  return (
    <Card className="backdrop-blur-lg bg-card/40 border-primary/20 flex flex-col h-full min-h-[300px] md:min-h-[400px]" data-testid="chat-interface">
      {/* Chat Header */}
      <div className="border-b border-primary/10 p-3 md:p-4 flex-shrink-0">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-primary animate-pulse" />
          <h3 className="text-sm font-orbitron font-semibold text-primary uppercase tracking-wider">
            Communication Channel
          </h3>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-hidden relative">
        <ScrollArea className="h-full" ref={scrollRef}>
          <div className="p-4 md:p-6">
            <AnimatePresence mode="popLayout">
              {messages.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center min-h-[250px] text-center"
                >
                  <motion.div
                    animate={{
                      scale: [1, 1.05, 1],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="mb-6"
                  >
                    <div className="relative">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border-2 border-primary/30">
                        <MessageSquare className="w-10 h-10 text-primary" />
                      </div>
                      <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
                    </div>
                  </motion.div>
                  <h2 className="text-2xl md:text-3xl font-orbitron font-bold text-foreground mb-2 bg-gradient-to-r from-primary via-primary to-primary/50 bg-clip-text text-transparent">
                    J.A.R.V.I.S. Online
                  </h2>
                  <p className="text-muted-foreground font-rajdhani text-sm md:text-base">
                    Just A Rather Very Intelligent System
                  </p>
                  <p className="text-xs md:text-sm text-muted-foreground/70 mt-4 font-rajdhani">
                    Voice command ready • Type your message below
                  </p>
                </motion.div>
              ) : (
                <div className="space-y-4">
                  {isSearching && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex gap-2 justify-start mb-4"
                    >
                      <motion.div
                        className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500/30 to-cyan-500/10 border border-cyan-500/30 flex items-center justify-center"
                        animate={{
                          boxShadow: ['0 0 0 0 rgba(0,255,255,0.4)', '0 0 0 8px rgba(0,255,255,0)', '0 0 0 0 rgba(0,255,255,0)']
                        }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                      </motion.div>
                      <div className="max-w-[85%] md:max-w-[80%] rounded-lg p-3 md:p-4 bg-card/60 border border-cyan-500/30 backdrop-blur-sm">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-xs uppercase tracking-wider text-cyan-400 font-rajdhani">
                            Searching MCU Database
                          </p>
                        </div>
                        <div className="flex gap-1">
                          <motion.div
                            className="w-2 h-2 rounded-full bg-cyan-400"
                            animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                            transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                          />
                          <motion.div
                            className="w-2 h-2 rounded-full bg-cyan-400"
                            animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                            transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                          />
                          <motion.div
                            className="w-2 h-2 rounded-full bg-cyan-400"
                            animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                            transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                  {messages.map((message, index) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, x: message.role === 'user' ? 20 : -20, scale: 0.9 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ type: "spring", stiffness: 200, damping: 20 }}
                      className={`flex gap-2 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      data-testid={`message-${message.role}`}
                    >
                      {/* Avatar for assistant */}
                      {message.role === 'assistant' && (
                        <motion.div
                          className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 border border-primary/30 flex items-center justify-center"
                          animate={{
                            boxShadow: ['0 0 0 0 rgba(0,255,255,0.4)', '0 0 0 8px rgba(0,255,255,0)', '0 0 0 0 rgba(0,255,255,0)']
                          }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                        </motion.div>
                      )}

                      {/* Message bubble */}
                      <div
                        className={`max-w-[85%] md:max-w-[80%] rounded-lg p-3 md:p-4 ${
                          message.role === 'user'
                            ? 'bg-primary/20 border border-primary/30 shadow-lg shadow-primary/10'
                            : 'bg-card/60 border border-primary/10 backdrop-blur-sm'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          {message.role === 'user' && <User className="w-3 h-3 text-primary" />}
                          <p className="text-xs uppercase tracking-wider text-muted-foreground font-rajdhani">
                            {message.role === 'user' ? 'You' : 'Jarvis'}
                          </p>
                        </div>
                        {message.role === 'assistant' && message.isTyping ? (
                          <>
                            <TypewriterText
                              text={message.content}
                              speed={30}
                              className="text-foreground text-sm md:text-base font-rajdhani leading-relaxed"
                              onComplete={() => {
                                console.log('[CHAT INTERFACE DEBUG] Typewriter onComplete fired, calling parent callback');
                                if (onTypingComplete) {
                                  onTypingComplete();
                                } else {
                                  console.warn('[CHAT INTERFACE DEBUG] WARNING - onTypingComplete prop is undefined!');
                                }
                              }}
                            />
                          </>
                        ) : (
                          <p className="text-foreground text-sm md:text-base font-rajdhani leading-relaxed">{message.content}</p>
                        )}
                        <p className="text-xs text-muted-foreground/50 mt-2 font-mono">
                          {new Date(message.timestamp).toLocaleTimeString()}
                        </p>
                      </div>

                      {/* Avatar for user */}
                      {message.role === 'user' && (
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-foreground/20 to-foreground/10 border border-foreground/20 flex items-center justify-center">
                          <User className="w-4 h-4 text-foreground/70" />
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </AnimatePresence>
          </div>
        </ScrollArea>

        {/* Scanning lines effect when messages exist */}
        {messages.length > 0 && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-10">
            <motion.div
              className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent"
              animate={{ y: [0, 400, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            />
          </div>
        )}
      </div>
    </Card>
  );
}