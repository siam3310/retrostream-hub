import { Link } from 'react-router-dom';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { useWatchLater } from '@/contexts/WatchLaterContext';
import { Header } from '@/components/Header';
import { ContentCard } from '@/components/ContentCard';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

const WatchLater = () => {
  const { watchLater, removeFromWatchLater } = useWatchLater();

  const handleRemove = (id: string, title: string | null) => {
    removeFromWatchLater(id);
    toast({ title: `Removed "${title || 'Item'}" from Watch Later` });
  };

  return (
    <div className="min-h-screen bg-background">
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
          <div className="border-2 border-foreground p-8 text-center">
            <p className="text-muted-foreground">Your watch later list is empty</p>
            <Link to="/">
              <Button className="mt-4 border-2 border-foreground" variant="outline">
                Browse Content
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {watchLater.map((item) => (
              <div key={item.id} className="relative">
                <ContentCard item={item} />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute right-2 top-2 border-2 border-foreground"
                  onClick={() => handleRemove(item.id, item.title)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default WatchLater;
