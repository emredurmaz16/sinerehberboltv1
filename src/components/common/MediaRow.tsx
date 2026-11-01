import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import MediaCard from '@/components/common/MediaCard';
import { ErrorState, PosterSkeleton } from '@/components/common/StateMessage';
import type { MediaItem } from '@/types/media';

interface MediaRowProps {
  title: string;
  items: MediaItem[];
  isLoading: boolean;
  error: string | null;
  viewAllTo?: string;
  platformLogo?: string | null;
}

export default function MediaRow({ title, items, isLoading, error, viewAllTo, platformLogo }: MediaRowProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  const scrollTrack = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({ left: direction * track.clientWidth * 0.8, behavior: 'smooth' });
  };

  return (
    <section className="space-y-5">
      <div className="flex items-end justify-between gap-4">
        <h2 className="text-xl font-bold text-neutral-50 sm:text-2xl">{title}</h2>
        <div className="flex items-center gap-4">
          {viewAllTo && (
            <Link to={viewAllTo} className="text-sm font-semibold text-amber-400 transition hover:text-amber-300">
              Tümünü Gör
            </Link>
          )}
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
      </div>

      {error && <ErrorState message={error} />}

      {!error && (
        <div
          ref={trackRef}
          className="scrollbar-hide -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-4 pb-2 sm:-mx-0 sm:px-0"
        >
          {isLoading && items.length === 0 &&
            Array.from({ length: 6 }, (_, index) => (
              <div key={index} className="w-36 shrink-0 sm:w-44">
                <PosterSkeleton count={1} />
              </div>
            ))}
          {items.map((item) => (
            <div key={`${item.mediaType}-${item.id}`} className="w-36 shrink-0 snap-start sm:w-44">
              <MediaCard item={item} platformLogo={platformLogo} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
