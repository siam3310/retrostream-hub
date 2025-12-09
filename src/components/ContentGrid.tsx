import { MovieOrSeries } from '@/lib/types';
import { ContentCard } from './ContentCard';

interface ContentGridProps {
  items: MovieOrSeries[];
  loading?: boolean;
}

export const ContentGrid = ({ items, loading }: ContentGridProps) => {
  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="border-2 border-foreground">
            <div className="aspect-[2/3] animate-pulse bg-muted" />
            <div className="border-t-2 border-foreground p-3">
              <div className="h-5 w-3/4 animate-pulse bg-muted" />
              <div className="mt-2 h-4 w-1/2 animate-pulse bg-muted" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="border-2 border-foreground p-8 text-center">
        <p className="text-muted-foreground">No content found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
      {items.map((item) => (
        <ContentCard key={item.id} item={item} />
      ))}
    </div>
  );
};
