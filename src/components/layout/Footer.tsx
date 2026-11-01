import { Clapperboard } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-neutral-950">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
        <div className="space-y-2">
          <Link to="/" className="flex items-center gap-2 text-base font-bold text-white">
            <Clapperboard className="h-5 w-5 text-amber-400" />
            Sine<span className="text-amber-400">Rehber</span>
          </Link>
          <p className="max-w-md text-xs leading-relaxed text-neutral-500">
            Bu ürün TMDB API'sini kullanır ancak TMDB tarafından onaylanmamış veya sertifikalandırılmamıştır.
          </p>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-neutral-400">
          <Link to="/platformlar" className="transition hover:text-amber-300">Platformlar</Link>
          <Link to="/ne-izlesem" className="transition hover:text-amber-300">Ne İzlesem?</Link>
          <Link to="/liste/filmler-populer" className="transition hover:text-amber-300">Filmler</Link>
          <Link to="/liste/diziler-populer" className="transition hover:text-amber-300">Diziler</Link>
        </div>
      </div>
    </footer>
  );
}
