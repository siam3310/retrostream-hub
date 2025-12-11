import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { WatchLaterProvider } from "@/contexts/WatchLaterContext";
import { AdminProvider } from "@/contexts/AdminContext";
import Index from "./pages/Index";
import Movies from "./pages/Movies";
import Series from "./pages/Series";
import MovieDetail from "./pages/MovieDetail";
import SeriesDetail from "./pages/SeriesDetail";
import LiveSports from "./pages/LiveSports";
import Search from "./pages/Search";
import WatchLater from "./pages/WatchLater";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminMedia from "./pages/admin/AdminMedia";
import AdminAdd from "./pages/admin/AdminAdd";
import AdminAddManual from "./pages/admin/AdminAddManual";
import AdminEdit from "./pages/admin/AdminEdit";
import AdminLiveMatches from "./pages/admin/AdminLiveMatches";
import AdminAddMatch from "./pages/admin/AdminAddMatch";
import AdminEditMatch from "./pages/admin/AdminEditMatch";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <WatchLaterProvider>
        <AdminProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/movies" element={<Movies />} />
              <Route path="/series" element={<Series />} />
              <Route path="/movies/:slug" element={<MovieDetail />} />
              <Route path="/series/:slug" element={<SeriesDetail />} />
              <Route path="/live-sports" element={<LiveSports />} />
              <Route path="/search" element={<Search />} />
              <Route path="/watch-later" element={<WatchLater />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/media" element={<AdminMedia />} />
              <Route path="/admin/add" element={<AdminAdd />} />
              <Route path="/admin/add/manual" element={<AdminAddManual />} />
              <Route path="/admin/edit/:slug" element={<AdminEdit />} />
              <Route path="/admin/live-matches" element={<AdminLiveMatches />} />
              <Route path="/admin/live-matches/add" element={<AdminAddMatch />} />
              <Route path="/admin/live-matches/edit/:id" element={<AdminEditMatch />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AdminProvider>
      </WatchLaterProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
