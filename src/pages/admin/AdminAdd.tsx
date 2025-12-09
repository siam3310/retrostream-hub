import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAdmin } from '@/contexts/AdminContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';

const AdminAdd = () => {
  const { isAuthenticated } = useAdmin();
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', year: '', type: 'Movie', description: '', posterUrl: '', backdropUrl: '', rating: '', genre: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const id = crypto.randomUUID();
    const slug = form.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    
    const { error } = await supabase.from('moviesandseries').insert({
      id, slug, title: form.title, year: parseInt(form.year) || null, type: form.type,
      description: form.description, posterUrl: form.posterUrl, backdropUrl: form.backdropUrl,
      rating: form.rating, genre: form.genre.split(',').map(g => g.trim()).filter(Boolean), featured: false
    });
    
    if (error) toast({ title: 'Error', description: error.message, variant: 'destructive' });
    else { toast({ title: 'Added successfully' }); navigate('/admin/media'); }
  };

  if (!isAuthenticated) return <Navigate to="/admin/login" />;

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="mx-auto max-w-4xl">
        <Link to="/admin" className="mb-4 inline-flex items-center gap-2 hover:underline">
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>
        <h1 className="mb-6 border-b-2 border-foreground pb-2 text-2xl font-bold">Add Content</h1>
        <form onSubmit={handleSubmit} className="space-y-4 border-2 border-foreground p-4">
          <Input placeholder="Title" value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} required className="border-2 border-foreground" />
          <Input placeholder="Year" value={form.year} onChange={(e) => setForm({...form, year: e.target.value})} className="border-2 border-foreground" />
          <select value={form.type} onChange={(e) => setForm({...form, type: e.target.value})} className="w-full border-2 border-foreground bg-background p-2">
            <option value="Movie">Movie</option>
            <option value="Series">Series</option>
          </select>
          <Input placeholder="Poster URL" value={form.posterUrl} onChange={(e) => setForm({...form, posterUrl: e.target.value})} className="border-2 border-foreground" />
          <Input placeholder="Backdrop URL" value={form.backdropUrl} onChange={(e) => setForm({...form, backdropUrl: e.target.value})} className="border-2 border-foreground" />
          <Input placeholder="Rating" value={form.rating} onChange={(e) => setForm({...form, rating: e.target.value})} className="border-2 border-foreground" />
          <Input placeholder="Genre (comma separated)" value={form.genre} onChange={(e) => setForm({...form, genre: e.target.value})} className="border-2 border-foreground" />
          <Textarea placeholder="Description" value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} className="border-2 border-foreground" />
          <Button type="submit" className="w-full border-2 border-foreground">Add Content</Button>
        </form>
      </div>
    </div>
  );
};

export default AdminAdd;
