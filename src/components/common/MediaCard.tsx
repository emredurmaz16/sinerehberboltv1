import { Film, Star, Tv } from 'lucide-react';
import { Link } from 'react-router-dom';
import { mediaPath, mediaTypeLabel } from '@/lib/format';
import { tmdbImage } from '@/services/tmdb';
import type { MediaItem } from '@/types/media';

interface MediaCardProps {
  item: MediaItem;
  platformLogo?: string | null;
}

export default function MediaCard({ item, platformLogo = null }: MediaCardProps) {
  const poster = tmdbImage(item.posterPath, 'w500');
  const title = item.title || 'İsimsiz';
  const hasRating = item.voteCount > 0;

  return (
    <Link to={mediaPath(item)} className="group block w-full">
      <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-neutral-900 ring-1 ring-white/5 shadow-lg shadow-black/40 transition duration-300 group-hover:-translate-y-1 group-hover:ring-amber-400/60">
        {poster ? (
          <img
            src={poster}
            alt={title}
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-neutral-600">
            {item.mediaType === 'movie' ? <Film className="h-10 w-10" /> : <Tv className="h-10 w-10" />}
          </div>
        )}
        {platformLogo && (
          <span className="absolute bottom-2 left-2 flex h-7 w-7 items-center justify-center overflow-hidden rounded-md bg-white p-1 shadow-md">
            <img src={platformLogo} alt="" className="h-full w-full object-contain" />
          </span>
        )}
        {hasRating && (
          <span className="absolute left-2 top-2 flex items-center gap-1 rounded-md bg-black/70 px-1.5 py-0.5 text-xs font-semibold text-amber-300 backdrop-blur-sm">
            <Star className="h-3 w-3 fill-current" />
            {item.rating.toFixed(1)}
          </span>
        )}
      </div>
      <div className="mt-3 space-y-0.5">
        <h3 className="line-clamp-1 text-sm font-semibold text-neutral-100 transition group-hover:text-amber-300">
          {title}
        </h3>
        <p className="text-xs text-neutral-400">
          {item.year || 'Yıl belirsiz'} · {mediaTypeLabel(item.mediaType)}
        </p>
      </div>
    </Link>
  );
}
