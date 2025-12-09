import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { ArrowLeft, Trash2, Edit2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { LiveMatch } from '@/lib/types';
import { useAdmin } from '@/contexts/AdminContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';

const AdminLiveMatches = () => {
  const { isAuthenticated } = useAdmin();
  const [matches, setMatches] = useState<LiveMatch[]>([]);
  const [form, setForm] = useState({ team1_name: '', team2_name: '', tournament: '', status: 'upcoming' as const });

  const fetchMatches = async () => {
    const { data } = await supabase.from('live_matches').select('*').order('created_at', { ascending: false });
    if (data) setMatches(data as unknown as LiveMatch[]);
  };

  useEffect(() => { fetchMatches(); }, []);

  const addMatch = async (e: React.FormEvent) => {
    e.preventDefault();
    await supabase.from('live_matches').insert({ ...form });
    toast({ title: 'Match added' });
    setForm({ team1_name: '', team2_name: '', tournament: '', status: 'upcoming' });
    fetchMatches();
  };

  const deleteMatch = async (id: number) => {
    if (!confirm('Delete?')) return;
    await supabase.from('live_matches').delete().eq('id', id);
    toast({ title: 'Deleted' });
    fetchMatches();
  };

  const updateStatus = async (id: number, status: 'live' | 'upcoming' | 'finished') => {
    await supabase.from('live_matches').update({ status }).eq('id', id);
    fetchMatches();
  };

  if (!isAuthenticated) return <Navigate to="/admin/login" />;

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="mx-auto max-w-4xl">
        <Link to="/admin" className="mb-4 inline-flex items-center gap-2 hover:underline">
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>
        <h1 className="mb-6 border-b-2 border-foreground pb-2 text-2xl font-bold">Live Matches</h1>
        
        <form onSubmit={addMatch} className="mb-6 space-y-2 border-2 border-foreground p-4">
          <div className="grid grid-cols-2 gap-2">
            <Input placeholder="Team 1" value={form.team1_name} onChange={(e) => setForm({...form, team1_name: e.target.value})} required className="border-2 border-foreground" />
            <Input placeholder="Team 2" value={form.team2_name} onChange={(e) => setForm({...form, team2_name: e.target.value})} required className="border-2 border-foreground" />
          </div>
          <Input placeholder="Tournament" value={form.tournament} onChange={(e) => setForm({...form, tournament: e.target.value})} className="border-2 border-foreground" />
          <Button type="submit" className="w-full border-2 border-foreground">Add Match</Button>
        </form>

        <div className="space-y-2">
          {matches.map((m) => (
            <div key={m.id} className="flex items-center justify-between border-2 border-foreground p-3">
              <span>{m.team1_name} vs {m.team2_name}</span>
              <div className="flex gap-2">
                <select value={m.status || ''} onChange={(e) => updateStatus(m.id, e.target.value as any)} className="border-2 border-foreground bg-background px-2">
                  <option value="upcoming">Upcoming</option>
                  <option value="live">Live</option>
                  <option value="finished">Finished</option>
                </select>
                <Button size="icon" variant="destructive" onClick={() => deleteMatch(m.id)}><Trash2 className="h-4 w-4" /></Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminLiveMatches;
