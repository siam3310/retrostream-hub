import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { MovieOrSeries } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface HeroCarouselProps {
  items: MovieOrSeries[];
}

export const HeroCarousel = ({ items }: HeroCarouselProps) => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (items.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % items.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [items.length]);

  if (items.length === 0) return null;

  const item = items[current];
  const path = item.type === 'Series' ? `/series/${item.slug}` : `/movies/${item.slug}`;

  const prev = () => setCurrent((c) => (c - 1 + items.length) % items.length);
  const next = () => setCurrent((c) => (c + 1) % items.length);

  return (
    <div className="relative border-2 border-foreground">
      <div className="aspect-video bg-muted md:aspect-[21/9]">
        {item.backdropUrl ? (
          <img
            src={item.backdropUrl}
            alt={item.title || 'Featured content'}
            className="h-full w-full object-cover"
          />
        ) : item.posterUrl ? (
          <img
            src={item.posterUrl}
            alt={item.title || 'Featured content'}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground">
            No Image Available
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8">
        <div className="flex flex-wrap items-center gap-2">
          {item.type && (
            <Badge variant="outline" className="border-foreground bg-background">
              {item.type}
            </Badge>
          )}
          {item.year && (
            <Badge variant="outline" className="border-foreground bg-background">
              {item.year}
            </Badge>
          )}
          {item.rating && (
            <Badge variant="outline" className="border-foreground bg-background">
              ★ {item.rating}
            </Badge>
          )}
        </div>
        <h2 className="mt-2 text-2xl font-bold md:text-4xl">{item.title || 'Untitled'}</h2>
        <p className="mt-2 line-clamp-2 max-w-xl text-sm text-muted-foreground md:text-base">
          {item.description}
        </p>
        <Link to={path}>
          <Button className="mt-4 border-2 border-foreground" variant="default">
            <Play className="mr-2 h-4 w-4" />
            Watch Now
          </Button>
        </Link>
      </div>

      {items.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-2 top-1/2 -translate-y-1/2 border-2 border-foreground bg-background/80"
            onClick={prev}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 border-2 border-foreground bg-background/80"
            onClick={next}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
          <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-2 md:bottom-4">
            {items.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-2 w-2 border border-foreground ${
                  i === current ? 'bg-foreground' : 'bg-transparent'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};
