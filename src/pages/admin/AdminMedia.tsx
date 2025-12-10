import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Edit, Trash2, Star, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { MovieOrSeries } from '@/lib/types';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

const AdminMedia = () => {
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

  return (
    <AdminLayout title="Manage Media" description="Edit, delete, or toggle featured status.">
      <div className="mb-4 flex justify-end">
        <Link to="/admin/add">
          <Button className="border-2 border-foreground">
            <Plus className="mr-2 h-4 w-4" /> Add Content
          </Button>
        </Link>
      </div>
      
      {loading ? (
        <p>Loading...</p>
      ) : media.length === 0 ? (
        <p className="text-muted-foreground">No content found. Add some!</p>
      ) : (
        <div className="border-2 border-foreground">
          <div className="grid grid-cols-[1fr_100px_80px_120px] gap-4 border-b-2 border-foreground bg-muted p-3 font-bold">
            <span>Title</span>
            <span>Type</span>
            <span>Year</span>
            <span className="text-right">Actions</span>
          </div>
          {media.map((item) => (
            <div key={item.id} className="grid grid-cols-[1fr_100px_80px_120px] gap-4 border-b border-border p-3 items-center">
              <div className="flex items-center gap-2">
                <span className="font-medium">{item.title}</span>
                {item.featured && <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />}
              </div>
              <span className="text-muted-foreground">{item.type}</span>
              <span className="text-muted-foreground">{item.year}</span>
              <div className="flex justify-end gap-1">
                <Button size="icon" variant="ghost" onClick={() => toggleFeatured(item)} title="Toggle Featured">
                  <Star className={`h-4 w-4 ${item.featured ? 'fill-yellow-500 text-yellow-500' : ''}`} />
                </Button>
                <Link to={`/admin/edit/${item.slug}`}>
                  <Button size="icon" variant="ghost" title="Edit"><Edit className="h-4 w-4" /></Button>
                </Link>
                <Button size="icon" variant="ghost" onClick={() => deleteItem(item.id)} title="Delete">
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminMedia;
