import { useState } from 'react';
import { ChevronDown, ChevronUp, Radio } from 'lucide-react';
import { LiveMatch, StreamLink } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface MatchCardProps {
  match: LiveMatch;
  onSelectStream: (url: string) => void;
}

export const MatchCard = ({ match, onSelectStream }: MatchCardProps) => {
  const [expanded, setExpanded] = useState(false);

  const formatTime = (time: string | null) => {
    if (!time) return 'TBD';
    return new Date(time).toLocaleString();
  };

  const getStatusColor = () => {
    switch (match.status) {
      case 'live':
        return 'bg-destructive text-destructive-foreground';
      case 'upcoming':
        return 'bg-muted text-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="border-2 border-foreground">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between p-4 text-left hover:bg-muted/50"
      >
        <div className="flex flex-1 items-center gap-4">
          <div className="flex items-center gap-2">
            {match.team1_logo ? (
              <img src={match.team1_logo} alt={match.team1_name} className="h-8 w-8 object-contain" />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center border border-foreground text-xs">
                {match.team1_name.charAt(0)}
              </div>
            )}
            <span className="font-bold">{match.team1_name}</span>
          </div>

          <span className="text-muted-foreground">vs</span>

          <div className="flex items-center gap-2">
            <span className="font-bold">{match.team2_name}</span>
            {match.team2_logo ? (
              <img src={match.team2_logo} alt={match.team2_name} className="h-8 w-8 object-contain" />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center border border-foreground text-xs">
                {match.team2_name.charAt(0)}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Badge className={getStatusColor()}>
            {match.status === 'live' && <Radio className="mr-1 h-3 w-3 animate-pulse" />}
            {match.status?.toUpperCase() || 'N/A'}
          </Badge>
          {expanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </div>
      </button>

      {expanded && (
        <div className="border-t-2 border-foreground p-4">
          <div className="mb-4 text-sm text-muted-foreground">
            {match.tournament && <p>Tournament: {match.tournament}</p>}
            <p>Start Time: {formatTime(match.start_time)}</p>
          </div>

          {match.stream_links && match.stream_links.length > 0 ? (
            <div className="space-y-2">
              <p className="font-bold">Stream Links:</p>
              <div className="flex flex-wrap gap-2">
                {match.stream_links.map((link: StreamLink, index: number) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="border-2 border-foreground"
                    onClick={() => link.url && onSelectStream(link.url)}
                  >
                    {link.name || `Stream ${index + 1}`}
                  </Button>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground">No stream links available</p>
          )}
        </div>
      )}
    </div>
  );
};
