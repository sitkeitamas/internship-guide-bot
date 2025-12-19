import { useState, FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link, Loader2, Check } from 'lucide-react';

type UrlInputProps = {
  onLoad: (url: string) => Promise<void>;
  isLoading: boolean;
  isLoaded: boolean;
};

export function UrlInput({ onLoad, isLoading, isLoaded }: UrlInputProps) {
  const [url, setUrl] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (url.trim() && !isLoading) {
      await onLoad(url.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <div className="relative flex-1">
        <Link className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Paste university regulations URL..."
          disabled={isLoading}
          className="pl-10 bg-secondary border-0 focus-visible:ring-1 focus-visible:ring-primary"
        />
      </div>
      <Button type="submit" disabled={!url.trim() || isLoading} variant={isLoaded ? "secondary" : "default"}>
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : isLoaded ? (
          <>
            <Check className="w-4 h-4 mr-2" />
            Loaded
          </>
        ) : (
          'Load'
        )}
      </Button>
    </form>
  );
}
