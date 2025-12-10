import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Plus, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface StreamLink { name: string; url: string; type: string; }

const AdminEditMatch = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ team1_name: '', team2_name: '', team1_logo: '', team2_logo: '', tournament: '', start_date: '', start_time: '', status: 'upcoming' as 'live' | 'upcoming' | 'finished' });
  const [streamLinks, setStreamLinks] = useState<StreamLink[]>([]);

  useEffect(() => {
    const fetchMatch = async () => {
      const { data } = await supabase.from('live_matches').select('*').eq('id', Number(id)).maybeSingle();
      if (data) {
        const startDate = data.start_time ? new Date(data.start_time) : null;
        setForm({ team1_name: data.team1_name, team2_name: data.team2_name, team1_logo: data.team1_logo || '', team2_logo: data.team2_logo || '', tournament: data.tournament || '', start_date: startDate ? startDate.toISOString().split('T')[0] : '', start_time: startDate ? startDate.toTimeString().slice(0, 5) : '', status: data.status || 'upcoming' });
        setStreamLinks((data.stream_links as unknown as StreamLink[]) || []);
      }
      setLoading(false);
    };
    fetchMatch();
  }, [id]);

  const addStreamLink = () => setStreamLinks([...streamLinks, { name: `Server ${streamLinks.length + 1}`, url: '', type: 'iframe' }]);
  const removeStreamLink = (index: number) => setStreamLinks(streamLinks.filter((_, i) => i !== index));
  const updateStreamLink = (index: number, field: keyof StreamLink, value: string) => { const updated = [...streamLinks]; updated[index][field] = value; setStreamLinks(updated); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const startDateTime = form.start_date && form.start_time ? new Date(`${form.start_date}T${form.start_time}`).toISOString() : null;
    const { error } = await supabase.from('live_matches').update({ team1_name: form.team1_name, team2_name: form.team2_name, team1_logo: form.team1_logo || null, team2_logo: form.team2_logo || null, tournament: form.tournament || null, start_time: startDateTime, status: form.status, stream_links: streamLinks.filter(l => l.url) as unknown as null }).eq('id', Number(id));
    if (error) { toast({ title: 'Error', description: error.message, variant: 'destructive' }); } else { toast({ title: 'Match updated' }); navigate('/admin/live-matches'); }
  };

  if (loading) return <AdminLayout title="Edit Match" description="Loading..."><div className="animate-pulse h-96 bg-muted" /></AdminLayout>;

  return (
    <AdminLayout title="Edit Match" description="Update the match details.">
      <form onSubmit={handleSubmit} className="max-w-4xl space-y-6">
        <div className="border-2 border-foreground p-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4 border-2 border-foreground p-4"><h3 className="font-bold">Team 1</h3><Input value={form.team1_name} onChange={(e) => setForm({ ...form, team1_name: e.target.value })} required className="border-2 border-foreground" /><Input value={form.team1_logo} onChange={(e) => setForm({ ...form, team1_logo: e.target.value })} placeholder="Logo URL" className="border-2 border-foreground" /></div>
            <div className="space-y-4 border-2 border-foreground p-4"><h3 className="font-bold">Team 2</h3><Input value={form.team2_name} onChange={(e) => setForm({ ...form, team2_name: e.target.value })} required className="border-2 border-foreground" /><Input value={form.team2_logo} onChange={(e) => setForm({ ...form, team2_logo: e.target.value })} placeholder="Logo URL" className="border-2 border-foreground" /></div>
          </div>
          <div className="mt-4 grid md:grid-cols-2 gap-4"><Input value={form.tournament} onChange={(e) => setForm({ ...form, tournament: e.target.value })} placeholder="Tournament" className="border-2 border-foreground" /><Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as any })}><SelectTrigger className="border-2 border-foreground"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="upcoming">Upcoming</SelectItem><SelectItem value="live">Live</SelectItem><SelectItem value="finished">Finished</SelectItem></SelectContent></Select></div>
          <div className="mt-4 grid md:grid-cols-2 gap-4"><Input type="date" value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} className="border-2 border-foreground" /><Input type="time" value={form.start_time} onChange={(e) => setForm({ ...form, start_time: e.target.value })} className="border-2 border-foreground" /></div>
        </div>
        <div className="border-2 border-foreground p-6"><h2 className="mb-4 font-bold">Stream Links</h2>{streamLinks.map((link, i) => (<div key={i} className="mb-4 border border-foreground p-4"><div className="grid md:grid-cols-3 gap-4"><Input value={link.name} onChange={(e) => updateStreamLink(i, 'name', e.target.value)} className="border-2 border-foreground" /><Input value={link.url} onChange={(e) => updateStreamLink(i, 'url', e.target.value)} className="border-2 border-foreground" /><Select value={link.type} onValueChange={(v) => updateStreamLink(i, 'type', v)}><SelectTrigger className="border-2 border-foreground"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="iframe">Iframe</SelectItem><SelectItem value="m3u8">M3U8</SelectItem></SelectContent></Select></div><Button type="button" variant="ghost" size="sm" onClick={() => removeStreamLink(i)}><Trash2 className="h-4 w-4" /></Button></div>))}<Button type="button" variant="outline" onClick={addStreamLink}><Plus className="mr-2 h-4 w-4" />Add</Button></div>
        <Button type="submit" className="border-2 border-foreground">Update Match</Button>
      </form>
    </AdminLayout>
  );
};

export default AdminEditMatch;
