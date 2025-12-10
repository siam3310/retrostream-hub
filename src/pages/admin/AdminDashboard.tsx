import { Link } from 'react-router-dom';
import { Film, Radio, Plus } from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';

const AdminDashboard = () => {
  return (
    <AdminLayout title="Dashboard" description="Welcome to the admin panel.">
      <div className="grid gap-4 md:grid-cols-3">
        <Link to="/admin/media" className="border-2 border-foreground p-6 hover:bg-muted transition-colors">
          <Film className="mb-4 h-8 w-8" />
          <h2 className="text-xl font-bold">Manage Media</h2>
          <p className="text-muted-foreground">Movies & Series</p>
        </Link>

        <Link to="/admin/add" className="border-2 border-foreground p-6 hover:bg-muted transition-colors">
          <Plus className="mb-4 h-8 w-8" />
          <h2 className="text-xl font-bold">Add Content</h2>
          <p className="text-muted-foreground">Add new movies or series</p>
        </Link>

        <Link to="/admin/live-matches" className="border-2 border-foreground p-6 hover:bg-muted transition-colors">
          <Radio className="mb-4 h-8 w-8" />
          <h2 className="text-xl font-bold">Live Matches</h2>
          <p className="text-muted-foreground">Manage streams</p>
        </Link>
      </div>

      <div className="mt-8">
        <Link to="/" className="hover:underline">← Back to Site</Link>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
