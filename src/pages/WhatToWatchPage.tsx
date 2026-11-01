import { ArrowRight, Shuffle, Sparkles, Star } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import MediaRow from '@/components/common/MediaRow';
import PageHeader from '@/components/common/PageHeader';
import { ErrorState } from '@/components/common/StateMessage';
import { useAsync } from '@/hooks/useAsync';
import { mediaPath, mediaTypeLabel } from '@/lib/format';
import {
  discoverMedia,
  getCategory,
  getErrorMessage,
  getGenres,
  getTrending,
  tmdbImage,
} from '@/services/tmdb';
import type { MediaItem, MediaType } from '@/types/media';

const TYPE_OPTIONS: { value: MediaType; label: string }[] = [
  { value: 'movie', label: 'Film' },
  { value: 'tv', label: 'Dizi' },
];

const MOOD_CHIPS = ['Büyüme hikayesi', 'Yanlış kimlik', 'Tıbbi kriz', 'Sıfırdan zirveye', 'Kardeş rekabeti', 'İntikam', 'Zaman yolculuğu'];

const topRatedPath = (mediaType: MediaType) => (mediaType === 'movie' ? '/movie/top_rated' : '/tv/top_rated');
const popularPath = (mediaType: MediaType) => (mediaType === 'movie' ? '/movie/popular' : '/tv/popular');

function pickRandom<T>(items: T[]): T | null {
  return items.length > 0 ? items[Math.floor(Math.random() * items.length)] : null;
}

function RecommendationRow({
  title,
  mediaType,
  load,
}: {
  title: string;
  mediaType: MediaType;
  load: () => Promise<{ items: MediaItem[] }>;
}) {
  const state = useAsync(load, [mediaType]);
  return (
    <MediaRow
      title={title}
      items={state.data?.items ?? []}
      isLoading={state.loading}
      error={state.error}
    />
  );
}

