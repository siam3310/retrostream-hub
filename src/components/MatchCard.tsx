import { useState } from 'react';
import { Radio } from 'lucide-react';
import { LiveMatch, StreamLink } from '@/lib/types';
import { Button } from '@/components/ui/button';

interface MatchCardProps {
  match: LiveMatch;
  onSelectStream: (url: string) => void;
}

export const MatchCard = ({ match, onSelectStream }: MatchCardProps) => {
  const [expanded, setExpanded] = useState(false);

  const formatTime = (time: string | null) => {
    if (!time) return 'TBD';
    return new Date(time).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const isLive = match.status === 'live';

  return (
    <div className="relative border-2 border-foreground">
      {/* Status indicator on top border center */}
      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
        {isLive ? (
          <div className="flex items-center gap-1 bg-destructive px-3 py-0.5 text-xs font-bold text-destructive-foreground">
            <Radio className="h-3 w-3 animate-pulse" />
            LIVE
          </div>
        ) : (
          match.start_time && (
            <div className="bg-background px-3 py-0.5 text-xs text-muted-foreground border border-foreground">
              {formatTime(match.start_time)}
            </div>
          )
        )}
      </div>

      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full flex-col items-center p-4 pt-6 text-center hover:bg-muted/50"
      >
        <div className="flex items-center justify-center gap-4">
          <div className="flex flex-col items-center gap-2">
            {match.team1_logo ? (
              <img src={match.team1_logo} alt={match.team1_name} className="h-10 w-10 object-contain" />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center border border-foreground text-sm">
                {match.team1_name.charAt(0)}
              </div>
            )}
            <span className="font-bold">{match.team1_name}</span>
          </div>

          <div className="flex flex-col items-center">
            <span className="text-lg font-bold">vs</span>
            {match.tournament && (
              <span className="text-xs text-muted-foreground">{match.tournament}</span>
            )}
          </div>

          <div className="flex flex-col items-center gap-2">
            {match.team2_logo ? (
              <img src={match.team2_logo} alt={match.team2_name} className="h-10 w-10 object-contain" />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center border border-foreground text-sm">
                {match.team2_name.charAt(0)}
              </div>
            )}
            <span className="font-bold">{match.team2_name}</span>
          </div>
        </div>
      </button>

      {expanded && (
        <div className="border-t-2 border-foreground p-4">
          {match.stream_links && match.stream_links.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {match.stream_links.map((link: StreamLink, index: number) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="flex-1 border-2 border-foreground"
                  onClick={() => link.url && onSelectStream(link.url)}
                >
                  {link.name || `Server ${index + 1}`}
                </Button>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground">No stream links available</p>
          )}
        </div>
      )}
    </div>
  );
};
