import { Link, useLocation, Navigate } from 'react-router-dom';
import { Home, Film, Radio, Plus, LogOut } from 'lucide-react';
import { useAdmin } from '@/contexts/AdminContext';

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
}

export const AdminLayout = ({ children, title, description }: AdminLayoutProps) => {
  const { isAuthenticated, logout } = useAdmin();
  const location = useLocation();

  if (!isAuthenticated) return <Navigate to="/admin/login" />;

  const links = [
    { to: '/admin', icon: Home, label: 'Dashboard' },
    { to: '/admin/media', icon: Film, label: 'Movies & Series' },
    { to: '/admin/live-matches', icon: Radio, label: 'Live Matches' },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="w-64 border-r-2 border-foreground p-4">
        <div className="mb-6 flex items-center gap-2">
          <Radio className="h-5 w-5" />
          <span className="text-lg font-bold">black&white-tv Admin</span>
        </div>
        <nav className="space-y-1">
          {links.map(({ to, icon: Icon, label }) => (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-3 rounded px-3 py-2 transition-colors ${
                location.pathname === to
                  ? 'bg-foreground text-background'
                  : 'hover:bg-muted'
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </nav>
        <div className="mt-8">
          <Link
            to="/admin/add"
            className="flex w-full items-center justify-center gap-2 border-2 border-foreground px-3 py-2 hover:bg-muted"
          >
            <Plus className="h-4 w-4" />
            Add Content
          </Link>
        </div>
        <button
          onClick={logout}
          className="mt-4 flex w-full items-center justify-center gap-2 border-2 border-foreground px-3 py-2 hover:bg-muted"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </aside>
      <main className="flex-1 p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">{title}</h1>
          {description && <p className="text-muted-foreground">{description}</p>}
        </div>
        {children}
      </main>
    </div>
  );
};
