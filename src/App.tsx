import { useEffect } from 'react';
import { Outlet, Route, Routes, useLocation } from 'react-router-dom';
import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';
import DetailPage from '@/pages/DetailPage';
import GenrePage from '@/pages/GenrePage';
import HomePage from '@/pages/HomePage';
import NotFoundPage from '@/pages/NotFoundPage';
import PersonDetailPage from '@/pages/PersonDetailPage';
import PlatformDetailPage from '@/pages/PlatformDetailPage';
import PlatformsPage from '@/pages/PlatformsPage';
import PresetListPage from '@/pages/PresetListPage';
import SearchPage from '@/pages/SearchPage';
import TvShowsPage from '@/pages/TvShowsPage';
import WhatToWatchPage from '@/pages/WhatToWatchPage';

function AppLayout() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [pathname]);

  return (
    <div className="flex min-h-screen flex-col bg-neutral-950 text-neutral-100">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<HomePage />} />
        <Route path="liste/:presetId" element={<PresetListPage />} />
        <Route path="tur/:mediaType/:genreId" element={<GenrePage />} />
        <Route path="platformlar" element={<PlatformsPage />} />
        <Route path="tv-dizileri" element={<TvShowsPage />} />
        <Route path="platform/:slug" element={<PlatformDetailPage />} />
        <Route path="ne-izlesem" element={<WhatToWatchPage />} />
        <Route path="ara" element={<SearchPage />} />
        <Route path="film/:id" element={<DetailPage mediaType="movie" />} />
        <Route path="dizi/:id" element={<DetailPage mediaType="tv" />} />
        <Route path="sanatcilar/:id" element={<PersonDetailPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
