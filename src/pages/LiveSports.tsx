import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { LiveMatch } from '@/lib/types';
import { Header } from '@/components/Header';
import { MatchCard } from '@/components/MatchCard';

const LiveSports = () => {
  const [matches, setMatches] = useState<LiveMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeStreamUrl, setActiveStreamUrl] = useState<string | null>(null);

  useEffect(() => {
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

    fetchMatches();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-4xl px-4 py-6">
        <h1 className="mb-6 border-b-2 border-foreground pb-2 text-center text-2xl font-bold">
          Live Sports
        </h1>

        {activeStreamUrl && (
          <div className="mb-6">
            <div className="aspect-video border-2 border-foreground">
              <iframe
                src={activeStreamUrl}
                className="h-full w-full"
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              />
            </div>
            <button
              onClick={() => setActiveStreamUrl(null)}
              className="mt-2 border-2 border-foreground px-4 py-2 hover:bg-muted"
            >
              Close Player
            </button>
          </div>
        )}

        <h2 className="mb-4 text-xl font-bold">Matches</h2>

        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 animate-pulse border-2 border-foreground bg-muted" />
            ))}
          </div>
        ) : matches.length === 0 ? (
          <div className="border-2 border-foreground p-8 text-center">
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
