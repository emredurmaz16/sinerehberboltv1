import { ChevronRight, Star } from 'lucide-react';
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
  const count = items.length;

  useEffect(() => {
    if (count < 2) return;
    const timer = window.setInterval(() => setIndex((current) => (current + 1) % count), ROTATE_MS);
    return () => window.clearInterval(timer);
  }, [count, index]);

  if (count === 0) return null;

  const active = items[index] ?? items[0];
  const rating = active.voteCount > 0 ? active.rating.toFixed(1) : null;

  return (
    <section className="relative h-[80vh] min-h-[520px] max-h-[820px] w-full overflow-hidden bg-neutral-950">
      {items.map((item, itemIndex) => (
        <img
          key={`${item.mediaType}-${item.id}`}
          src={tmdbImage(item.backdropPath, 'w1280') ?? undefined}
          alt=""
          aria-hidden="true"
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
            itemIndex === index ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/75 to-neutral-950/20" />
      <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-neutral-950/40" />

      <div className="absolute inset-0 flex items-end">
        <div key={`${active.mediaType}-${active.id}`} className="mx-auto w-full max-w-7xl px-4 pb-24 sm:px-6 lg:px-8 animate-fade-up">
          <div className="max-w-2xl space-y-5">
            <div className="flex flex-wrap items-center gap-3 text-sm text-neutral-300">
              <span className="rounded-md bg-amber-400 px-2 py-0.5 text-xs font-bold uppercase tracking-wide text-neutral-950">
                {mediaTypeLabel(active.mediaType)}
              </span>
              {active.year && <span>{active.year}</span>}
              {rating && (
                <span className="flex items-center gap-1 font-semibold text-amber-300">
                  <Star className="h-4 w-4 fill-current" />
                  {rating}
                </span>
              )}
            </div>
            <h1 className="text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">{active.title}</h1>
            <p className="line-clamp-3 max-w-xl text-sm leading-relaxed text-neutral-200 sm:text-base">
              {active.overview || 'Bu içerik için özet bulunmuyor.'}
            </p>
            <div className="pt-2">
              <Link
                to={mediaPath(active)}
                className="inline-flex items-center gap-2 rounded-full bg-amber-400 px-6 py-3 text-sm font-semibold text-neutral-950 transition hover:bg-amber-300"
              >
                Detayları Gör
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {count > 1 && (
        <div className="absolute bottom-8 left-4 flex gap-2 sm:left-6 lg:left-8">
          {items.map((item, itemIndex) => (
            <button
              key={`${item.mediaType}-${item.id}`}
              type="button"
              onClick={() => setIndex(itemIndex)}
              aria-label={`${itemIndex + 1}. öne çıkan içerik`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                itemIndex === index ? 'w-8 bg-amber-400' : 'w-3 bg-white/40 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
