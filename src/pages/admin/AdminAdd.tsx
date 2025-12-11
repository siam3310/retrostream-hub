import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const TMDB_API_KEY = '614923b097c805c62a593b1827db1524';

interface TMDBResult {
  id: number;
  title?: string;
  name?: string;
  poster_path: string | null;
  release_date?: string;
  first_air_date?: string;
  overview: string;
}

const AdminAdd = () => {
  const navigate = useNavigate();
  const [contentType, setContentType] = useState<'movie' | 'tv'>('movie');
  const [searchQuery, setSearchQuery] = useState('');
  const [tmdbId, setTmdbId] = useState('');
  const [searchResults, setSearchResults] = useState<TMDBResult[]>([]);
  const [loading, setLoading] = useState(false);

  const searchTMDB = async () => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/search/${contentType}?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(searchQuery)}`
      );
      const data = await response.json();
      setSearchResults(data.results || []);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to search TMDB', variant: 'destructive' });
    }
    setLoading(false);
  };

  const fetchById = async () => {
    if (!tmdbId.trim()) return;
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/${contentType}/${tmdbId}?api_key=${TMDB_API_KEY}`
      );
      if (!response.ok) throw new Error('Not found');
      const data = await response.json();
      navigateToForm(data);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to fetch from TMDB', variant: 'destructive' });
    }
    setLoading(false);
  };

  const navigateToForm = (data: any) => {
    const params = new URLSearchParams({
      tmdbId: data.id.toString(),
      title: data.title || data.name || '',
      year: (data.release_date || data.first_air_date || '').split('-')[0],
      type: contentType === 'movie' ? 'Movie' : 'Series',
      description: data.overview || '',
      posterUrl: data.poster_path ? `https://image.tmdb.org/t/p/w500${data.poster_path}` : '',
      backdropUrl: data.backdrop_path ? `https://image.tmdb.org/t/p/w1280${data.backdrop_path}` : '',
      rating: data.vote_average ? `${data.vote_average.toFixed(1)}/10` : '',
      genre: (data.genres || []).map((g: any) => g.name).join(', '),
    });
    navigate(`/admin/add/manual?${params.toString()}`);
  };

  const selectResult = (result: TMDBResult) => {
    fetch(`https://api.themoviedb.org/3/${contentType}/${result.id}?api_key=${TMDB_API_KEY}`)
      .then(res => res.json())
      .then(data => navigateToForm(data));
  };

  return (
    <AdminLayout title="Add Content" description="Import from TMDB or add manually.">
      <div className="max-w-4xl space-y-8">
        {/* Option 1: Import from TMDB */}
        <div className="border-2 border-foreground p-6">
          <h2 className="mb-2 text-xl font-bold">Option 1: Import from TMDB</h2>
          <p className="mb-4 text-muted-foreground">
            This is the recommended method. Search for a movie or series on The Movie Database (TMDB) to pre-fill most of the fields automatically.
          </p>

          <div className="mb-4 flex items-center gap-4">
            <Select value={contentType} onValueChange={(v) => setContentType(v as 'movie' | 'tv')}>
              <SelectTrigger className="w-32 border-2 border-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="movie">Movie</SelectItem>
                <SelectItem value="tv">Series</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-muted-foreground">Select the content type for searching or importing by ID.</span>
          </div>

          <div className="mb-4 flex gap-2">
            <Input
              placeholder={`Search for a ${contentType === 'movie' ? 'movie' : 'series'} by title...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && searchTMDB()}
              className="border-2 border-foreground"
            />
            <Button onClick={searchTMDB} disabled={loading} className="border-2 border-foreground">
              <Search className="mr-2 h-4 w-4" /> Search
            </Button>
          </div>

          {searchResults.length > 0 && (
            <div className="mb-4 max-h-64 overflow-y-auto border-2 border-foreground">
              {searchResults.map((result) => (
                <div
                  key={result.id}
                  className="flex cursor-pointer items-center gap-3 border-b border-border p-3 hover:bg-muted"
                  onClick={() => selectResult(result)}
                >
                  {result.poster_path ? (
                    <img
                      src={`https://image.tmdb.org/t/p/w92${result.poster_path}`}
                      alt=""
                      className="h-16 w-12 object-cover"
                    />
                  ) : (
                    <div className="flex h-16 w-12 items-center justify-center bg-muted text-xs">No Image</div>
                  )}
                  <div>
                    <p className="font-bold">{result.title || result.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(result.release_date || result.first_air_date || '').split('-')[0]}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="relative my-6 flex items-center">
            <div className="flex-grow border-t border-border"></div>
            <span className="mx-4 text-muted-foreground">OR</span>
            <div className="flex-grow border-t border-border"></div>
          </div>

          <div className="flex gap-2">
            <Input
              placeholder={`Import a ${contentType === 'movie' ? 'movie' : 'series'} by TMDB ID...`}
              value={tmdbId}
              onChange={(e) => setTmdbId(e.target.value)}
              className="border-2 border-foreground"
            />
            <Button onClick={fetchById} disabled={loading} className="border-2 border-foreground">
              <Search className="mr-2 h-4 w-4" /> Fetch by ID
            </Button>
          </div>
        </div>

        <div className="relative flex items-center">
          <div className="flex-grow border-t border-border"></div>
          <span className="mx-4 text-muted-foreground">OR</span>
          <div className="flex-grow border-t border-border"></div>
        </div>

        {/* Option 2: Add Manually */}
        <div className="border-2 border-foreground p-6">
          <h2 className="mb-2 text-xl font-bold">Option 2: Add Manually</h2>
          <p className="mb-4 text-muted-foreground">
            If you can't find the content on TMDB or want to enter all the details yourself, use the manual entry form.
          </p>
          <Link to="/admin/add/manual">
            <Button variant="outline" className="border-2 border-foreground">
              Go to Manual Entry Form
            </Button>
          </Link>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminAdd;
