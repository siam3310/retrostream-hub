import { Plus, Trash2, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export interface VideoSource {
  name: string;
  url: string;
  type: string;
}

export interface DownloadLink {
  quality: string;
  size: string;
  url: string;
}

interface VideoSourceManagerProps {
  sources: VideoSource[];
  onChange: (sources: VideoSource[]) => void;
}

export function VideoSourceManager({ sources, onChange }: VideoSourceManagerProps) {
  const addSource = () => {
    onChange([...sources, { name: `Server ${sources.length + 1}`, url: '', type: 'iframe' }]);
  };

  const removeSource = (index: number) => {
    onChange(sources.filter((_, i) => i !== index));
  };

  const updateSource = (index: number, field: keyof VideoSource, value: string) => {
    const updated = [...sources];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-lg">Video Sources</h3>
        <Button type="button" variant="outline" size="sm" onClick={addSource} className="border-2 border-foreground">
          <Plus className="mr-1 h-4 w-4" /> Add
        </Button>
      </div>
      
      {sources.length === 0 ? (
        <p className="text-muted-foreground text-sm py-4 text-center border-2 border-dashed border-muted rounded-lg">
          No video sources. Click "Add" to add one.
        </p>
      ) : (
        <div className="space-y-2">
          {sources.map((source, index) => (
            <div key={index} className="flex items-center gap-2 p-3 border-2 border-foreground rounded-lg bg-card">
              <GripVertical className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <Input
                value={source.name}
                onChange={(e) => updateSource(index, 'name', e.target.value)}
                placeholder="Name"
                className="border-2 border-foreground w-28"
              />
              <Input
                value={source.url}
                onChange={(e) => updateSource(index, 'url', e.target.value)}
                placeholder="URL (iframe/video link)"
                className="border-2 border-foreground flex-1"
              />
              <Select value={source.type} onValueChange={(v) => updateSource(index, 'type', v)}>
                <SelectTrigger className="border-2 border-foreground w-28">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="iframe">Iframe</SelectItem>
                  <SelectItem value="video">Direct</SelectItem>
                  <SelectItem value="m3u8">M3U8</SelectItem>
                </SelectContent>
              </Select>
              <Button 
                type="button" 
                variant="ghost" 
                size="icon" 
                onClick={() => removeSource(index)}
                className="text-destructive hover:text-destructive flex-shrink-0"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

interface DownloadLinkManagerProps {
  links: DownloadLink[];
  onChange: (links: DownloadLink[]) => void;
}

export function DownloadLinkManager({ links, onChange }: DownloadLinkManagerProps) {
  const addLink = () => {
    onChange([...links, { quality: '720p', size: '', url: '' }]);
  };

  const removeLink = (index: number) => {
    onChange(links.filter((_, i) => i !== index));
  };

  const updateLink = (index: number, field: keyof DownloadLink, value: string) => {
    const updated = [...links];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-lg">Download Links</h3>
        <Button type="button" variant="outline" size="sm" onClick={addLink} className="border-2 border-foreground">
          <Plus className="mr-1 h-4 w-4" /> Add
        </Button>
      </div>
      
      {links.length === 0 ? (
        <p className="text-muted-foreground text-sm py-4 text-center border-2 border-dashed border-muted rounded-lg">
          No download links. Click "Add" to add one.
        </p>
      ) : (
        <div className="space-y-2">
          {links.map((link, index) => (
            <div key={index} className="flex items-center gap-2 p-3 border-2 border-foreground rounded-lg bg-card">
              <GripVertical className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <Input
                value={link.quality}
                onChange={(e) => updateLink(index, 'quality', e.target.value)}
                placeholder="Quality"
                className="border-2 border-foreground w-24"
              />
              <Input
                value={link.size}
                onChange={(e) => updateLink(index, 'size', e.target.value)}
                placeholder="Size"
                className="border-2 border-foreground w-24"
              />
              <Input
                value={link.url}
                onChange={(e) => updateLink(index, 'url', e.target.value)}
                placeholder="Download URL"
                className="border-2 border-foreground flex-1"
              />
              <Button 
                type="button" 
                variant="ghost" 
                size="icon" 
                onClick={() => removeLink(index)}
                className="text-destructive hover:text-destructive flex-shrink-0"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
