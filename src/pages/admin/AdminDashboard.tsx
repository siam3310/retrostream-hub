import { Link, Navigate } from 'react-router-dom';
import { Film, Radio, Plus, LogOut } from 'lucide-react';
import { useAdmin } from '@/contexts/AdminContext';
import { Button } from '@/components/ui/button';

const AdminDashboard = () => {
  const { isAuthenticated, logout } = useAdmin();

  if (!isAuthenticated) return <Navigate to="/admin/login" />;

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex items-center justify-between border-b-2 border-foreground pb-4">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <Button variant="outline" className="border-2 border-foreground" onClick={logout}>
            <LogOut className="mr-2 h-4 w-4" /> Logout
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Link to="/admin/media" className="border-2 border-foreground p-6 hover:bg-muted">
            <Film className="mb-4 h-8 w-8" />
            <h2 className="text-xl font-bold">Manage Media</h2>
            <p className="text-muted-foreground">Movies & Series</p>
          </Link>

          <Link to="/admin/add" className="border-2 border-foreground p-6 hover:bg-muted">
            <Plus className="mb-4 h-8 w-8" />
            <h2 className="text-xl font-bold">Add Content</h2>
            <p className="text-muted-foreground">TMDB or Manual</p>
          </Link>

          <Link to="/admin/live-matches" className="border-2 border-foreground p-6 hover:bg-muted">
            <Radio className="mb-4 h-8 w-8" />
            <h2 className="text-xl font-bold">Live Matches</h2>
            <p className="text-muted-foreground">Manage streams</p>
          </Link>
        </div>

        <div className="mt-8">
          <Link to="/" className="hover:underline">← Back to Site</Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
