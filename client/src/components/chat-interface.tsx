import { useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TypewriterText } from './typewriter-text';
import type { ChatMessage } from '@shared/schema';
import { motion, AnimatePresence } from 'framer-motion';

interface ChatInterfaceProps {
  messages: ChatMessage[];
  onTypingComplete?: () => void;
}

export function ChatInterface({ messages, onTypingComplete }: ChatInterfaceProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <Card className="backdrop-blur-lg bg-card/40 border-primary/20 flex-1 overflow-hidden" data-testid="chat-interface">
      <ScrollArea className="h-full p-6" ref={scrollRef}>
        <AnimatePresence mode="popLayout">
          {messages.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-center h-full text-center"
            >
              <div>
                <h2 className="text-3xl font-orbitron font-bold text-foreground mb-2">
                  J.A.R.V.I.S.
                </h2>
                <p className="text-muted-foreground font-rajdhani">
                  Just A Rather Very Intelligent System
                </p>
                <p className="text-sm text-muted-foreground/70 mt-4">
                  Click the microphone to begin
                </p>
              </div>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  data-testid={`message-${message.role}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-4 ${
                      message.role === 'user'
                        ? 'bg-primary/20 border border-primary/30'
                        : 'bg-card border border-primary/10'
                    }`}
                  >
                    <p className="text-xs uppercase tracking-wider text-muted-foreground font-rajdhani mb-1">
                      {message.role === 'user' ? 'You' : 'Jarvis'}
                    </p>
                    {message.role === 'assistant' && message.isTyping ? (
                      <TypewriterText
                        text={message.content}
                        speed={30}
                        className="text-foreground"
                        onComplete={onTypingComplete}
                      />
                    ) : (
                      <p className="text-foreground">{message.content}</p>
                    )}
                    <p className="text-xs text-muted-foreground/50 mt-2 font-mono">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </ScrollArea>
    </Card>
  );
}
