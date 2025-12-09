import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { MovieOrSeries } from '@/lib/types';
import { Header } from '@/components/Header';
import { ContentGrid } from '@/components/ContentGrid';

const Movies = () => {
  const [movies, setMovies] = useState<MovieOrSeries[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      const { data } = await supabase
        .from('moviesandseries')
        .select('*')
        .eq('type', 'Movie')
        .order('dateAdded', { ascending: false });

      if (data) {
        setMovies(data as unknown as MovieOrSeries[]);
      }
      setLoading(false);
    };

    fetchMovies();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-4xl px-4 py-6">
        <h1 className="mb-6 border-b-2 border-foreground pb-2 text-2xl font-bold">Movies</h1>
        <ContentGrid items={movies} loading={loading} />
      </main>
    </div>
  );
};

export default Movies;