export default function WhatToWatchPage() {
  const [mediaType, setMediaType] = useState<MediaType>('movie');
  const [genreId, setGenreId] = useState<number | null>(null);
  const [pick, setPick] = useState<MediaItem | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const genres = useAsync(() => getGenres(mediaType), [mediaType]);
  const topRated = useAsync(
    () => getCategory(topRatedPath(mediaType), mediaType).then((result) => result.items.slice(0, 5)),
    [mediaType],
  );

  const changeType = (type: MediaType) => {
    setMediaType(type);
    setGenreId(null);
    setPick(null);
    setError(null);
  };

  const recommend = async () => {
    setBusy(true);
    setError(null);
    try {
      const page = 1 + Math.floor(Math.random() * 5);
      const result = await discoverMedia(mediaType, {
        page,
        genreId: genreId ?? undefined,
        sortBy: 'vote_average.desc',
        minVotes: 300,
      });
      const next = pickRandom(result.items);
      if (!next) {
        setPick(null);
        setError('Bu seçime uygun bir öneri bulunamadı. Başka bir tür deneyebilirsin.');
        return;
      }
      setPick(next);
    } catch (err) {
      setPick(null);
      setError(getErrorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  const backdrop = pick ? tmdbImage(pick.backdropPath, 'w1280') : null;
  const poster = pick ? tmdbImage(pick.posterPath, 'w500') : null;

  return (
    <div className="mx-auto max-w-7xl space-y-12 px-4 pb-20 pt-12 sm:px-6 lg:px-8">
      <PageHeader
        eyebrow="Ne İzlesem?"
        title="Bugün ne izlemek istiyorsun?"
        description="Film mi dizi mi, hangi türde olsun? Seçimini yap, sana en yüksek puanlı yapımlardan bir öneri getirelim."
      />

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0 space-y-12">
          <section className="space-y-6 rounded-2xl border border-white/10 bg-neutral-900/60 p-6">
            <div className="flex flex-wrap items-center gap-3">
              {TYPE_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => changeType(option.value)}
                  aria-pressed={mediaType === option.value}
                  className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                    mediaType === option.value
                      ? 'bg-amber-400 text-neutral-950'
                      : 'border border-white/10 bg-white/5 text-neutral-200 hover:border-amber-400/50'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>

            <div className="space-y-3">
              <p className="text-sm font-semibold text-neutral-200">Tür</p>
              {genres.loading && <div className="h-8 animate-pulse rounded-full bg-neutral-800/70" />}
              {genres.error && <ErrorState message={genres.error} />}
              {genres.data && (
                <div className="flex flex-wrap gap-2">
                  {[{ id: null, name: 'Tümü' }, ...genres.data].map((genre) => (
                    <button
                      key={genre.id ?? 'all'}
                      type="button"
                      onClick={() => setGenreId(genre.id)}
                      aria-pressed={genreId === genre.id}
                      className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                        genreId === genre.id
                          ? 'bg-amber-400 text-neutral-950'
                          : 'border border-white/10 bg-white/5 text-neutral-200 hover:border-amber-400/50'
                      }`}
                    >
                      {genre.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={recommend}
              disabled={busy || genres.loading}
              className="flex items-center justify-center gap-2 rounded-full bg-amber-400 px-6 py-3 text-sm font-semibold text-neutral-950 transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Shuffle className="h-4 w-4" />
              {busy ? 'Öneri hazırlanıyor...' : 'Bana Bir Öneri Getir'}
            </button>

            {error && <ErrorState message={error} />}
            {!error && busy && <div className="aspect-[16/8] animate-pulse rounded-2xl bg-neutral-800/70" />}
            {!error && !busy && !pick && (
              <div className="flex items-center gap-3 rounded-2xl border border-dashed border-white/10 px-5 py-6 text-sm text-neutral-400">
                <Sparkles className="h-5 w-5 shrink-0 text-amber-400" />
                Seçimini yap ve öneri butonuna dokun. Sonuç burada görünecek.
              </div>
            )}
            {!error && !busy && pick && (
              <article
                key={`${pick.mediaType}-${pick.id}`}
                className="animate-fade-up overflow-hidden rounded-2xl border border-white/10 bg-neutral-900"
              >
                <div className="relative aspect-[16/7] bg-neutral-800">
                  {backdrop && (
                    <img src={backdrop} alt="" aria-hidden="true" className="h-full w-full object-cover" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/40 to-transparent" />
                </div>
                <div className="-mt-20 relative flex gap-5 p-6 sm:p-8">
                  <div className="hidden w-28 shrink-0 overflow-hidden rounded-xl shadow-xl ring-1 ring-white/10 sm:block">
                    {poster ? (
                      <img src={poster} alt={pick.title} className="h-full w-full object-cover" />
                    ) : (
                      <div className="aspect-[2/3] bg-neutral-800" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1 space-y-3">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-300">
                      <span className="rounded-md bg-amber-400 px-2 py-0.5 font-bold uppercase text-neutral-950">
                        {mediaTypeLabel(pick.mediaType)}
                      </span>
                      {pick.year && <span>{pick.year}</span>}
                      {pick.voteCount > 0 && (
                        <span className="flex items-center gap-1 font-semibold text-amber-300">
                          <Star className="h-3.5 w-3.5 fill-current" />
                          {pick.rating.toFixed(1)}
                        </span>
                      )}
                    </div>
                    <h2 className="text-2xl font-bold text-white sm:text-3xl">{pick.title}</h2>
                    <p className="line-clamp-3 text-sm leading-relaxed text-neutral-300">
                      {pick.overview || 'Bu içerik için özet bulunmuyor.'}
                    </p>
                    <div className="flex flex-wrap gap-3 pt-2">
                      <Link
                        to={mediaPath(pick)}
                        className="inline-flex items-center gap-2 rounded-full bg-amber-400 px-5 py-2.5 text-sm font-semibold text-neutral-950 transition hover:bg-amber-300"
                      >
                        Detayları Gör
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                      <button
                        type="button"
                        onClick={recommend}
                        className="rounded-full border border-white/15 px-5 py-2.5 text-sm font-semibold text-neutral-100 transition hover:border-amber-400/60 hover:text-amber-300"
                      >
                        Başka Öner
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            )}
          </section>

          <div className="flex flex-wrap gap-2">
            {MOOD_CHIPS.map((chip) => (
              <span
                key={chip}
                className="rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-1.5 text-xs font-semibold text-amber-200"
              >
                {chip}
              </span>
            ))}
          </div>

          <RecommendationRow
            title="Bu Akşam Ne İzlesek?"
            mediaType={mediaType}
            load={() => getTrending('week', mediaType).then((result) => ({ items: result.items }))}
          />
          <RecommendationRow
            title="Ters Köşe Sevenlere"
            mediaType={mediaType}
            load={() => discoverMedia(mediaType, { page: 2, sortBy: 'vote_average.desc', minVotes: 500 })}
          />
          <RecommendationRow
            title="Az Vaktin Varsa"
            mediaType={mediaType}
            load={() => getCategory(popularPath(mediaType), mediaType, 2)}
          />
          <RecommendationRow
            title="Gizli Kalmış İyiler"
            mediaType={mediaType}
            load={() => discoverMedia(mediaType, { page: 3, sortBy: 'vote_average.desc', minVotes: 150 })}
          />
        </div>

        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-white/10 bg-neutral-900/60 p-6">
            <h2 className="text-lg font-bold text-neutral-50">En Yüksek Puanlılar</h2>
            {topRated.error && <div className="mt-4"><ErrorState message={topRated.error} /></div>}
            {topRated.loading && (
              <div className="mt-4 space-y-3">
                {Array.from({ length: 5 }, (_, index) => (
                  <div key={index} className="h-14 animate-pulse rounded-xl bg-neutral-800/70" />
                ))}
              </div>
            )}
            {topRated.data && (
              <ol className="mt-4 space-y-4">
                {topRated.data.map((item, index) => (
                  <li key={`${item.mediaType}-${item.id}`}>
                    <Link to={mediaPath(item)} className="group flex items-center gap-3">
                      <span className="w-5 text-center text-sm font-bold text-neutral-500">{index + 1}</span>
                      <div className="h-14 w-10 shrink-0 overflow-hidden rounded-md bg-neutral-800">
                        {item.posterPath && (
                          <img
                            src={tmdbImage(item.posterPath, 'w185') ?? undefined}
                            alt=""
                            loading="lazy"
                            className="h-full w-full object-cover"
                          />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="line-clamp-1 text-sm font-semibold text-neutral-100 transition group-hover:text-amber-300">
                          {item.title}
                        </p>
                        <p className="text-xs text-neutral-400">
                          {item.year || 'Yıl belirsiz'} · <span className="text-amber-300">{item.rating.toFixed(1)}</span>
                        </p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
