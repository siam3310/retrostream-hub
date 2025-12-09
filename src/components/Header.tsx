import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Menu, X, Clock, Film, Tv, Radio } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsMenuOpen(false);
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
          <nav className="hidden items-center gap-6 md:flex">
            <Link to="/movies" className="flex items-center gap-2 hover:underline">
              <Film className="h-4 w-4" />
              Movies
            </Link>
            <Link to="/series" className="flex items-center gap-2 hover:underline">
              <Tv className="h-4 w-4" />
              Series
            </Link>
            <Link to="/live-sports" className="flex items-center gap-2 hover:underline">
              <Radio className="h-4 w-4" />
              Live
            </Link>
            <Link to="/watch-later" className="flex items-center gap-2 hover:underline">
              <Clock className="h-4 w-4" />
              Watch Later
            </Link>
          </nav>

          {/* Desktop Search */}
          <form onSubmit={handleSearch} className="hidden items-center gap-2 md:flex">
            <Input
              type="search"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-48 border-2 border-foreground"
            />
            <Button type="submit" variant="outline" size="icon" className="border-2 border-foreground">
              <Search className="h-4 w-4" />
            </Button>
          </form>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="border-t-2 border-foreground pb-4 md:hidden">
            <form onSubmit={handleSearch} className="flex gap-2 py-4">
              <Input
                type="search"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 border-2 border-foreground"
              />
              <Button type="submit" variant="outline" size="icon" className="border-2 border-foreground">
                <Search className="h-4 w-4" />
              </Button>
            </form>
            <nav className="flex flex-col gap-4">
              <Link
                to="/movies"
                className="flex items-center gap-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <Film className="h-4 w-4" />
                Movies
              </Link>
              <Link
                to="/series"
                className="flex items-center gap-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <Tv className="h-4 w-4" />
                Series
              </Link>
              <Link
                to="/live-sports"
                className="flex items-center gap-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <Radio className="h-4 w-4" />
                Live Sports
              </Link>
              <Link
                to="/watch-later"
                className="flex items-center gap-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <Clock className="h-4 w-4" />
                Watch Later
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};
