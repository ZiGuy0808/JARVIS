import { useState } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface TextInputProps {
  onSubmit: (text: string) => void;
  disabled?: boolean;
}

export function TextInput({ onSubmit, disabled }: TextInputProps) {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() && !disabled) {
      onSubmit(text.trim());
      setText('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 w-full">
      <Input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type your message to Jarvis..."
        disabled={disabled}
        className="flex-1 bg-card/40 border-primary/20 backdrop-blur-lg"
        data-testid="input-message"
      />
      <Button
        type="submit"
        disabled={disabled || !text.trim()}
        size="icon"
        className="bg-primary/20 hover:bg-primary/30 border border-primary/50"
        data-testid="button-send-message"
      >
        <Send className="w-5 h-5 text-primary" />
      </Button>
    </form>
  );
}
