import GenreTiles from '@/components/home/GenreTiles';
import HeroBanner from '@/components/home/HeroBanner';
import MediaRow from '@/components/common/MediaRow';
import { ErrorState } from '@/components/common/StateMessage';
import PlatformBrowser from '@/components/platforms/PlatformBrowser';
import { useAsync } from '@/hooks/useAsync';
import { getCategory, getGenres, getTrending } from '@/services/tmdb';

export default function HomePage() {
  const trending = useAsync(() => getTrending('week', 'all'), []);
  const trendingMovies = useAsync(() => getTrending('week', 'movie'), []);
  const trendingTv = useAsync(() => getTrending('week', 'tv'), []);
  const newMovies = useAsync(() => getCategory('/movie/now_playing', 'movie'), []);
  const movieGenres = useAsync(() => getGenres('movie'), []);

  const heroItems = (trending.data?.items ?? []).filter((item) => item.backdropPath).slice(0, 6);

  return (
    <div className="pb-20">
      {trending.loading && <div className="h-[80vh] min-h-[520px] animate-pulse bg-neutral-900/60" />}
      {trending.error && (
        <div className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 lg:px-8">
          <ErrorState message={trending.error} />
        </div>
      )}
      {!trending.loading && !trending.error && <HeroBanner items={heroItems} />}

      <div className="mx-auto mt-16 flex max-w-7xl flex-col gap-20 px-4 sm:px-6 lg:px-8">
        <MediaRow
          title="Trend Filmler"
          items={trendingMovies.data?.items ?? []}
          isLoading={trendingMovies.loading}
          error={trendingMovies.error}
          viewAllTo="/liste/filmler-populer"
        />
        <MediaRow
          title="Trend Diziler"
          items={trendingTv.data?.items ?? []}
          isLoading={trendingTv.loading}
          error={trendingTv.error}
          viewAllTo="/liste/diziler-populer"
        />
        <MediaRow
          title="Yeni Çıkanlar"
          items={newMovies.data?.items ?? []}
          isLoading={newMovies.loading}
          error={newMovies.error}
          viewAllTo="/liste/filmler-vizyonda"
        />

        <section className="space-y-6">
          <div className="flex flex-col gap-2">
            <h2 className="text-xl font-bold text-neutral-50 sm:text-2xl">Türlere Göre Keşfet</h2>
            <p className="text-sm text-neutral-400">İlgini çeken türü seç, o türdeki en iyi yapımları gör.</p>
          </div>
          {movieGenres.loading && (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
              {Array.from({ length: 12 }, (_, index) => (
                <div key={index} className="h-16 animate-pulse rounded-xl bg-neutral-800/70" />
              ))}
            </div>
          )}
          {movieGenres.error && <ErrorState message={movieGenres.error} />}
          {movieGenres.data && <GenreTiles genres={movieGenres.data} mediaType="movie" />}
        </section>

        <section className="space-y-6">
          <div className="flex flex-col gap-2">
            <h2 className="text-xl font-bold text-neutral-50 sm:text-2xl">Platformlara Göre İzle</h2>
            <p className="text-sm text-neutral-400">Abone olduğun platformdaki film ve dizileri tek tıkla bul.</p>
          </div>
          <PlatformBrowser />
        </section>
      </div>
    </div>
  );
}
