import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Plus, Trash2 } from 'lucide-react';
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

interface VideoSource {
  name: string;
  url: string;
  type: string;
}

interface DownloadLink {
  quality: string;
  size: string;
  url: string;
}

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

  const addVideoSource = () => {
    setVideoSources([...videoSources, { name: `Server ${videoSources.length + 1}`, url: '', type: 'iframe' }]);
  };

  const removeVideoSource = (index: number) => {
    setVideoSources(videoSources.filter((_, i) => i !== index));
  };

  const updateVideoSource = (index: number, field: keyof VideoSource, value: string) => {
    const updated = [...videoSources];
    updated[index][field] = value;
    setVideoSources(updated);
  };

  const addDownloadLink = () => {
    setDownloadLinks([...downloadLinks, { quality: '720P', size: '', url: '' }]);
  };

  const removeDownloadLink = (index: number) => {
    setDownloadLinks(downloadLinks.filter((_, i) => i !== index));
  };

  const updateDownloadLink = (index: number, field: keyof DownloadLink, value: string) => {
    const updated = [...downloadLinks];
    updated[index][field] = value;
    setDownloadLinks(updated);
  };

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
        <div className="border-2 border-foreground p-6">
          <h2 className="mb-2 text-xl font-bold">Content Details</h2>
          <p className="mb-4 text-muted-foreground">All fields are required unless marked as optional.</p>

          <div className="grid md:grid-cols-2 gap-4 mb-4">
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

          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="mb-1 block text-sm font-bold">Title</label>
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

          <div className="grid md:grid-cols-3 gap-4 mb-4">
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

          <div className="grid md:grid-cols-2 gap-4 mb-4">
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

          <div className="mb-4">
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
        <div className="border-2 border-foreground p-6">
          <h2 className="mb-4 text-xl font-bold">Video Sources (Optional)</h2>
          {videoSources.map((source, index) => (
            <div key={index} className="mb-4 border-2 border-foreground p-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-bold">Name</label>
                  <Input
                    value={source.name}
                    onChange={(e) => updateVideoSource(index, 'name', e.target.value)}
                    placeholder="Server 1"
                    className="border-2 border-foreground"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-bold">URL</label>
                  <Input
                    value={source.url}
                    onChange={(e) => updateVideoSource(index, 'url', e.target.value)}
                    placeholder="https://example.com/video.mp4"
                    className="border-2 border-foreground"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-bold">Type</label>
                  <Select value={source.type} onValueChange={(v) => updateVideoSource(index, 'type', v)}>
                    <SelectTrigger className="border-2 border-foreground">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="iframe">Iframe</SelectItem>
                      <SelectItem value="video">Direct Video</SelectItem>
                      <SelectItem value="m3u8">M3U8 / HLS</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {videoSources.length > 1 && (
                <Button type="button" variant="ghost" size="sm" className="mt-2" onClick={() => removeVideoSource(index)}>
                  <Trash2 className="mr-2 h-4 w-4" /> Remove Source
                </Button>
              )}
            </div>
          ))}
          <Button type="button" variant="outline" onClick={addVideoSource} className="border-2 border-foreground">
            <Plus className="mr-2 h-4 w-4" /> Add Video Source
          </Button>
        </div>

        {/* Download Links */}
        <div className="border-2 border-foreground p-6">
          <h2 className="mb-4 text-xl font-bold">Download Links (Optional)</h2>
          {downloadLinks.map((link, index) => (
            <div key={index} className="mb-4 border-2 border-foreground p-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-bold">Quality</label>
                  <Input
                    value={link.quality}
                    onChange={(e) => updateDownloadLink(index, 'quality', e.target.value)}
                    placeholder="720P"
                    className="border-2 border-foreground"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-bold">Size</label>
                  <Input
                    value={link.size}
                    onChange={(e) => updateDownloadLink(index, 'size', e.target.value)}
                    placeholder="1.2 GB"
                    className="border-2 border-foreground"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-bold">URL</label>
                  <Input
                    value={link.url}
                    onChange={(e) => updateDownloadLink(index, 'url', e.target.value)}
                    placeholder="https://..."
                    className="border-2 border-foreground"
                  />
                </div>
              </div>
              <Button type="button" variant="ghost" size="sm" className="mt-2" onClick={() => removeDownloadLink(index)}>
                <Trash2 className="mr-2 h-4 w-4" /> Remove Link
              </Button>
            </div>
          ))}
          <Button type="button" variant="outline" onClick={addDownloadLink} className="border-2 border-foreground">
            <Plus className="mr-2 h-4 w-4" /> Add Download Link
          </Button>
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
