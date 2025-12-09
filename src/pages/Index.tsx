import { useEffect, useState, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { MovieOrSeries } from '@/lib/types';
import { Header } from '@/components/Header';
import { HeroCarousel } from '@/components/HeroCarousel';
import { ContentGrid } from '@/components/ContentGrid';
import { CreepyButton } from '@/components/CreepyButton';

const ITEMS_PER_PAGE = 12;

const Index = () => {
  const [featured, setFeatured] = useState<MovieOrSeries[]>([]);
  const [content, setContent] = useState<MovieOrSeries[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const observer = useRef<IntersectionObserver | null>(null);

  const lastElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loadingMore) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prev) => prev + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loadingMore, hasMore]
  );

  useEffect(() => {
    const fetchFeatured = async () => {
      const { data } = await supabase
        .from('moviesandseries')
        .select('*')
        .eq('featured', true)
        .order('dateAdded', { ascending: false })
        .limit(5);

      if (data) {
        setFeatured(data as unknown as MovieOrSeries[]);
      }
    };

    const fetchInitialContent = async () => {
      setLoading(true);
      const { data } = await supabase
        .from('moviesandseries')
        .select('*')
        .eq('featured', false)
        .order('dateAdded', { ascending: false })
        .range(0, ITEMS_PER_PAGE - 1);

      if (data) {
        setContent(data as unknown as MovieOrSeries[]);
        setHasMore(data.length === ITEMS_PER_PAGE);
      }
      setLoading(false);
    };

    fetchFeatured();
    fetchInitialContent();
  }, []);

  useEffect(() => {
    if (page === 0) return;

    const fetchMore = async () => {
      setLoadingMore(true);
      const from = page * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;

      const { data } = await supabase
        .from('moviesandseries')
        .select('*')
        .eq('featured', false)
        .order('dateAdded', { ascending: false })
        .range(from, to);

      if (data) {
        setContent((prev) => [...prev, ...(data as unknown as MovieOrSeries[])]);
        setHasMore(data.length === ITEMS_PER_PAGE);
      }
      setLoadingMore(false);
    };

    fetchMore();
  }, [page]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-4xl px-4 py-6">
        <HeroCarousel items={featured} />

        <div className="my-8 flex justify-center">
          <CreepyButton />
        </div>

        <section>
          <h2 className="mb-4 border-b-2 border-foreground pb-2 text-xl font-bold">
            Browse All
          </h2>
          <ContentGrid items={content} loading={loading} />
          {hasMore && !loading && (
            <div ref={lastElementRef} className="mt-8 flex justify-center">
              {loadingMore && (
                <div className="border-2 border-foreground px-4 py-2">Loading more...</div>
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Index;
