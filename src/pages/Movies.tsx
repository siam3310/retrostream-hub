import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { MovieOrSeries } from '@/lib/types';
import { Header } from '@/components/Header';
import { ContentGrid } from '@/components/ContentGrid';
import { SEO } from '@/components/SEO';

const CATEGORIES = ['All', 'Bangla', 'Hindi', 'Hindi-Dub', 'Bangla-Dub'];

const Movies = () => {
  const [movies, setMovies] = useState<MovieOrSeries[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      let query = supabase
        .from('moviesandseries')
        .select('*')
        .eq('type', 'Movie')
        .order('dateAdded', { ascending: false });

      if (activeCategory !== 'All') {
        query = query.eq('category', activeCategory);
      }

      const { data } = await query;

      if (data) {
        setMovies(data as unknown as MovieOrSeries[]);
      }
      setLoading(false);
    };

    fetchMovies();
  }, [activeCategory]);

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Movies"
        description="Browse and watch free movies online. Enjoy Bangla, Hindi, and dubbed movies with high-quality streaming on black&white-tv."
        keywords="movies, free movies, bangla movies, hindi movies, dubbed movies, watch movies online"
      />
      <Header />
      <main className="mx-auto max-w-4xl px-4 py-6">
        <h1 className="mb-6 text-center text-2xl font-bold">Movies</h1>
        
        <div className="mb-6 flex flex-wrap justify-center gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`rounded-lg border-2 border-foreground px-4 py-2 text-sm transition-colors ${
                activeCategory === cat
                  ? 'bg-foreground text-background'
                  : 'bg-background text-foreground hover:bg-muted'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <ContentGrid items={movies} loading={loading} />
      </main>
    </div>
  );
};

export default Movies;
