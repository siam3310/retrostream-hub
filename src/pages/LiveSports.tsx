import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { LiveMatch } from '@/lib/types';
import { Header } from '@/components/Header';
import { MatchCard } from '@/components/MatchCard';

const LiveSports = () => {
  const [matches, setMatches] = useState<LiveMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeStreamUrl, setActiveStreamUrl] = useState<string | null>(null);

  const fetchMatches = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('live_matches')
      .select('*')
      .in('status', ['live', 'upcoming'])
      .order('start_time', { ascending: true });

    if (data) {
      setMatches(data as unknown as LiveMatch[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMatches();

    // Set up realtime subscription for live_matches
    const channel = supabase
      .channel('live-matches-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'live_matches',
        },
        (payload) => {
          console.log('Realtime change:', payload);
          fetchMatches();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-4xl px-4 py-6">
        {activeStreamUrl && (
          <div className="mb-6">
            <div className="aspect-video border-2 border-foreground rounded-md overflow-hidden">
              <iframe
                src={activeStreamUrl}
                className="h-full w-full"
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              />
            </div>
            <button
              onClick={() => setActiveStreamUrl(null)}
              className="mt-2 border-2 border-foreground px-4 py-2 hover:bg-muted rounded-md"
            >
              Close Player
            </button>
          </div>
        )}

        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 animate-pulse border-2 border-foreground bg-muted rounded-md" />
            ))}
          </div>
        ) : matches.length === 0 ? (
          <div className="border-2 border-foreground p-8 text-center rounded-md">
            <p className="text-muted-foreground">No matches available</p>
          </div>
        ) : (
          <div className="space-y-6">
            {matches.map((match) => (
              <MatchCard
                key={match.id}
                match={match}
                onSelectStream={setActiveStreamUrl}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default LiveSports;
