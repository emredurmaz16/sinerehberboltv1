import { Clapperboard, Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import MobileMenu from '@/components/layout/MobileMenu';
import { NavEntryItem } from '@/components/layout/NavEntryItem';
import SearchBox from '@/components/layout/SearchBox';
import { NAV_ENTRIES } from '@/lib/navigation';

export default function Navbar() {
  const { pathname } = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 12);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setOpenMenu(null);
    setMobileOpen(false);
  }, [pathname]);

  const closeMobile = () => setMobileOpen(false);

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-300 ${
        scrolled || mobileOpen
          ? 'border-b border-white/5 bg-neutral-950/95 shadow-lg shadow-black/30 backdrop-blur-md'
          : 'bg-gradient-to-b from-neutral-950/90 to-transparent'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:gap-6 lg:px-8">
        <Link to="/" className="group flex shrink-0 items-center gap-2" aria-label="SineRehber ana sayfa">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-400 text-neutral-950 transition group-hover:scale-105">
            <Clapperboard className="h-5 w-5" />
          </span>
          <span className="text-lg font-bold tracking-tight text-white">
            Sine<span className="text-amber-400">Rehber</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {NAV_ENTRIES.map((entry) => (
            <NavEntryItem
              key={entry.label}
              entry={entry}
              isOpen={openMenu === entry.label}
              onOpen={() => setOpenMenu(entry.label)}
              onClose={() => setOpenMenu(null)}
              onToggle={() => setOpenMenu((current) => (current === entry.label ? null : entry.label))}
            />
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <SearchBox className="hidden w-56 md:block xl:w-72" />
          <button
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            aria-label={mobileOpen ? 'Menüyü kapat' : 'Menüyü aç'}
            aria-expanded={mobileOpen}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-neutral-100 transition hover:bg-white/10 lg:hidden"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="max-h-[calc(100vh-4rem)] overflow-y-auto border-t border-white/5 bg-neutral-950 lg:hidden">
          <MobileMenu onNavigate={closeMobile} />
        </div>
      )}
    </header>
  );
}
