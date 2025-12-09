export interface MovieOrSeries {
  id: string;
  slug: string;
  title: string | null;
  year: number | null;
  category: string | null;
  type: 'Movie' | 'Series' | null;
  rating: string | null;
  genre: string[] | null;
  description: string | null;
  posterUrl: string | null;
  backdropUrl: string | null;
  videoSources: VideoSource[] | null;
  downloadLinks: DownloadLink[] | null;
  featured: boolean | null;
  dateAdded: string;
}

export interface VideoSource {
  name: string;
  url: string;
}

export interface DownloadLink {
  quality: string;
  url: string;
}

export interface LiveMatch {
  id: number;
  created_at: string;
  team1_name: string;
  team1_logo: string | null;
  team2_name: string;
  team2_logo: string | null;
  tournament: string | null;
  start_time: string | null;
  status: 'live' | 'upcoming' | 'finished' | null;
  stream_links: StreamLink[] | null;
}

export interface StreamLink {
  name: string;
  url: string;
}
