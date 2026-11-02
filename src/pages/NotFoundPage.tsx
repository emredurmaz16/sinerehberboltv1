import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 px-4 py-32 text-center animate-fade-up">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-400">Hata 404</p>
      <h1 className="text-3xl font-bold text-neutral-50 sm:text-4xl">Sayfa bulunamadı</h1>
      <p className="text-sm leading-relaxed text-neutral-400">
        Aradığın sayfa taşınmış ya da hiç var olmamış olabilir.
      </p>
      <Link
        to="/"
        className="rounded-full bg-amber-400 px-6 py-3 text-sm font-semibold text-black transition hover:bg-amber-300"
      >
        Ana sayfaya dön
      </Link>
    </div>
  );
}
