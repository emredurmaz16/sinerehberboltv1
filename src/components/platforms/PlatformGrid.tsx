import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PLATFORMS } from '@/lib/platforms';

export default function PlatformGrid() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
      {PLATFORMS.map((platform) => (
        <Link
          key={platform.slug}
          to={`/platform/${platform.slug}`}
          className={`group relative flex aspect-[16/10] items-end overflow-hidden rounded-xl bg-gradient-to-br ${platform.gradient} p-4 ring-1 ring-white/10 transition duration-300 hover:-translate-y-1 hover:ring-amber-400/50`}
        >
          <span className="text-sm font-bold text-white sm:text-base">{platform.name}</span>
          <ArrowUpRight className="absolute right-4 top-4 h-4 w-4 text-white/70 transition group-hover:text-amber-300" />
        </Link>
      ))}
    </div>
  );
}
