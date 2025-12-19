import { cn } from '@/lib/utils';
import { User, Bot } from 'lucide-react';

type ChatMessageProps = {
  role: 'user' | 'assistant';
  content: string;
};

export function ChatMessage({ role, content }: ChatMessageProps) {
  const isUser = role === 'user';

  return (
    <div className={cn(
      'flex gap-3 py-4',
      isUser ? 'justify-end' : 'justify-start'
    )}>
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
          <Bot className="w-4 h-4 text-primary-foreground" />
        </div>
      )}
      <div className={cn(
        'max-w-[80%] rounded-2xl px-4 py-3',
        isUser 
          ? 'bg-primary text-primary-foreground' 
          : 'bg-secondary text-secondary-foreground'
      )}>
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{content}</p>
      </div>
      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center">
          <User className="w-4 h-4 text-muted-foreground" />
        </div>
      )}
    </div>
  );
}
