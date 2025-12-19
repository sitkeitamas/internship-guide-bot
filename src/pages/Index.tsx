import { useState, useRef, useEffect } from 'react';
import { useChat } from '@/hooks/useChat';
import { ChatMessage } from '@/components/ChatMessage';
import { ChatInput } from '@/components/ChatInput';
import { UrlInput } from '@/components/UrlInput';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { GraduationCap, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Index() {
  const [context, setContext] = useState('');
  const [isLoadingUrl, setIsLoadingUrl] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const { messages, isLoading, sendMessage, clearMessages } = useChat(context);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleLoadUrl = async (url: string) => {
    setIsLoadingUrl(true);
    try {
      const { data, error } = await supabase.functions.invoke('scrape-regulations', {
        body: { url },
      });

      if (error) throw error;

      const markdown = data?.data?.markdown || data?.markdown;
      if (markdown) {
        setContext(markdown);
        setIsLoaded(true);
        toast({
          title: 'Regulations loaded',
          description: 'You can now ask questions about the internship requirements.',
        });
      } else {
        throw new Error('No content found');
      }
    } catch (error) {
      console.error('Error loading URL:', error);
      toast({
        title: 'Failed to load',
        description: 'Could not fetch the regulations. Please check the URL.',
        variant: 'destructive',
      });
    } finally {
      setIsLoadingUrl(false);
    }
  };

  const handleClear = () => {
    clearMessages();
    setContext('');
    setIsLoaded(false);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-semibold text-foreground">Internship Assistant</h1>
              <p className="text-xs text-muted-foreground">University regulations chatbot</p>
            </div>
          </div>
          {(messages.length > 0 || isLoaded) && (
            <Button variant="ghost" size="sm" onClick={handleClear}>
              <Trash2 className="w-4 h-4 mr-2" />
              Clear
            </Button>
          )}
        </div>
      </header>

      {/* URL Input */}
      <div className="border-b border-border px-6 py-4 bg-muted/30">
        <div className="max-w-3xl mx-auto">
          <UrlInput onLoad={handleLoadUrl} isLoading={isLoadingUrl} isLoaded={isLoaded} />
        </div>
      </div>

      {/* Chat Area */}
      <main className="flex-1 overflow-auto px-6 py-4">
        <div className="max-w-3xl mx-auto">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[50vh] text-center">
              <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
                <GraduationCap className="w-8 h-8 text-muted-foreground" />
              </div>
              <h2 className="text-lg font-medium text-foreground mb-2">
                {isLoaded ? 'Ready to help!' : 'Load your regulations'}
              </h2>
              <p className="text-sm text-muted-foreground max-w-md">
                {isLoaded 
                  ? 'Ask any question about internship requirements, procedures, or documentation.'
                  : 'Paste the URL to your university\'s internship regulations above to get started.'}
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              {messages.map((msg, i) => (
                <ChatMessage key={i} role={msg.role} content={msg.content} />
              ))}
              {isLoading && messages[messages.length - 1]?.role === 'user' && (
                <div className="flex gap-3 py-4">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                    <div className="w-2 h-2 bg-primary-foreground rounded-full animate-pulse" />
                  </div>
                  <div className="bg-secondary rounded-2xl px-4 py-3">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </main>

      {/* Input Area */}
      <footer className="border-t border-border px-6 py-4 bg-background">
        <div className="max-w-3xl mx-auto">
          <ChatInput onSend={sendMessage} isLoading={isLoading} disabled={!isLoaded} />
        </div>
      </footer>
    </div>
  );
}
