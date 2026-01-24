-- Drop all existing policies for moviesandseries
DROP POLICY IF EXISTS "Allow public read access " ON public.moviesandseries;
DROP POLICY IF EXISTS "Allow public insert " ON public.moviesandseries;
DROP POLICY IF EXISTS "Allow public update " ON public.moviesandseries;
DROP POLICY IF EXISTS "Allow public delete " ON public.moviesandseries;

-- Drop all existing policies for live_matches
DROP POLICY IF EXISTS "Allow public read access " ON public.live_matches;
DROP POLICY IF EXISTS "Allow public insert " ON public.live_matches;
DROP POLICY IF EXISTS "Allow public update " ON public.live_matches;
DROP POLICY IF EXISTS "Allow public delete " ON public.live_matches;

-- Create PERMISSIVE policies for moviesandseries
CREATE POLICY "Public read access" ON public.moviesandseries
  FOR SELECT
  USING (true);

CREATE POLICY "Public insert access" ON public.moviesandseries
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Public update access" ON public.moviesandseries
  FOR UPDATE
  USING (true);

CREATE POLICY "Public delete access" ON public.moviesandseries
  FOR DELETE
  USING (true);

-- Create PERMISSIVE policies for live_matches
CREATE POLICY "Public read access" ON public.live_matches
  FOR SELECT
  USING (true);

CREATE POLICY "Public insert access" ON public.live_matches
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Public update access" ON public.live_matches
  FOR UPDATE
  USING (true);

CREATE POLICY "Public delete access" ON public.live_matches
  FOR DELETE
  USING (true);