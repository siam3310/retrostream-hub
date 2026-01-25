import { Link, useLocation, Navigate } from 'react-router-dom';
import { Home, Film, Radio, Plus, LogOut, Menu, X, ChevronRight } from 'lucide-react';
import { useAdmin } from '@/contexts/AdminContext';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
}

export const AdminLayout = ({ children, title, description }: AdminLayoutProps) => {
  const { isAuthenticated, logout } = useAdmin();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!isAuthenticated) return <Navigate to="/admin/login" />;

  const links = [
    { to: '/admin', icon: Home, label: 'Dashboard', exact: true },
    { to: '/admin/media', icon: Film, label: 'Movies & Series' },
    { to: '/admin/live-matches', icon: Radio, label: 'Live Matches' },
  ];

  const isActive = (to: string, exact?: boolean) => {
    if (exact) return location.pathname === to;
    return location.pathname.startsWith(to);
  };

  // Generate breadcrumbs from path
  const pathParts = location.pathname.split('/').filter(Boolean);
  const breadcrumbs = pathParts.map((part, index) => {
    const path = '/' + pathParts.slice(0, index + 1).join('/');
    const label = part.charAt(0).toUpperCase() + part.slice(1).replace(/-/g, ' ');
    return { path, label };
  });

  return (
    <div className="flex min-h-screen bg-background">
      {/* Mobile Header */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-50 border-b-2 border-foreground bg-background">
        <div className="flex h-14 items-center justify-between px-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-lg hover:bg-muted"
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <span className="font-bold">Admin Panel</span>
          <button
            onClick={logout}
            className="flex h-10 w-10 items-center justify-center rounded-lg hover:bg-muted"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-background/80 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed md:sticky top-0 left-0 z-40 h-screen w-64 border-r-2 border-foreground bg-background p-4 transition-transform duration-200',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        )}
      >
        <div className="mb-6 flex items-center gap-2">
          <Radio className="h-5 w-5" />
          <span className="text-lg font-bold">Admin</span>
        </div>

        <nav className="space-y-1">
          {links.map(({ to, icon: Icon, label, exact }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setSidebarOpen(false)}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors',
                isActive(to, exact)
                  ? 'bg-foreground text-background'
                  : 'hover:bg-muted text-muted-foreground hover:text-foreground'
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </nav>

        <div className="mt-6 pt-4 border-t border-border">
          <Link
            to="/admin/add"
            onClick={() => setSidebarOpen(false)}
            className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-foreground px-3 py-2.5 hover:bg-muted transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Content
          </Link>
        </div>

        <div className="absolute bottom-4 left-4 right-4">
          <button
            onClick={logout}
            className="hidden md:flex w-full items-center justify-center gap-2 rounded-lg border-2 border-foreground px-3 py-2.5 hover:bg-muted transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
          <Link
            to="/"
            className="mt-3 flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            ← View Site
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-0 mt-14 md:mt-0">
        <div className="p-4 md:p-6">
          {/* Breadcrumbs */}
          <nav className="mb-4 flex items-center gap-1 text-sm text-muted-foreground">
            {breadcrumbs.map((crumb, index) => (
              <span key={crumb.path} className="flex items-center gap-1">
                {index > 0 && <ChevronRight className="h-3 w-3" />}
                {index === breadcrumbs.length - 1 ? (
                  <span className="text-foreground">{crumb.label}</span>
                ) : (
                  <Link to={crumb.path} className="hover:text-foreground">
                    {crumb.label}
                  </Link>
                )}
              </span>
            ))}
          </nav>

          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold">{title}</h1>
            {description && <p className="text-muted-foreground mt-1">{description}</p>}
          </div>

          {children}
        </div>
      </main>
    </div>
  );
};
