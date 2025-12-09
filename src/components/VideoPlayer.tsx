import { useState } from 'react';
import { VideoSource } from '@/lib/types';
import { Button } from '@/components/ui/button';

interface VideoPlayerProps {
  sources: VideoSource[] | null;
  poster?: string | null;
}

export const VideoPlayer = ({ sources, poster }: VideoPlayerProps) => {
  const [selectedSource, setSelectedSource] = useState(0);

  if (!sources || sources.length === 0) {
    return (
      <div className="aspect-video border-2 border-foreground bg-muted">
        <div className="flex h-full w-full items-center justify-center">
          <p className="text-muted-foreground">No video source available</p>
        </div>
      </div>
    );
  }

  const currentSource = sources[selectedSource];

  return (
    <div className="space-y-4">
      <div className="aspect-video border-2 border-foreground bg-muted">
        {currentSource?.url ? (
          <iframe
            src={currentSource.url}
            className="h-full w-full"
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <p className="text-muted-foreground">Invalid video source</p>
          </div>
        )}
      </div>

      {sources.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {sources.map((source, index) => (
            <Button
              key={index}
              variant={index === selectedSource ? 'default' : 'outline'}
              size="sm"
              className="border-2 border-foreground"
              onClick={() => setSelectedSource(index)}
            >
              {source.name || `Source ${index + 1}`}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};
