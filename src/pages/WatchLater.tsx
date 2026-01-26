import { Link } from 'react-router-dom';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { useWatchLater } from '@/contexts/WatchLaterContext';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { SEO } from '@/components/SEO';

const WatchLater = () => {
  const { watchLater, removeFromWatchLater } = useWatchLater();

  const handleRemove = (id: string, title: string | null) => {
    removeFromWatchLater(id);
    toast({ title: `Removed "${title || 'Item'}" from Watch Later` });
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Watch Later"
        description="Your saved movies and series to watch later on black&white-tv."
        keywords="watch later, saved movies, saved series, watchlist"
      />
      <Header />
      <main className="mx-auto max-w-4xl px-4 py-6">
        <Link to="/" className="mb-4 inline-flex items-center gap-2 hover:underline">
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <h1 className="mb-6 border-b-2 border-foreground pb-2 text-2xl font-bold">
          Watch Later ({watchLater.length})
        </h1>

        {watchLater.length === 0 ? (
          <div className="rounded-lg border-2 border-foreground p-8 text-center">
            <p className="text-muted-foreground">Your watch later list is empty</p>
            <Link to="/">
              <Button className="mt-4 rounded-lg border-2 border-foreground" variant="outline">
                Browse Content
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {watchLater.map((item) => {
              const path = item.type === 'Series' ? `/series/${item.slug}` : `/movies/${item.slug}`;
              return (
                <div
                  key={item.id}
                  className="flex items-center gap-4 rounded-lg border-2 border-foreground p-3"
                >
                  <Link to={path} className="shrink-0">
                    <div className="h-20 w-14 overflow-hidden rounded-md border border-foreground bg-muted">
                      {item.posterUrl ? (
                        <img
                          src={item.posterUrl}
                          alt={item.title || 'Poster'}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                          No Image
                        </div>
                      )}
                    </div>
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link to={path} className="hover:underline">
                      <h3 className="font-bold truncate">{item.title || 'Untitled'}</h3>
                    </Link>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{item.type || '-'}</span>
                      {item.year && <span>• {item.year}</span>}
                      {item.rating && <span>• ★ {item.rating}</span>}
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    className="shrink-0 rounded-lg border-2 border-foreground hover:bg-destructive hover:text-destructive-foreground"
                    onClick={() => handleRemove(item.id, item.title)}
                    aria-label="Remove from watch later"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default WatchLater;
