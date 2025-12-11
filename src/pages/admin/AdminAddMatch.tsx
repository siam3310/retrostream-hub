import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface StreamLink {
  name: string;
  url: string;
  type: string;
}

const AdminAddMatch = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    team1_name: '',
    team2_name: '',
    team1_logo: '',
    team2_logo: '',
    tournament: '',
    start_date: '',
    start_time: '',
    status: 'upcoming' as const,
  });
  const [streamLinks, setStreamLinks] = useState<StreamLink[]>([
    { name: 'Server 1', url: '', type: 'iframe' }
  ]);

  const addStreamLink = () => {
    setStreamLinks([...streamLinks, { name: `Server ${streamLinks.length + 1}`, url: '', type: 'iframe' }]);
  };

  const removeStreamLink = (index: number) => {
    setStreamLinks(streamLinks.filter((_, i) => i !== index));
  };

  const updateStreamLink = (index: number, field: keyof StreamLink, value: string) => {
    const updated = [...streamLinks];
    updated[index][field] = value;
    setStreamLinks(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const startDateTime = form.start_date && form.start_time 
      ? new Date(`${form.start_date}T${form.start_time}`).toISOString()
      : null;

    const insertData = {
      team1_name: form.team1_name,
      team2_name: form.team2_name,
      team1_logo: form.team1_logo || null,
      team2_logo: form.team2_logo || null,
      tournament: form.tournament || null,
      start_time: startDateTime,
      status: form.status,
      stream_links: streamLinks.filter(l => l.url),
    };

    const { error } = await supabase.from('live_matches').insert(insertData as any);

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Match created successfully' });
      navigate('/admin/live-matches');
    }
  };

  return (
    <AdminLayout title="Create New Match" description="Fill out the form below to add a new live match.">
      <form onSubmit={handleSubmit} className="max-w-4xl space-y-6">
        <div className="border-2 border-foreground p-6">
          <h2 className="mb-2 text-lg font-bold">Match Details</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4 border-2 border-foreground p-4">
              <h3 className="font-bold">Team 1</h3>
              <Input value={form.team1_name} onChange={(e) => setForm({ ...form, team1_name: e.target.value })} required placeholder="Team Name" className="border-2 border-foreground" />
              <Input value={form.team1_logo} onChange={(e) => setForm({ ...form, team1_logo: e.target.value })} placeholder="Logo URL" className="border-2 border-foreground" />
            </div>
            <div className="space-y-4 border-2 border-foreground p-4">
              <h3 className="font-bold">Team 2</h3>
              <Input value={form.team2_name} onChange={(e) => setForm({ ...form, team2_name: e.target.value })} required placeholder="Team Name" className="border-2 border-foreground" />
              <Input value={form.team2_logo} onChange={(e) => setForm({ ...form, team2_logo: e.target.value })} placeholder="Logo URL" className="border-2 border-foreground" />
            </div>
          </div>
          <div className="mt-6 grid md:grid-cols-2 gap-4">
            <Input value={form.tournament} onChange={(e) => setForm({ ...form, tournament: e.target.value })} placeholder="Tournament" className="border-2 border-foreground" />
            <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as any })}>
              <SelectTrigger className="border-2 border-foreground"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="upcoming">Upcoming</SelectItem>
                <SelectItem value="live">Live</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="mt-4 grid md:grid-cols-2 gap-4">
            <Input type="date" value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} className="border-2 border-foreground" />
            <Input type="time" value={form.start_time} onChange={(e) => setForm({ ...form, start_time: e.target.value })} className="border-2 border-foreground" />
          </div>
        </div>
        <div className="border-2 border-foreground p-6">
          <h2 className="mb-4 text-lg font-bold">Stream Links</h2>
          {streamLinks.map((link, index) => (
            <div key={index} className="mb-4 border-2 border-foreground p-4">
              <div className="grid md:grid-cols-3 gap-4">
                <Input value={link.name} onChange={(e) => updateStreamLink(index, 'name', e.target.value)} placeholder="Name" className="border-2 border-foreground" />
                <Input value={link.url} onChange={(e) => updateStreamLink(index, 'url', e.target.value)} placeholder="URL" className="border-2 border-foreground" />
                <Select value={link.type} onValueChange={(v) => updateStreamLink(index, 'type', v)}>
                  <SelectTrigger className="border-2 border-foreground"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="iframe">Iframe</SelectItem>
                    <SelectItem value="m3u8">M3U8</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {streamLinks.length > 1 && <Button type="button" variant="ghost" size="sm" className="mt-2" onClick={() => removeStreamLink(index)}><Trash2 className="mr-2 h-4 w-4" />Remove</Button>}
            </div>
          ))}
          <Button type="button" variant="outline" onClick={addStreamLink}><Plus className="mr-2 h-4 w-4" />Add Stream</Button>
        </div>
        <Button type="submit" className="border-2 border-foreground">Create Match</Button>
      </form>
    </AdminLayout>
  );
};

export default AdminAddMatch;
