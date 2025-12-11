-- Drop existing restrictive policies for live_matches
DROP POLICY IF EXISTS "Allow all for authenticated" ON public.live_matches;
DROP POLICY IF EXISTS "Allow public read access" ON public.live_matches;

-- Create permissive policies for live_matches (admin uses localStorage auth, not Supabase auth)
CREATE POLICY "Allow public read access" ON public.live_matches
FOR SELECT USING (true);

CREATE POLICY "Allow public insert" ON public.live_matches
FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update" ON public.live_matches
FOR UPDATE USING (true);

CREATE POLICY "Allow public delete" ON public.live_matches
FOR DELETE USING (true);

-- Do the same for moviesandseries table
DROP POLICY IF EXISTS "Allow all for authenticated" ON public.moviesandseries;
DROP POLICY IF EXISTS "Allow public read access" ON public.moviesandseries;

CREATE POLICY "Allow public read access" ON public.moviesandseries
FOR SELECT USING (true);

CREATE POLICY "Allow public insert" ON public.moviesandseries
FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update" ON public.moviesandseries
FOR UPDATE USING (true);

CREATE POLICY "Allow public delete" ON public.moviesandseries
FOR DELETE USING (true);