import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, Download } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { MovieOrSeries } from '@/lib/types';
import { useWatchLater } from '@/contexts/WatchLaterContext';
import { Header } from '@/components/Header';
import { VideoPlayer } from '@/components/VideoPlayer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';

const SeriesDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [series, setSeries] = useState<MovieOrSeries | null>(null);
  const [loading, setLoading] = useState(true);
  const { addToWatchLater, removeFromWatchLater, isInWatchLater } = useWatchLater();

  useEffect(() => {
    const fetchSeries = async () => {
      if (!slug) return;
      setLoading(true);
      const { data } = await supabase
        .from('moviesandseries')
        .select('*')
        .eq('slug', slug)
        .eq('type', 'Series')
        .maybeSingle();

      if (data) {
        setSeries(data as unknown as MovieOrSeries);
      }
      setLoading(false);
    };

    fetchSeries();
  }, [slug]);

  const handleWatchLater = () => {
    if (!series) return;
    if (isInWatchLater(series.id)) {
      removeFromWatchLater(series.id);
      toast({ title: 'Removed from Watch Later' });
    } else {
      addToWatchLater(series);
      toast({ title: 'Added to Watch Later' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="mx-auto max-w-4xl px-4 py-6">
          <div className="animate-pulse space-y-4">
            <div className="aspect-video bg-muted" />
            <div className="h-8 w-1/2 bg-muted" />
            <div className="h-4 w-3/4 bg-muted" />
          </div>
        </main>
      </div>
    );
  }

  if (!series) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="mx-auto max-w-4xl px-4 py-6">
          <div className="border-2 border-foreground p-8 text-center">
            <h1 className="text-2xl font-bold">Series Not Found</h1>
            <p className="mt-2 text-muted-foreground">
              The series you're looking for doesn't exist.
            </p>
            <Link to="/series">
              <Button className="mt-4 border-2 border-foreground" variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Series
              </Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-4xl px-4 py-6">
        <Link to="/series" className="mb-4 inline-flex items-center gap-2 hover:underline">
          <ArrowLeft className="h-4 w-4" />
          Back to Series
        </Link>

        <VideoPlayer sources={series.videoSources} poster={series.backdropUrl} />

        <div className="mt-6 space-y-4">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold md:text-3xl">{series.title}</h1>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                {series.year && (
                  <Badge variant="outline" className="border-foreground">
                    {series.year}
                  </Badge>
                )}
                {series.rating && (
                  <Badge variant="outline" className="border-foreground">
                    ★ {series.rating}
                  </Badge>
                )}
                {series.genre?.map((g) => (
                  <Badge key={g} variant="outline" className="border-foreground">
                    {g}
                  </Badge>
                ))}
              </div>
            </div>
            <Button
              variant={isInWatchLater(series.id) ? 'default' : 'outline'}
              className="border-2 border-foreground"
              onClick={handleWatchLater}
            >
              <Clock className="mr-2 h-4 w-4" />
              {isInWatchLater(series.id) ? 'In Watch Later' : 'Watch Later'}
            </Button>
          </div>

          {series.description && (
            <p className="text-muted-foreground">{series.description}</p>
          )}

          {series.downloadLinks && series.downloadLinks.length > 0 && (
            <div className="border-2 border-foreground p-4">
              <h3 className="mb-3 font-bold">Download Links</h3>
              <div className="flex flex-wrap gap-2">
                {series.downloadLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 border-2 border-foreground px-3 py-2 hover:bg-muted"
                  >
                    <Download className="h-4 w-4" />
                    {link.quality}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default SeriesDetail;
