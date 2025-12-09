import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { MovieOrSeries } from '@/lib/types';
import { Header } from '@/components/Header';
import { ContentGrid } from '@/components/ContentGrid';

const Series = () => {
  const [series, setSeries] = useState<MovieOrSeries[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSeries = async () => {
      setLoading(true);
      const { data } = await supabase
        .from('moviesandseries')
        .select('*')
        .eq('type', 'Series')
        .order('dateAdded', { ascending: false });

      if (data) {
        setSeries(data as unknown as MovieOrSeries[]);
      }
      setLoading(false);
    };

    fetchSeries();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-4xl px-4 py-6">
        <h1 className="mb-6 border-b-2 border-foreground pb-2 text-2xl font-bold">Series</h1>
        <ContentGrid items={series} loading={loading} />
      </main>
    </div>
  );
};

export default Series;
