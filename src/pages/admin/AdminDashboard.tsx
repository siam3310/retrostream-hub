import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Film, Radio, Plus, Tv, TrendingUp, Clock, Eye } from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { supabase } from '@/integrations/supabase/client';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalMovies: 0,
    totalSeries: 0,
    liveMatches: 0,
    upcomingMatches: 0,
    featuredContent: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      const [moviesRes, seriesRes, liveRes, upcomingRes, featuredRes] = await Promise.all([
        supabase.from('moviesandseries').select('id', { count: 'exact' }).eq('type', 'Movie'),
        supabase.from('moviesandseries').select('id', { count: 'exact' }).eq('type', 'Series'),
        supabase.from('live_matches').select('id', { count: 'exact' }).eq('status', 'live'),
        supabase.from('live_matches').select('id', { count: 'exact' }).eq('status', 'upcoming'),
        supabase.from('moviesandseries').select('id', { count: 'exact' }).eq('featured', true),
      ]);

      setStats({
        totalMovies: moviesRes.count || 0,
        totalSeries: seriesRes.count || 0,
        liveMatches: liveRes.count || 0,
        upcomingMatches: upcomingRes.count || 0,
        featuredContent: featuredRes.count || 0,
      });
    };

    fetchStats();

    // Realtime updates
    const channel = supabase
      .channel('dashboard-stats')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'moviesandseries' }, fetchStats)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'live_matches' }, fetchStats)
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  return (
    <AdminLayout title="Dashboard" description="Overview of your content and quick actions.">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <div className="border-2 border-foreground p-4">
          <div className="flex items-center gap-2 mb-2">
            <Film className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground uppercase tracking-wide">Movies</span>
          </div>
          <p className="text-2xl font-bold">{stats.totalMovies}</p>
        </div>
        <div className="border-2 border-foreground p-4">
          <div className="flex items-center gap-2 mb-2">
            <Tv className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground uppercase tracking-wide">Series</span>
          </div>
          <p className="text-2xl font-bold">{stats.totalSeries}</p>
        </div>
        <div className="border-2 border-foreground p-4">
          <div className="flex items-center gap-2 mb-2">
            <Radio className="h-4 w-4 text-destructive" />
            <span className="text-xs text-muted-foreground uppercase tracking-wide">Live Now</span>
          </div>
          <p className="text-2xl font-bold">{stats.liveMatches}</p>
        </div>
        <div className="border-2 border-foreground p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground uppercase tracking-wide">Upcoming</span>
          </div>
          <p className="text-2xl font-bold">{stats.upcomingMatches}</p>
        </div>
        <div className="border-2 border-foreground p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground uppercase tracking-wide">Featured</span>
          </div>
          <p className="text-2xl font-bold">{stats.featuredContent}</p>
        </div>
      </div>

      {/* Quick Actions */}
      <h2 className="text-lg font-bold mb-4">Quick Actions</h2>
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <Link to="/admin/add" className="border-2 border-foreground p-6 hover:bg-muted transition-colors group">
          <Plus className="mb-3 h-6 w-6 group-hover:scale-110 transition-transform" />
          <h3 className="font-bold mb-1">Add New Content</h3>
          <p className="text-sm text-muted-foreground">Import from TMDB or add manually</p>
        </Link>

        <Link to="/admin/media" className="border-2 border-foreground p-6 hover:bg-muted transition-colors group">
          <Film className="mb-3 h-6 w-6 group-hover:scale-110 transition-transform" />
          <h3 className="font-bold mb-1">Manage Media</h3>
          <p className="text-sm text-muted-foreground">Edit, delete, or feature content</p>
        </Link>

        <Link to="/admin/live-matches/add" className="border-2 border-foreground p-6 hover:bg-muted transition-colors group">
          <Radio className="mb-3 h-6 w-6 group-hover:scale-110 transition-transform" />
          <h3 className="font-bold mb-1">Add Live Match</h3>
          <p className="text-sm text-muted-foreground">Create a new live sports stream</p>
        </Link>
      </div>

      {/* Management Links */}
      <h2 className="text-lg font-bold mb-4">Management</h2>
      <div className="grid gap-3 md:grid-cols-2">
        <Link to="/admin/media" className="flex items-center justify-between border-2 border-foreground p-4 hover:bg-muted transition-colors">
          <div className="flex items-center gap-3">
            <Film className="h-5 w-5" />
            <div>
              <p className="font-bold">Movies & Series</p>
              <p className="text-xs text-muted-foreground">{stats.totalMovies + stats.totalSeries} items</p>
            </div>
          </div>
          <Eye className="h-4 w-4 text-muted-foreground" />
        </Link>

        <Link to="/admin/live-matches" className="flex items-center justify-between border-2 border-foreground p-4 hover:bg-muted transition-colors">
          <div className="flex items-center gap-3">
            <Radio className="h-5 w-5" />
            <div>
              <p className="font-bold">Live Matches</p>
              <p className="text-xs text-muted-foreground">{stats.liveMatches + stats.upcomingMatches} matches</p>
            </div>
          </div>
          <Eye className="h-4 w-4 text-muted-foreground" />
        </Link>
      </div>

      <div className="mt-8 pt-4 border-t border-border">
        <Link to="/" className="text-sm hover:underline text-muted-foreground">← Back to Site</Link>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
