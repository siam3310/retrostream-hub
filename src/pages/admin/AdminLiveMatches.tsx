import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, MoreHorizontal } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { LiveMatch } from '@/lib/types';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const AdminLiveMatches = () => {
  const [matches, setMatches] = useState<LiveMatch[]>([]);

  const fetchMatches = async () => {
    const { data } = await supabase.from('live_matches').select('*').order('created_at', { ascending: false });
    if (data) setMatches(data as unknown as LiveMatch[]);
  };

  useEffect(() => { fetchMatches(); }, []);

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
        <Link to="/admin/live-matches/add">
          <Button className="border-2 border-foreground">
            <Plus className="mr-2 h-4 w-4" /> Create Match
          </Button>
        </Link>
      </div>

      <div className="border-2 border-foreground">
        <div className="border-b-2 border-foreground bg-muted p-4">
          <h2 className="font-bold">Current & Upcoming Matches</h2>
          <p className="text-sm text-muted-foreground">This is the list of all matches that will be shown on the live sports page.</p>
        </div>
        <div className="hidden md:grid grid-cols-[1fr_150px_180px_120px_80px] gap-4 border-b border-border p-3 font-bold text-sm">
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
            <div key={m.id} className="grid md:grid-cols-[1fr_150px_180px_120px_80px] gap-2 md:gap-4 border-b border-border p-3 items-center text-sm">
              <span className="font-medium">{m.team1_name} vs {m.team2_name}</span>
              <span className="text-muted-foreground">{m.tournament || '-'}</span>
              <span className="text-muted-foreground">{formatDate(m.start_time)}</span>
              <Select
                value={m.status || 'upcoming'}
                onValueChange={(value) => updateStatus(m.id, value as 'live' | 'upcoming' | 'finished')}
              >
                <SelectTrigger className="border-2 border-foreground h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                  <SelectItem value="live">Live</SelectItem>
                  <SelectItem value="finished">Finished</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex justify-end">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="icon" variant="ghost">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link to={`/admin/live-matches/edit/${m.id}`}>Edit</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => deleteMatch(m.id)} className="text-destructive">
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminLiveMatches;
