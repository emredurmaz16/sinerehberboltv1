import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Genre, MediaType } from '@/types/media';

const TILE_TINTS = [
  'from-amber-500/40',
  'from-sky-500/40',
  'from-emerald-500/40',
  'from-rose-500/40',
  'from-teal-500/40',
  'from-orange-500/40',
  'from-cyan-500/40',
  'from-lime-500/40',
];

interface GenreTilesProps {
  genres: Genre[];
  mediaType: MediaType;
}

export default function GenreTiles({ genres, mediaType }: GenreTilesProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
      {genres.map((genre, index) => (
        <Link
          key={genre.id}
          to={`/tur/${mediaType}/${genre.id}`}
          className={`group relative overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br ${TILE_TINTS[index % TILE_TINTS.length]} to-[#171717] p-5 transition duration-300 hover:-translate-y-0.5 hover:border-amber-400/50`}
        >
          <span className="text-base font-semibold text-white">{genre.name}</span>
          <ArrowUpRight className="absolute right-4 top-4 h-4 w-4 text-neutral-200 opacity-0 transition group-hover:opacity-100" />
        </Link>
      ))}
    </div>
  );
}
