import { ChevronLeft, ChevronRight, Info, Star } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { mediaPath, mediaTypeLabel } from '@/lib/format';
import { tmdbImage } from '@/services/tmdb';
import type { MediaItem } from '@/types/media';

const ROTATE_MS = 7000;

interface HeroBannerProps {
  items: MediaItem[];
}

export default function HeroBanner({ items }: HeroBannerProps) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = items.length;

  useEffect(() => {
    if (count < 2 || paused) return;
    const timer = window.setInterval(() => setIndex((current) => (current + 1) % count), ROTATE_MS);
    return () => window.clearInterval(timer);
  }, [count, index, paused]);

  if (count === 0) return null;

  const active = items[index] ?? items[0];
  const rating = active.voteCount > 0 ? active.rating.toFixed(1) : null;
  const step = (direction: 1 | -1) => setIndex((current) => (current + direction + count) % count);

  return (
    <section
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className="group relative h-[80vh] min-h-[560px] max-h-[820px] w-full overflow-hidden bg-neutral-950"
    >
      {items.map((item, itemIndex) => (
        <img
          key={`${item.mediaType}-${item.id}`}
          src={tmdbImage(item.backdropPath, 'w1280') ?? undefined}
          alt=""
          aria-hidden="true"
          className={`absolute inset-0 h-full w-full object-cover object-[60%_center] transition-all duration-[1200ms] ease-out ${
            itemIndex === index ? 'scale-100 opacity-100' : 'scale-105 opacity-0'
          }`}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/75 to-neutral-950/10" />
      <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-neutral-950/30" />

      <div className="absolute inset-0 flex items-end md:items-center">
        <div className="mx-auto w-full max-w-7xl px-4 pb-24 sm:px-6 md:pb-0 lg:px-8">
          <div key={`${active.mediaType}-${active.id}`} className="max-w-xl animate-fade-up space-y-5">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm font-medium text-neutral-300">
              <span className="uppercase tracking-[0.15em] text-neutral-100">{mediaTypeLabel(active.mediaType)}</span>
              {active.year && <span className="text-neutral-500">·</span>}
              {active.year && <span>{active.year}</span>}
              {rating && (
                <>
                  <span className="text-neutral-500">·</span>
                  <span className="flex items-center gap-1 font-semibold text-amber-300">
                    <Star className="h-4 w-4 fill-current" />
                    {rating}
                  </span>
                </>
              )}
            </div>
            <h1 className="text-4xl font-bold leading-[1.2] tracking-tight text-white sm:text-5xl lg:text-6xl">
              {active.title}
            </h1>
            <p className="line-clamp-3 text-sm leading-[1.5] text-neutral-200 sm:text-base">
              {active.overview || 'Bu içerik için özet bulunmuyor.'}
            </p>
            <div className="pt-2">
              <Link
                to={mediaPath(active)}
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-neutral-950 transition duration-300 hover:-translate-y-0.5 hover:bg-neutral-200"
              >
                <Info className="h-4 w-4" />
                Detayları Gör
              </Link>
            </div>
          </div>
        </div>
      </div>

      {count > 1 && (
        <>
          <button
            type="button"
            onClick={() => step(-1)}
            aria-label="Önceki içerik"
            className="absolute left-4 top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/40 text-white opacity-0 backdrop-blur-sm transition duration-300 hover:bg-white/20 group-hover:opacity-100 md:flex lg:left-8"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            type="button"
            onClick={() => step(1)}
            aria-label="Sonraki içerik"
            className="absolute right-4 top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/40 text-white opacity-0 backdrop-blur-sm transition duration-300 hover:bg-white/20 group-hover:opacity-100 md:flex lg:right-8"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-2">
            {items.map((item, itemIndex) => (
              <button
                key={`${item.mediaType}-${item.id}`}
                type="button"
                onClick={() => setIndex(itemIndex)}
                aria-label={`${itemIndex + 1}. öne çıkan içerik`}
                className={`h-2 rounded-full transition-all duration-300 ${
                  itemIndex === index ? 'w-6 bg-white' : 'w-2 bg-white/40 hover:bg-white/70'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
