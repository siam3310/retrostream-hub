import { Link } from 'react-router-dom';
import { MovieOrSeries } from '@/lib/types';
import { Badge } from '@/components/ui/badge';

interface ContentCardProps {
  item: MovieOrSeries;
}

const getCategoryColor = (category: string | null) => {
  switch (category) {
    case 'Bangla':
      return 'bg-emerald-600 text-white border-emerald-600';
    case 'Hindi':
      return 'bg-orange-600 text-white border-orange-600';
    case 'Hindi-Dub':
      return 'bg-sky-600 text-white border-sky-600';
    case 'Bangla-Dub':
      return 'bg-violet-600 text-white border-violet-600';
    default:
      return 'bg-muted text-foreground border-foreground';
  }
};

export const ContentCard = ({ item }: ContentCardProps) => {
  const path = item.type === 'Series' ? `/series/${item.slug}` : `/movies/${item.slug}`;

  return (
    <Link to={path} className="group block">
      <div className="overflow-hidden border-2 border-foreground transition-all hover:shadow-md">
        <div className="relative aspect-[2/3] bg-muted">
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
          {item.category && (
            <Badge 
              className={`absolute right-2 top-2 ${getCategoryColor(item.category)}`}
            >
              {item.category}
            </Badge>
          )}
        </div>
        <div className="border-t-2 border-foreground p-3">
          <h3 className="truncate font-bold">{item.title || 'Untitled'}</h3>
          <p className="text-sm text-muted-foreground">{item.year || '-'}</p>
        </div>
      </div>
    </Link>
  );
};
