import { useRef, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, MotionConfig } from 'motion/react';
import useClickOutside from '@/hooks/useClickOutside';
import { ArrowLeft, Search, Film, Tv, Radio, Clock, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';

const transition = {
  type: 'spring' as const,
  bounce: 0.1,
  duration: 0.25,
};

const NAV_ITEMS = [
  { id: 1, label: 'Movies', icon: <Film className="h-5 w-5" />, to: '/movies' },
  { id: 2, label: 'Series', icon: <Tv className="h-5 w-5" />, to: '/series' },
  { id: 3, label: 'Live', icon: <Radio className="h-5 w-5" />, to: '/live-sports' },
  { id: 4, label: 'Watch Later', icon: <Clock className="h-5 w-5" />, to: '/watch-later' },
];

export const Header = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useClickOutside(searchRef, () => {
    setIsSearchOpen(false);
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsSearchOpen(false);
    }
  };

  return (
    <>
      {/* Header */}
      <header className="sticky top-0 z-50 border-b-2 border-foreground bg-background">
        <div className="mx-auto max-w-4xl px-4">
          <div className="flex h-16 items-center justify-between">
            <Link to="/" className="text-xl font-bold tracking-tight">
              black&white-tv
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-4">
              <MotionConfig transition={transition}>
                {/* Direct Nav Links */}
                <div className="rounded-lg border-2 border-foreground bg-background">
                  <div className="flex space-x-1 p-1">
                    {NAV_ITEMS.map((item) => (
                      <Link
                        key={item.id}
                        to={item.to}
                        aria-label={item.label}
                        className={cn(
                          'relative flex h-9 w-9 shrink-0 select-none items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground',
                          location.pathname === item.to ? 'bg-muted text-foreground' : ''
                        )}
                      >
                        {item.icon}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Search Toolbar */}
                <div ref={searchRef}>
                  <div className="rounded-lg border-2 border-foreground bg-background">
                    <motion.div
                      animate={{ width: isSearchOpen ? '220px' : '44px' }}
                      initial={false}
                    >
                      <div className="overflow-hidden p-1">
                        {!isSearchOpen ? (
                          <button
                            onClick={() => setIsSearchOpen(true)}
                            aria-label="Search"
                            className="flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                          >
                            <Search className="h-5 w-5" />
                          </button>
                        ) : (
                          <form onSubmit={handleSearch} className="flex space-x-1">
                            <button
                              type="button"
                              onClick={() => setIsSearchOpen(false)}
                              aria-label="Back"
                              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                            >
                              <ArrowLeft className="h-5 w-5" />
                            </button>
                            <input
                              className="h-9 w-full rounded-md border-2 border-foreground bg-transparent px-2 text-foreground placeholder-muted-foreground focus:outline-none"
                              autoFocus
                              placeholder="Search..."
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                            />
                          </form>
                        )}
                      </div>
                    </motion.div>
                  </div>
                </div>
              </MotionConfig>
            </div>

            {/* Mobile Search Only */}
            <div className="md:hidden">
              <MotionConfig transition={transition}>
                <div ref={searchRef}>
                  <div className="rounded-lg border-2 border-foreground bg-background">
                    <motion.div
                      animate={{ width: isSearchOpen ? '200px' : '44px' }}
                      initial={false}
                    >
                      <div className="overflow-hidden p-1">
                        {!isSearchOpen ? (
                          <button
                            onClick={() => setIsSearchOpen(true)}
                            aria-label="Search"
                            className="flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                          >
                            <Search className="h-5 w-5" />
                          </button>
                        ) : (
                          <form onSubmit={handleSearch} className="flex space-x-1">
                            <button
                              type="button"
                              onClick={() => setIsSearchOpen(false)}
                              aria-label="Back"
                              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                            >
                              <ArrowLeft className="h-5 w-5" />
                            </button>
                            <input
                              className="h-9 w-full rounded-md border-2 border-foreground bg-transparent px-2 text-foreground placeholder-muted-foreground focus:outline-none"
                              autoFocus
                              placeholder="Search..."
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                            />
                          </form>
                        )}
                      </div>
                    </motion.div>
                  </div>
                </div>
              </MotionConfig>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Floating Bottom Navigation - Toolbar Dynamic Style */}
      <nav className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
        <div className="rounded-xl border-2 border-foreground bg-background">
          <div className="flex space-x-2 p-2">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.id}
                to={item.to}
                aria-label={item.label}
                className={cn(
                  'relative flex h-10 w-10 shrink-0 select-none items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground active:scale-95',
                  location.pathname === item.to ? 'bg-muted text-foreground' : ''
                )}
              >
                {item.icon}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Spacer for mobile bottom nav */}
      <div className="md:hidden h-20" />
    </>
  );
};
