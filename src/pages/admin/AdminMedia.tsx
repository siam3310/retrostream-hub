import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2, Star } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { MovieOrSeries } from '@/lib/types';
import { useAdmin } from '@/contexts/AdminContext';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

const AdminMedia = () => {
  const { isAuthenticated } = useAdmin();
  const [media, setMedia] = useState<MovieOrSeries[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMedia = async () => {
    setLoading(true);
    const { data } = await supabase.from('moviesandseries').select('*').order('dateAdded', { ascending: false });
    if (data) setMedia(data as unknown as MovieOrSeries[]);
    setLoading(false);
  };

  useEffect(() => { fetchMedia(); }, []);

  const toggleFeatured = async (item: MovieOrSeries) => {
    await supabase.from('moviesandseries').update({ featured: !item.featured }).eq('id', item.id);
    toast({ title: `${item.featured ? 'Unfeatured' : 'Featured'} ${item.title}` });
    fetchMedia();
  };

  const deleteItem = async (id: string) => {
    if (!confirm('Delete this item?')) return;
    await supabase.from('moviesandseries').delete().eq('id', id);
    toast({ title: 'Deleted' });
    fetchMedia();
  };

  if (!isAuthenticated) return <Navigate to="/admin/login" />;

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="mx-auto max-w-4xl">
        <Link to="/admin" className="mb-4 inline-flex items-center gap-2 hover:underline">
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </Link>
        <h1 className="mb-6 border-b-2 border-foreground pb-2 text-2xl font-bold">Manage Media</h1>
        {loading ? <p>Loading...</p> : (
          <div className="space-y-2">
            {media.map((item) => (
              <div key={item.id} className="flex items-center justify-between border-2 border-foreground p-3">
                <div>
                  <span className="font-bold">{item.title}</span>
                  <span className="ml-2 text-muted-foreground">{item.type} • {item.year}</span>
                  {item.featured && <Star className="ml-2 inline h-4 w-4 text-yellow-500" />}
                </div>
                <div className="flex gap-2">
                  <Button size="icon" variant="outline" onClick={() => toggleFeatured(item)}><Star className="h-4 w-4" /></Button>
                  <Link to={`/admin/edit/${item.slug}`}><Button size="icon" variant="outline"><Edit className="h-4 w-4" /></Button></Link>
                  <Button size="icon" variant="destructive" onClick={() => deleteItem(item.id)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminMedia;
