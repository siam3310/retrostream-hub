import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';

const AdminAdd = () => {
  const navigate = useNavigate();
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
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const id = crypto.randomUUID();
    const slug = form.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const videoSources = form.videoSources
      ? form.videoSources.split('\n').map((line, i) => {
          const [name, url] = line.split('|').map(s => s.trim());
          return { name: name || `Server ${i + 1}`, url: url || name };
        })
      : [];

    const downloadLinks = form.downloadLinks
      ? form.downloadLinks.split('\n').map((line, i) => {
          const [name, url] = line.split('|').map(s => s.trim());
          return { name: name || `Download ${i + 1}`, url: url || name };
        })
      : [];

    const { error } = await supabase.from('moviesandseries').insert({
      id,
      slug,
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
      featured: false,
    });

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Added successfully' });
      navigate('/admin/media');
    }
  };

  return (
    <AdminLayout title="Add Content" description="Add a new movie or series.">
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
          placeholder="Rating (e.g., 7.5)"
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
          placeholder="Download Links (one per line: Name|URL)"
          value={form.downloadLinks}
          onChange={(e) => setForm({ ...form, downloadLinks: e.target.value })}
          className="border-2 border-foreground"
        />
        <Button type="submit" className="w-full border-2 border-foreground">
          Add Content
        </Button>
      </form>
    </AdminLayout>
  );
};

export default AdminAdd;
