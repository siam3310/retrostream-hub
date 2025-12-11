import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Edit, Trash2, Star, Plus, Search, Check } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { MovieOrSeries } from '@/lib/types';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/hooks/use-toast';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

const ITEMS_PER_PAGE = 10;

const AdminMedia = () => {
  const [media, setMedia] = useState<MovieOrSeries[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const fetchMedia = async () => {
    setLoading(true);
    const { data } = await supabase.from('moviesandseries').select('*').order('dateAdded', { ascending: false });
    if (data) setMedia(data as unknown as MovieOrSeries[]);
    setLoading(false);
  };

  useEffect(() => { fetchMedia(); }, []);

  // Filter media based on search and type
  const filteredMedia = media.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.category?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || item.type === typeFilter;
    return matchesSearch && matchesType;
  });

  // Pagination
  const totalPages = Math.ceil(filteredMedia.length / ITEMS_PER_PAGE);
  const paginatedMedia = filteredMedia.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const toggleFeatured = async (item: MovieOrSeries) => {
    await supabase.from('moviesandseries').update({ featured: !item.featured }).eq('id', item.id);
    toast({ title: `${item.featured ? 'Unfeatured' : 'Featured'} ${item.title}` });
    fetchMedia();
  };

  const deleteItem = async (id: string) => {
    if (!confirm('Delete this item?')) return;
    await supabase.from('moviesandseries').delete().eq('id', id);
    toast({ title: 'Deleted' });
    fetchMedia();
  };

  const toggleSelectItem = (id: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedItems(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedItems.size === paginatedMedia.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(paginatedMedia.map(item => item.id)));
    }
  };

  const bulkDelete = async () => {
    if (selectedItems.size === 0) return;
    if (!confirm(`Delete ${selectedItems.size} items?`)) return;
    
    for (const id of selectedItems) {
      await supabase.from('moviesandseries').delete().eq('id', id);
    }
    
    toast({ title: `Deleted ${selectedItems.size} items` });
    setSelectedItems(new Set());
    fetchMedia();
  };

  return (
    <AdminLayout title="Manage Media">
      {/* Search and Filter Bar */}
      <div className="mb-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by title or category..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            className="pl-10"
          />
        </div>
        <select
          value={typeFilter}
          onChange={(e) => { setTypeFilter(e.target.value); setCurrentPage(1); }}
          className="px-3 py-2 border rounded-md bg-background text-foreground"
        >
          <option value="all">All Types</option>
          <option value="Movie">Movies</option>
          <option value="Series">Series</option>
        </select>
        <Link to="/admin/add">
          <Button><Plus className="mr-2 h-4 w-4" /> Add</Button>
        </Link>
      </div>

      {/* Bulk Actions */}
      {selectedItems.size > 0 && (
        <div className="mb-4 p-3 bg-muted rounded-md flex items-center justify-between">
          <span>{selectedItems.size} selected</span>
          <Button variant="destructive" size="sm" onClick={bulkDelete}>
            <Trash2 className="mr-2 h-4 w-4" /> Delete Selected
          </Button>
        </div>
      )}
      
      {loading ? (
        <p>Loading...</p>
      ) : filteredMedia.length === 0 ? (
        <p className="text-muted-foreground">No content found.</p>
      ) : (
        <>
          <div className="border rounded-md overflow-hidden">
            <div className="grid grid-cols-[40px_1fr_80px_60px_100px] gap-2 border-b bg-muted p-3 font-bold text-sm">
              <div className="flex items-center">
                <Checkbox
                  checked={selectedItems.size === paginatedMedia.length && paginatedMedia.length > 0}
                  onCheckedChange={toggleSelectAll}
                />
              </div>
              <span>Title</span>
              <span>Type</span>
              <span>Year</span>
              <span className="text-right">Actions</span>
            </div>
            {paginatedMedia.map((item) => (
              <div key={item.id} className="grid grid-cols-[40px_1fr_80px_60px_100px] gap-2 border-b border-border/50 p-3 items-center text-sm">
                <div className="flex items-center">
                  <Checkbox
                    checked={selectedItems.has(item.id)}
                    onCheckedChange={() => toggleSelectItem(item.id)}
                  />
                </div>
                <div className="flex items-center gap-2 truncate">
                  <span className="font-medium truncate">{item.title}</span>
                  {item.featured && <Star className="h-3 w-3 text-yellow-500 fill-yellow-500 flex-shrink-0" />}
                </div>
                <span className="text-muted-foreground text-xs">{item.type}</span>
                <span className="text-muted-foreground text-xs">{item.year}</span>
                <div className="flex justify-end gap-1">
                  <Button size="icon" variant="ghost" onClick={() => toggleFeatured(item)} className="h-7 w-7">
                    <Star className={`h-3 w-3 ${item.featured ? 'fill-yellow-500 text-yellow-500' : ''}`} />
                  </Button>
                  <Link to={`/admin/edit/${item.slug}`}>
                    <Button size="icon" variant="ghost" className="h-7 w-7"><Edit className="h-3 w-3" /></Button>
                  </Link>
                  <Button size="icon" variant="ghost" onClick={() => deleteItem(item.id)} className="h-7 w-7">
                    <Trash2 className="h-3 w-3 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-4">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    return (
                      <PaginationItem key={pageNum}>
                        <PaginationLink
                          onClick={() => setCurrentPage(pageNum)}
                          isActive={currentPage === pageNum}
                          className="cursor-pointer"
                        >
                          {pageNum}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </>
      )}
    </AdminLayout>
  );
};

export default AdminMedia;
