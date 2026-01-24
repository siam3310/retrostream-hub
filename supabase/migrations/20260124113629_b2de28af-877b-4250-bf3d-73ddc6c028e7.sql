-- Enable realtime for both tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.moviesandseries;
ALTER PUBLICATION supabase_realtime ADD TABLE public.live_matches;