import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { MovieOrSeries, VideoSource, DownloadLink } from '@/lib/types';

const AdminEdit = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    title: '',
    year: '',
    type: 'Movie',
    category: '',
    description: '',
    posterUrl: '',
    backdropUrl: '',
    rating: '',
    genre: '',
    videoSources: '',
    downloadLinks: '',
    featured: false,
  });

  useEffect(() => {
    const fetchItem = async () => {
      const { data } = await supabase
        .from('moviesandseries')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();

      if (data) {
        const item = data as unknown as MovieOrSeries;
        setForm({
          title: item.title || '',
          year: item.year?.toString() || '',
          type: item.type || 'Movie',
          category: item.category || '',
          description: item.description || '',
          posterUrl: item.posterUrl || '',
          backdropUrl: item.backdropUrl || '',
          rating: item.rating || '',
          genre: item.genre?.join(', ') || '',
          videoSources: item.videoSources?.map((v: VideoSource) => `${v.name}|${v.url}`).join('\n') || '',
          downloadLinks: item.downloadLinks?.map((d: DownloadLink) => `${d.quality}|${d.url}`).join('\n') || '',
          featured: item.featured || false,
        });
      }
      setLoading(false);
    };
    fetchItem();
  }, [slug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const videoSources = form.videoSources
      ? form.videoSources.split('\n').map((line, i) => {
          const [name, url] = line.split('|').map(s => s.trim());
          return { name: name || `Server ${i + 1}`, url: url || name, type: 'video' };
        })
      : [];

    const downloadLinks = form.downloadLinks
      ? form.downloadLinks.split('\n').map((line) => {
          const [quality, url] = line.split('|').map(s => s.trim());
          return { quality: quality || 'Download', url: url || quality, size: '' };
        })
      : [];

    const { error } = await supabase
      .from('moviesandseries')
      .update({
        title: form.title,
        year: parseInt(form.year) || null,
        type: form.type,
        category: form.category || null,
        description: form.description || null,
        posterUrl: form.posterUrl || null,
        backdropUrl: form.backdropUrl || null,
        rating: form.rating || null,
        genre: form.genre.split(',').map(g => g.trim()).filter(Boolean),
        videoSources: videoSources.length > 0 ? videoSources : null,
        downloadLinks: downloadLinks.length > 0 ? downloadLinks : null,
        featured: form.featured,
      })
      .eq('slug', slug);

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Updated successfully' });
      navigate('/admin/media');
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Edit Content" description="Loading...">
        <div className="animate-pulse h-96 bg-muted" />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Edit Content" description="Update the movie or series details.">
      <form onSubmit={handleSubmit} className="max-w-2xl space-y-4">
        <Input
          placeholder="Title *"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
          className="border-2 border-foreground"
        />
        <div className="grid grid-cols-2 gap-4">
          <Input
            placeholder="Year"
            value={form.year}
            onChange={(e) => setForm({ ...form, year: e.target.value })}
            className="border-2 border-foreground"
          />
          <select
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
            className="w-full border-2 border-foreground bg-background p-2"
          >
            <option value="Movie">Movie</option>
            <option value="Series">Series</option>
          </select>
        </div>
        <Input
          placeholder="Category (e.g., Bangla, Hindi, Hindi-Dub)"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          className="border-2 border-foreground"
        />
        <Input
          placeholder="Genre (comma separated: Action, Drama, Comedy)"
          value={form.genre}
          onChange={(e) => setForm({ ...form, genre: e.target.value })}
          className="border-2 border-foreground"
        />
        <Input
          placeholder="Rating (e.g., 7.5/10)"
          value={form.rating}
          onChange={(e) => setForm({ ...form, rating: e.target.value })}
          className="border-2 border-foreground"
        />
        <Input
          placeholder="Poster URL"
          value={form.posterUrl}
          onChange={(e) => setForm({ ...form, posterUrl: e.target.value })}
          className="border-2 border-foreground"
        />
        <Input
          placeholder="Backdrop URL"
          value={form.backdropUrl}
          onChange={(e) => setForm({ ...form, backdropUrl: e.target.value })}
          className="border-2 border-foreground"
        />
        <Textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="border-2 border-foreground"
        />
        <Textarea
          placeholder="Video Sources (one per line: Name|URL)"
          value={form.videoSources}
          onChange={(e) => setForm({ ...form, videoSources: e.target.value })}
          className="border-2 border-foreground"
        />
        <Textarea
          placeholder="Download Links (one per line: Quality|URL)"
          value={form.downloadLinks}
          onChange={(e) => setForm({ ...form, downloadLinks: e.target.value })}
          className="border-2 border-foreground"
        />
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(e) => setForm({ ...form, featured: e.target.checked })}
          />
          Featured
        </label>
        <div className="flex gap-4">
          <Button type="button" variant="outline" onClick={() => navigate('/admin/media')}>
            Cancel
          </Button>
          <Button type="submit" className="flex-1 border-2 border-foreground">
            Update Content
          </Button>
        </div>
      </form>
    </AdminLayout>
  );
};

export default AdminEdit;
