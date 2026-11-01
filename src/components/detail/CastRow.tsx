import { tmdbImage } from '@/services/tmdb';
import type { CastMember } from '@/types/media';

interface CastRowProps {
  cast: CastMember[];
}

export default function CastRow({ cast }: CastRowProps) {
  if (cast.length === 0) return null;

  return (
    <section className="space-y-5">
      <h2 className="text-xl font-bold text-neutral-50 sm:text-2xl">Oyuncular</h2>
      <div className="scrollbar-hide -mx-4 flex gap-6 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
        {cast.map((member) => {
          const photo = tmdbImage(member.profilePath, 'w185');
          return (
            <div key={member.id} className="w-28 shrink-0 space-y-3 text-center sm:w-32">
              <div className="mx-auto flex h-28 w-28 items-center justify-center overflow-hidden rounded-full bg-neutral-800 ring-1 ring-white/10 sm:h-32 sm:w-32">
                {photo ? (
                  <img src={photo} alt={member.name} loading="lazy" className="h-full w-full object-cover" />
                ) : (
                  <span className="text-2xl font-semibold text-neutral-400">{member.name.charAt(0)}</span>
                )}
              </div>
              <div className="space-y-0.5">
                <p className="line-clamp-1 text-sm font-semibold text-neutral-100">{member.name}</p>
                <p className="line-clamp-1 text-xs text-neutral-400">{member.character}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
