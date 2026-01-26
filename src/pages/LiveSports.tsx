import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { LiveMatch } from '@/lib/types';
import { Header } from '@/components/Header';
import { MatchCard } from '@/components/MatchCard';
import { SEO } from '@/components/SEO';

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
      <SEO 
        title="Live Sports"
        description="Watch live sports streaming for free. Cricket, football, and more live matches available on black&white-tv."
        keywords="live sports, live streaming, cricket live, football live, free sports streaming, live matches"
      />
      <Header />
      <main className="mx-auto max-w-4xl px-4 py-6">
        {activeStreamUrl && (
          <div className="mb-6">
            <div className="aspect-video border-2 border-foreground rounded-lg overflow-hidden">
              <iframe
                src={activeStreamUrl}
                className="h-full w-full"
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              />
            </div>
            <div className="mt-2 flex justify-between">
              <button
                onClick={() => {
                  const currentUrl = activeStreamUrl;
                  setActiveStreamUrl(null);
                  setTimeout(() => setActiveStreamUrl(currentUrl), 100);
                }}
                className="border-2 border-foreground px-4 py-2 hover:bg-muted rounded-lg"
              >
                🔄 Refresh
              </button>
              <button
                onClick={() => setActiveStreamUrl(null)}
                className="border-2 border-foreground px-4 py-2 hover:bg-muted rounded-lg"
              >
                ✕ Close Player
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 animate-pulse rounded-lg border-2 border-foreground bg-muted" />
            ))}
          </div>
        ) : matches.length === 0 ? (
          <div className="rounded-lg border-2 border-foreground p-8 text-center">
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
