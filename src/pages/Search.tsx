import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { MovieOrSeries } from '@/lib/types';
import { Header } from '@/components/Header';
import { ContentGrid } from '@/components/ContentGrid';

const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState<MovieOrSeries[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const search = async () => {
      if (!query.trim()) {
        setResults([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      const { data } = await supabase
        .from('moviesandseries')
        .select('*')
        .ilike('title', `%${query}%`)
        .order('dateAdded', { ascending: false });

      if (data) {
        setResults(data as unknown as MovieOrSeries[]);
      }
      setLoading(false);
    };

    search();
  }, [query]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-4xl px-4 py-6">
        <Link to="/" className="mb-4 inline-flex items-center gap-2 hover:underline">
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <h1 className="mb-6 border-b-2 border-foreground pb-2 text-2xl font-bold">
          Search Results for "{query}"
        </h1>

        {!query.trim() ? (
          <div className="border-2 border-foreground p-8 text-center">
            <p className="text-muted-foreground">Enter a search term to find content</p>
          </div>
        ) : (
          <>
            <p className="mb-4 text-muted-foreground">
              Found {results.length} result{results.length !== 1 ? 's' : ''}
            </p>
            <ContentGrid items={results} loading={loading} />
          </>
        )}
      </main>
    </div>
  );
};

export default Search;
