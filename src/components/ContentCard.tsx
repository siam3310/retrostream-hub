import { Link } from 'react-router-dom';
import { MovieOrSeries } from '@/lib/types';
import { Badge } from '@/components/ui/badge';

interface ContentCardProps {
  item: MovieOrSeries;
}

export const ContentCard = ({ item }: ContentCardProps) => {
  const path = item.type === 'Series' ? `/series/${item.slug}` : `/movies/${item.slug}`;

  return (
    <Link to={path} className="group block">
      <div className="overflow-hidden border-2 border-foreground transition-all hover:shadow-md">
        <div className="aspect-[2/3] bg-muted">
          {item.posterUrl ? (
            <img
              src={item.posterUrl}
              alt={item.title || 'Content poster'}
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-muted-foreground">
              No Image
            </div>
          )}
        </div>
        <div className="border-t-2 border-foreground p-3">
          <h3 className="truncate font-bold">{item.title || 'Untitled'}</h3>
          <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
            {item.year && <span>{item.year}</span>}
            {item.type && (
              <Badge variant="outline" className="border-foreground text-xs">
                {item.type}
              </Badge>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};
