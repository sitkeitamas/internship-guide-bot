import { useState, FormEvent, KeyboardEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send } from 'lucide-react';

type ChatInputProps = {
  onSend: (message: string) => void;
  isLoading: boolean;
  disabled?: boolean;
};

export function ChatInput({ onSend, isLoading, disabled }: ChatInputProps) {
  const [input, setInput] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading && !disabled) {
      onSend(input.trim());
      setInput('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 items-end">
      <Textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={disabled ? "Load regulations first..." : "Ask about internship requirements..."}
        disabled={isLoading || disabled}
        className="min-h-[52px] max-h-32 resize-none bg-secondary border-0 focus-visible:ring-1 focus-visible:ring-primary"
        rows={1}
      />
      <Button 
        type="submit" 
        size="icon" 
        disabled={!input.trim() || isLoading || disabled}
        className="h-[52px] w-[52px] shrink-0"
      >
        <Send className="w-4 h-4" />
      </Button>
    </form>
  );
}
