import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  VideoSourceManager,
  DownloadLinkManager,
  VideoSource,
  DownloadLink,
} from '@/components/admin/LinkManager';

const AdminAddManual = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [form, setForm] = useState({
    title: '',
    slug: '',
    year: new Date().getFullYear().toString(),
    type: 'Movie',
    category: '',
    description: '',
    posterUrl: '',
    backdropUrl: '',
    rating: '',
    genre: '',
    featured: false,
  });

  const [videoSources, setVideoSources] = useState<VideoSource[]>([
    { name: 'Server 1', url: '', type: 'iframe' }
  ]);

  const [downloadLinks, setDownloadLinks] = useState<DownloadLink[]>([]);

  useEffect(() => {
    // Pre-fill from URL params (from TMDB import)
    const title = searchParams.get('title');
    if (title) {
      setForm({
        title: title,
        slug: searchParams.get('slug') || '',
        year: searchParams.get('year') || new Date().getFullYear().toString(),
        type: searchParams.get('type') || 'Movie',
        category: searchParams.get('category') || '',
        description: searchParams.get('description') || '',
        posterUrl: searchParams.get('posterUrl') || '',
        backdropUrl: searchParams.get('backdropUrl') || '',
        rating: searchParams.get('rating') || '',
        genre: searchParams.get('genre') || '',
        featured: false,
      });
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const id = searchParams.get('tmdbId') || crypto.randomUUID();
    const slug = form.slug || form.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const insertData = {
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
      videoSources: videoSources.filter(v => v.url).length > 0 ? videoSources.filter(v => v.url) : null,
      downloadLinks: downloadLinks.filter(d => d.url).length > 0 ? downloadLinks.filter(d => d.url) : null,
      featured: form.featured,
    };

    const { error } = await supabase.from('moviesandseries').insert(insertData as any);

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Content created successfully' });
      navigate('/admin/media');
    }
  };

  return (
    <AdminLayout title="Add Content Manually" description="Fill out the form to add new content.">
      <form onSubmit={handleSubmit} className="max-w-4xl space-y-6">
        {/* Content Details */}
        <div className="border-2 border-foreground rounded-lg p-6 space-y-4">
          <h2 className="text-xl font-bold">Content Details</h2>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-bold">Title *</label>
              <Input
                placeholder="e.g., Panchayat Season 3"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
                className="border-2 border-foreground"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-bold">Slug (Optional)</label>
              <Input
                placeholder="e.g., panchayat-s3"
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                className="border-2 border-foreground"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-bold">Poster URL</label>
              <Input
                placeholder="Enter image URL"
                value={form.posterUrl}
                onChange={(e) => setForm({ ...form, posterUrl: e.target.value })}
                className="border-2 border-foreground"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-bold">Backdrop URL</label>
              <Input
                placeholder="Enter image URL"
                value={form.backdropUrl}
                onChange={(e) => setForm({ ...form, backdropUrl: e.target.value })}
                className="border-2 border-foreground"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="mb-1 block text-sm font-bold">Category</label>
              <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                <SelectTrigger className="border-2 border-foreground">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Bangla">Bangla</SelectItem>
                  <SelectItem value="Hindi">Hindi</SelectItem>
                  <SelectItem value="Hindi-Dub">Hindi-Dub</SelectItem>
                  <SelectItem value="Bangla-Dub">Bangla-Dub</SelectItem>
                  <SelectItem value="English">English</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-bold">Type</label>
              <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                <SelectTrigger className="border-2 border-foreground">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Movie">Movie</SelectItem>
                  <SelectItem value="Series">Series</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-bold">Year</label>
              <Input
                placeholder="2025"
                value={form.year}
                onChange={(e) => setForm({ ...form, year: e.target.value })}
                className="border-2 border-foreground"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-bold">Genre (comma separated)</label>
              <Input
                placeholder="e.g., Action, Comedy"
                value={form.genre}
                onChange={(e) => setForm({ ...form, genre: e.target.value })}
                className="border-2 border-foreground"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-bold">Rating</label>
              <Input
                placeholder="e.g., 8.5/10"
                value={form.rating}
                onChange={(e) => setForm({ ...form, rating: e.target.value })}
                className="border-2 border-foreground"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-bold">Description</label>
            <Textarea
              placeholder="Enter description..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="border-2 border-foreground min-h-24"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="featured"
              checked={form.featured}
              onCheckedChange={(checked) => setForm({ ...form, featured: checked as boolean })}
            />
            <label htmlFor="featured" className="font-bold">Featured on Homepage</label>
          </div>
        </div>

        {/* Video Sources */}
        <div className="border-2 border-foreground rounded-lg p-6">
          <VideoSourceManager sources={videoSources} onChange={setVideoSources} />
        </div>

        {/* Download Links */}
        <div className="border-2 border-foreground rounded-lg p-6">
          <DownloadLinkManager links={downloadLinks} onChange={setDownloadLinks} />
        </div>

        <div className="flex justify-end">
          <Button type="submit" className="border-2 border-foreground">
            Create Media
          </Button>
        </div>
      </form>
    </AdminLayout>
  );
};

export default AdminAddManual;
