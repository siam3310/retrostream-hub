import { useEffect, useState } from 'react';
import { Trash2, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { LiveMatch } from '@/lib/types';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const AdminLiveMatches = () => {
  const [matches, setMatches] = useState<LiveMatch[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    team1_name: '',
    team2_name: '',
    team1_logo: '',
    team2_logo: '',
    tournament: '',
    start_time: '',
    status: 'upcoming' as const,
    stream_links: '',
  });

  const fetchMatches = async () => {
    const { data } = await supabase.from('live_matches').select('*').order('created_at', { ascending: false });
    if (data) setMatches(data as unknown as LiveMatch[]);
  };

  useEffect(() => { fetchMatches(); }, []);

  const addMatch = async (e: React.FormEvent) => {
    e.preventDefault();
    const streamLinks = form.stream_links
      ? form.stream_links.split('\n').map((line, i) => {
          const [name, url] = line.split('|').map(s => s.trim());
          return { name: name || `Server ${i + 1}`, url: url || name };
        })
      : [];
    
    await supabase.from('live_matches').insert({
      team1_name: form.team1_name,
      team2_name: form.team2_name,
      team1_logo: form.team1_logo || null,
      team2_logo: form.team2_logo || null,
      tournament: form.tournament || null,
      start_time: form.start_time || null,
      status: form.status,
      stream_links: streamLinks.length > 0 ? streamLinks : null,
    });
    toast({ title: 'Match added' });
    setForm({ team1_name: '', team2_name: '', team1_logo: '', team2_logo: '', tournament: '', start_time: '', status: 'upcoming', stream_links: '' });
    setOpen(false);
    fetchMatches();
  };

  const deleteMatch = async (id: number) => {
    if (!confirm('Delete this match?')) return;
    await supabase.from('live_matches').delete().eq('id', id);
    toast({ title: 'Deleted' });
    fetchMatches();
  };

  const updateStatus = async (id: number, status: 'live' | 'upcoming' | 'finished') => {
    await supabase.from('live_matches').update({ status }).eq('id', id);
    fetchMatches();
  };

  const formatDate = (date: string | null) => {
    if (!date) return '-';
    return new Date(date).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' });
  };

  return (
    <AdminLayout title="Manage Live Matches" description="Create, edit, and delete live sports matches.">
      <div className="mb-4 flex justify-end">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="border-2 border-foreground">
              <Plus className="mr-2 h-4 w-4" /> Create Match
            </Button>
          </DialogTrigger>
          <DialogContent className="border-2 border-foreground">
            <DialogHeader>
              <DialogTitle>Create New Match</DialogTitle>
            </DialogHeader>
            <form onSubmit={addMatch} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input placeholder="Team 1 Name" value={form.team1_name} onChange={(e) => setForm({...form, team1_name: e.target.value})} required className="border-2 border-foreground" />
                <Input placeholder="Team 2 Name" value={form.team2_name} onChange={(e) => setForm({...form, team2_name: e.target.value})} required className="border-2 border-foreground" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input placeholder="Team 1 Logo URL" value={form.team1_logo} onChange={(e) => setForm({...form, team1_logo: e.target.value})} className="border-2 border-foreground" />
                <Input placeholder="Team 2 Logo URL" value={form.team2_logo} onChange={(e) => setForm({...form, team2_logo: e.target.value})} className="border-2 border-foreground" />
              </div>
              <Input placeholder="Tournament" value={form.tournament} onChange={(e) => setForm({...form, tournament: e.target.value})} className="border-2 border-foreground" />
              <Input type="datetime-local" value={form.start_time} onChange={(e) => setForm({...form, start_time: e.target.value})} className="border-2 border-foreground" />
              <select value={form.status} onChange={(e) => setForm({...form, status: e.target.value as any})} className="w-full border-2 border-foreground bg-background p-2">
                <option value="upcoming">Upcoming</option>
                <option value="live">Live</option>
                <option value="finished">Finished</option>
              </select>
              <textarea
                placeholder="Stream Links (one per line: Name|URL)"
                value={form.stream_links}
                onChange={(e) => setForm({...form, stream_links: e.target.value})}
                className="w-full min-h-[80px] border-2 border-foreground bg-background p-2"
              />
              <Button type="submit" className="w-full border-2 border-foreground">Create Match</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border-2 border-foreground">
        <div className="border-b-2 border-foreground bg-muted p-4">
          <h2 className="font-bold">Current & Upcoming Matches</h2>
          <p className="text-sm text-muted-foreground">This is the list of all matches that will be shown on the live sports page.</p>
        </div>
        <div className="grid grid-cols-[1fr_150px_180px_120px_80px] gap-4 border-b border-border p-3 font-bold text-sm">
          <span>Match</span>
          <span>Tournament</span>
          <span>Start Time</span>
          <span>Status</span>
          <span className="text-right">Actions</span>
        </div>
        {matches.length === 0 ? (
          <p className="p-4 text-muted-foreground">No matches found.</p>
        ) : (
          matches.map((m) => (
            <div key={m.id} className="grid grid-cols-[1fr_150px_180px_120px_80px] gap-4 border-b border-border p-3 items-center text-sm">
              <span>{m.team1_name} vs {m.team2_name}</span>
              <span className="text-muted-foreground">{m.tournament || '-'}</span>
              <span className="text-muted-foreground">{formatDate(m.start_time)}</span>
              <select
                value={m.status || 'upcoming'}
                onChange={(e) => updateStatus(m.id, e.target.value as any)}
                className="border border-border bg-background px-2 py-1 text-sm"
              >
                <option value="upcoming">Upcoming</option>
                <option value="live">Live</option>
                <option value="finished">Finished</option>
              </select>
              <div className="flex justify-end">
                <Button size="icon" variant="ghost" onClick={() => deleteMatch(m.id)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminLiveMatches;
