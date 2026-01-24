import { useRef, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, MotionConfig, AnimatePresence } from 'motion/react';
import useMeasure from 'react-use-measure';
import useClickOutside from '@/hooks/useClickOutside';
import { ArrowLeft, Search, Film, Tv, Radio, Clock, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';

const transition = {
  type: 'spring' as const,
  bounce: 0.1,
  duration: 0.25,
};

const NAV_ITEMS = [
  {
    id: 1,
    label: 'Movies',
    icon: <Film className="h-5 w-5" />,
    to: '/movies',
    content: (
      <div className="flex flex-col space-y-3">
        <span className="text-foreground font-bold">Movies</span>
        <p className="text-muted-foreground text-sm">Browse our collection of movies</p>
        <Link
          to="/movies"
          className="h-8 w-full flex items-center justify-center border-2 border-foreground text-sm hover:bg-muted transition-colors rounded-md"
        >
          View All Movies
        </Link>
      </div>
    ),
  },
  {
    id: 2,
    label: 'Series',
    icon: <Tv className="h-5 w-5" />,
    to: '/series',
    content: (
      <div className="flex flex-col space-y-3">
        <span className="text-foreground font-bold">TV Series</span>
        <p className="text-muted-foreground text-sm">Explore trending TV shows</p>
        <Link
          to="/series"
          className="h-8 w-full flex items-center justify-center border-2 border-foreground text-sm hover:bg-muted transition-colors rounded-md"
        >
          View All Series
        </Link>
      </div>
    ),
  },
  {
    id: 3,
    label: 'Live',
    icon: <Radio className="h-5 w-5" />,
    to: '/live-sports',
    content: (
      <div className="flex flex-col space-y-3">
        <span className="text-foreground font-bold">Live Sports</span>
        <p className="text-muted-foreground text-sm">Watch live sports streams</p>
        <Link
          to="/live-sports"
          className="h-8 w-full flex items-center justify-center border-2 border-foreground text-sm hover:bg-muted transition-colors rounded-md"
        >
          View Live Matches
        </Link>
      </div>
    ),
  },
  {
    id: 4,
    label: 'Watch Later',
    icon: <Clock className="h-5 w-5" />,
    to: '/watch-later',
    content: (
      <div className="flex flex-col space-y-3">
        <span className="text-foreground font-bold">Watch Later</span>
        <p className="text-muted-foreground text-sm">Your saved content</p>
        <Link
          to="/watch-later"
          className="h-8 w-full flex items-center justify-center border-2 border-foreground text-sm hover:bg-muted transition-colors rounded-md"
        >
          View Watch Later
        </Link>
      </div>
    ),
  },
];

export const Header = () => {
  const [active, setActive] = useState<number | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [contentRef, { height: heightContent }] = useMeasure();
  const [menuRef, { width: widthContainer }] = useMeasure();
  const [maxWidth, setMaxWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useClickOutside(containerRef, () => {
    setIsMenuOpen(false);
    setActive(null);
  });

  useClickOutside(searchRef, () => {
    setIsSearchOpen(false);
  });

  useEffect(() => {
    if (!widthContainer || maxWidth > 0) return;
    setMaxWidth(widthContainer);
  }, [widthContainer, maxWidth]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsSearchOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b-2 border-foreground bg-background">
      <div className="mx-auto max-w-4xl px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="text-xl font-bold tracking-tight">
            black&white-tv
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            <MotionConfig transition={transition}>
              {/* Expandable Menu */}
              <div ref={containerRef}>
                <div className="rounded-lg border-2 border-foreground bg-background">
                  <div className="overflow-hidden">
                    <AnimatePresence initial={false} mode="sync">
                      {isMenuOpen && active ? (
                        <motion.div
                          key="content"
                          initial={{ height: 0 }}
                          animate={{ height: heightContent || 0 }}
                          exit={{ height: 0 }}
                          style={{ width: maxWidth }}
                        >
                          <div ref={contentRef} className="p-3">
                            {NAV_ITEMS.map((item) => {
                              const isSelected = active === item.id;
                              return (
                                <motion.div
                                  key={item.id}
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: isSelected ? 1 : 0 }}
                                  exit={{ opacity: 0 }}
                                >
                                  <div className={cn('text-sm', isSelected ? 'block' : 'hidden')}>
                                    {item.content}
                                  </div>
                                </motion.div>
                              );
                            })}
                          </div>
                        </motion.div>
                      ) : null}
                    </AnimatePresence>
                  </div>
                  <div className="flex space-x-1 p-1" ref={menuRef}>
                    {NAV_ITEMS.map((item) => (
                      <button
                        key={item.id}
                        aria-label={item.label}
                        className={cn(
                          'relative flex h-9 w-9 shrink-0 select-none items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground',
                          active === item.id ? 'bg-muted text-foreground' : ''
                        )}
                        type="button"
                        onClick={() => {
                          if (!isMenuOpen) setIsMenuOpen(true);
                          if (active === item.id) {
                            setIsMenuOpen(false);
                            setActive(null);
                            return;
                          }
                          setActive(item.id);
                        }}
                      >
                        {item.icon}
                      </button>
                    ))}
                  </div>
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

          {/* Mobile Menu Button */}
          <button
            className="md:hidden flex h-10 w-10 items-center justify-center rounded-md border-2 border-foreground"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="border-t-2 border-foreground pb-4 md:hidden">
            <form onSubmit={handleSearch} className="flex gap-2 py-4">
              <input
                type="search"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 h-10 rounded-md border-2 border-foreground bg-transparent px-3 text-foreground placeholder-muted-foreground focus:outline-none"
              />
              <button
                type="submit"
                className="h-10 w-10 flex items-center justify-center rounded-md border-2 border-foreground"
              >
                <Search className="h-4 w-4" />
              </button>
            </form>
            <nav className="flex flex-col gap-3">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.id}
                  to={item.to}
                  className="flex items-center gap-3 px-2 py-2 rounded-md hover:bg-muted transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};
