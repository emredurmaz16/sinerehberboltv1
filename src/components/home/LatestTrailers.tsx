import { ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { useRef, useState } from 'react';
import TrailerModal from '@/components/detail/TrailerModal';
import { ErrorState, PosterSkeleton } from '@/components/common/StateMessage';
import { useAsync } from '@/hooks/useAsync';
import { getLatestTrailers, tmdbImage } from '@/services/tmdb';
import type { TrailerItem } from '@/types/media';

export default function LatestTrailers() {
  const trailers = useAsync(getLatestTrailers, []);
  const [active, setActive] = useState<TrailerItem | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const scrollTrack = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({ left: direction * track.clientWidth * 0.8, behavior: 'smooth' });
  };

  return (
    <section className="space-y-5">
      <div className="flex items-end justify-between gap-4">
        <h2 className="text-xl font-bold text-neutral-50 sm:text-2xl">En Yeni Fragmanlar</h2>
        <div className="hidden gap-2 sm:flex">
          <button
            type="button"
            onClick={() => scrollTrack(-1)}
            aria-label="Sola kaydır"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-neutral-200 transition hover:border-amber-400/50 hover:text-amber-300"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => scrollTrack(1)}
            aria-label="Sağa kaydır"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-neutral-200 transition hover:border-amber-400/50 hover:text-amber-300"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {trailers.error && <ErrorState message={trailers.error} />}

      {!trailers.error && (
        <div
          ref={trackRef}
          className="scrollbar-hide -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-4 pb-2 sm:-mx-0 sm:px-0"
        >
          {trailers.loading &&
            Array.from({ length: 6 }, (_, index) => (
              <div key={index} className="w-40 shrink-0 sm:w-52">
                <PosterSkeleton count={1} />
              </div>
            ))}
          {trailers.data?.map((item) => (
            <div key={`${item.mediaType}-${item.id}`} className="w-40 shrink-0 snap-start sm:w-52">
              <TrailerCard item={item} onPlay={() => setActive(item)} />
            </div>
          ))}
        </div>
      )}

      {active && (
        <TrailerModal youtubeKey={active.trailerKey} title={active.title} onClose={() => setActive(null)} />
      )}
    </section>
  );
}

interface TrailerCardProps {
  item: TrailerItem;
  onPlay: () => void;
}

function TrailerCard({ item, onPlay }: TrailerCardProps) {
  const poster = tmdbImage(item.posterPath, 'w500');
  const title = item.title || 'İsimsiz';

  return (
    <button type="button" onClick={onPlay} aria-label={`${title} fragmanını izle`} className="group block w-full text-left">
      <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-neutral-900 ring-1 ring-white/5 shadow-lg shadow-black/40 transition duration-300 group-hover:-translate-y-1 group-hover:ring-amber-400/60">
        {poster && (
          <img
            src={poster}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        )}
        <div className="absolute inset-0 flex items-center justify-center bg-black/25 transition duration-300 group-hover:bg-black/45">
          <span className="flex h-12 w-12 items-center justify-center rounded-full border border-white/70 bg-black/40 text-white backdrop-blur-sm transition duration-300 group-hover:scale-110 group-hover:border-amber-400 group-hover:bg-amber-400 group-hover:text-neutral-950">
            <Play className="h-5 w-5 fill-current" />
          </span>
        </div>
      </div>
      <div className="mt-3 space-y-1">
        <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-neutral-100 transition group-hover:text-amber-300">
          {title}
          {item.year && <span className="text-neutral-400"> ({item.year}) Fragman</span>}
        </h3>
        {item.genreNames.length > 0 && (
          <p className="line-clamp-1 text-xs text-neutral-400">{item.genreNames.join(', ')}</p>
        )}
      </div>
    </button>
  );
}
