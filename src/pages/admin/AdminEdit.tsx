import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/hooks/use-toast';
import { MovieOrSeries } from '@/lib/types';
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
    featured: false,
  });
  const [videoSources, setVideoSources] = useState<VideoSource[]>([]);
  const [downloadLinks, setDownloadLinks] = useState<DownloadLink[]>([]);

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
          featured: item.featured || false,
        });
        setVideoSources(
          item.videoSources?.map((v: any) => ({
            name: v.name || 'Server',
            url: v.url || '',
            type: v.type || 'iframe',
          })) || []
        );
        setDownloadLinks(
          item.downloadLinks?.map((d: any) => ({
            quality: d.quality || '',
            size: d.size || '',
            url: d.url || '',
          })) || []
        );
      }
      setLoading(false);
    };
    fetchItem();
  }, [slug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const filteredVideoSources = videoSources.filter(v => v.url);
    const filteredDownloadLinks = downloadLinks.filter(d => d.url);

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
        videoSources: filteredVideoSources.length > 0 ? filteredVideoSources as any : null,
        downloadLinks: filteredDownloadLinks.length > 0 ? filteredDownloadLinks as any : null,
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
      <form onSubmit={handleSubmit} className="max-w-4xl space-y-6">
        {/* Content Details */}
        <div className="border-2 border-foreground rounded-lg p-6 space-y-4">
          <h2 className="text-xl font-bold">Content Details</h2>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-bold">Title *</label>
              <Input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
                className="border-2 border-foreground"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-bold">Year</label>
              <Input
                value={form.year}
                onChange={(e) => setForm({ ...form, year: e.target.value })}
                className="border-2 border-foreground"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="mb-1 block text-sm font-bold">Type</label>
              <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                <SelectTrigger className="border-2 border-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Movie">Movie</SelectItem>
                  <SelectItem value="Series">Series</SelectItem>
                </SelectContent>
              </Select>
            </div>
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
              <label className="mb-1 block text-sm font-bold">Rating</label>
              <Input
                value={form.rating}
                onChange={(e) => setForm({ ...form, rating: e.target.value })}
                placeholder="e.g., 8.5/10"
                className="border-2 border-foreground"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-bold">Genre (comma separated)</label>
            <Input
              value={form.genre}
              onChange={(e) => setForm({ ...form, genre: e.target.value })}
              placeholder="Action, Drama, Comedy"
              className="border-2 border-foreground"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-bold">Poster URL</label>
              <Input
                value={form.posterUrl}
                onChange={(e) => setForm({ ...form, posterUrl: e.target.value })}
                className="border-2 border-foreground"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-bold">Backdrop URL</label>
              <Input
                value={form.backdropUrl}
                onChange={(e) => setForm({ ...form, backdropUrl: e.target.value })}
                className="border-2 border-foreground"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-bold">Description</label>
            <Textarea
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

        {/* Actions */}
        <div className="flex gap-4">
          <Button type="button" variant="outline" onClick={() => navigate('/admin/media')} className="border-2 border-foreground">
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
