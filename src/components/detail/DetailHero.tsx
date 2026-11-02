import { Play, Star } from 'lucide-react';
import { useState } from 'react';
import TrailerModal from '@/components/detail/TrailerModal';
import { formatCount, formatRuntime, mediaTypeLabel } from '@/lib/format';
import { tmdbImage } from '@/services/tmdb';
import type { MediaDetail } from '@/types/media';

interface DetailHeroProps {
  detail: MediaDetail;
}

export default function DetailHero({ detail }: DetailHeroProps) {
  const [trailerOpen, setTrailerOpen] = useState(false);
  const backdrop = tmdbImage(detail.backdropPath, 'w1280');
  const poster = tmdbImage(detail.posterPath, 'w500');
  const title = detail.title || 'İsimsiz';

  const runtime = formatRuntime(detail.runtime);
  const runtimeLabel = runtime && detail.mediaType === 'tv' ? `${runtime} / bölüm` : runtime;
  const seasonLabel = detail.seasons ? `${detail.seasons} sezon` : null;
  const meta = [mediaTypeLabel(detail.mediaType), detail.year || null, runtimeLabel, seasonLabel].filter(
    (value): value is string => Boolean(value),
  );

  return (
    <section className="theme-dark relative isolate overflow-hidden">
      {backdrop && (
        <img src={backdrop} alt="" aria-hidden="true" className="absolute inset-0 -z-10 h-full w-full object-cover" />
      )}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black via-black/85 to-black/50" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black via-black/30 to-transparent" />

      <div className="mx-auto flex max-w-7xl flex-col items-center gap-10 px-4 pb-14 pt-28 sm:px-6 md:flex-row md:items-end lg:gap-14 lg:px-8 lg:pt-36">
        <div className="w-56 shrink-0 animate-fade-up sm:w-64">
          {poster ? (
            <img
              src={poster}
              alt={`${title} posteri`}
              className="w-full rounded-2xl object-cover shadow-2xl ring-1 ring-white/10"
            />
          ) : (
            <div className="aspect-[2/3] w-full rounded-2xl bg-neutral-800 ring-1 ring-white/10" />
          )}
        </div>

        <div className="min-w-0 flex-1 space-y-6 text-center animate-fade-up md:text-left">
          <div className="space-y-3">
            <p className="text-sm text-neutral-300">{meta.join(' · ')}</p>
            <h1 className="text-4xl font-bold leading-tight text-white sm:text-5xl">{title}</h1>
            {detail.tagline && <p className="text-base italic text-neutral-300">{detail.tagline}</p>}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-sm md:justify-start">
            {detail.voteCount > 0 ? (
              <>
                <span className="flex items-center gap-1.5 text-base font-bold text-amber-300">
                  <Star className="h-5 w-5 fill-current" />
                  {detail.rating.toFixed(1)}
                  <span className="text-sm font-normal text-neutral-400">/ 10</span>
                </span>
                <span className="text-neutral-400">{formatCount(detail.voteCount)} oy</span>
              </>
            ) : (
              <span className="text-neutral-400">Henüz puanlanmadı</span>
            )}
          </div>

          {detail.genres.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 md:justify-start">
              {detail.genres.map((genre) => (
                <span
                  key={genre.id}
                  className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-neutral-200"
                >
                  {genre.name}
                </span>
              ))}
            </div>
          )}

          <p className="mx-auto max-w-2xl text-base leading-relaxed text-neutral-200 md:mx-0">
            {detail.overview || 'Bu içerik için özet bulunmuyor.'}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 md:justify-start">
            {detail.trailerKey ? (
              <button
                type="button"
                onClick={() => setTrailerOpen(true)}
                className="inline-flex items-center gap-2 rounded-full bg-amber-400 px-6 py-3 text-sm font-semibold text-black transition hover:bg-amber-300"
              >
                <Play className="h-4 w-4 fill-current" />
                Fragmanı İzle
              </button>
            ) : (
              <span className="text-sm text-neutral-400">Bu içerik için fragman bulunamadı.</span>
            )}
          </div>

          <div className="space-y-3 pt-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
              Türkiye'de izleyebileceğin platformlar
            </p>
            {detail.providers.length > 0 ? (
              <div className="flex flex-wrap justify-center gap-2 md:justify-start">
                {detail.providers.map((provider) => (
                  <span
                    key={provider.id}
                    className="rounded-lg border border-amber-400/30 bg-amber-400/10 px-3 py-1.5 text-sm font-semibold text-amber-200"
                  >
                    {provider.name}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-neutral-400">Türkiye'de bu içerik için abonelik platformu bulunamadı.</p>
            )}
          </div>
        </div>
      </div>

      {trailerOpen && detail.trailerKey && (
        <TrailerModal youtubeKey={detail.trailerKey} title={title} onClose={() => setTrailerOpen(false)} />
      )}
    </section>
  );
}
