import { ChevronDown } from 'lucide-react';
import { NavLink as RouterNavLink } from 'react-router-dom';
import type { NavEntry } from '@/lib/navigation';

interface NavDropdownProps {
  entry: NavEntry;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  onToggle: () => void;
}

const linkBase =
  'relative flex items-center gap-1.5 px-3 py-2 text-sm font-semibold uppercase tracking-wide transition-colors duration-200';

export function NavEntryItem({ entry, isOpen, onOpen, onClose, onToggle }: NavDropdownProps) {
  if (entry.comingSoon) {
    return (
      <span className={`${linkBase} cursor-not-allowed text-neutral-500`}>
        {entry.label}
        <span className="rounded-full border border-neutral-700 px-1.5 py-px text-[10px] normal-case tracking-normal text-neutral-400">
          Yakında
        </span>
      </span>
    );
  }

  if (entry.to) {
    return (
      <RouterNavLink
        to={entry.to}
        end={entry.to === '/'}
        className={({ isActive }) =>
          `${linkBase} ${isActive ? 'text-amber-400 after:absolute after:inset-x-3 after:-bottom-[18px] after:h-0.5 after:rounded-full after:bg-amber-400' : 'text-neutral-200 hover:text-neutral-50'}`
        }
      >
        {entry.label}
      </RouterNavLink>
    );
  }

  return (
    <div className="relative" onMouseEnter={onOpen} onMouseLeave={onClose}>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className={`${linkBase} ${isOpen ? 'text-amber-400' : 'text-neutral-200 hover:text-neutral-50'}`}
      >
        {entry.label}
        <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <div
        className={`absolute left-0 top-full z-50 pt-3 transition duration-200 ${
          isOpen ? 'visible translate-y-0 opacity-100' : 'invisible -translate-y-1 opacity-0'
        }`}
      >
        <div className="min-w-[220px] overflow-hidden rounded-xl border border-white/10 bg-neutral-900/95 p-2 shadow-2xl shadow-black/60 backdrop-blur-md">
          {entry.children?.map((child) => (
            <RouterNavLink
              key={child.to}
              to={child.to}
              onClick={onClose}
              className="block rounded-lg px-3 py-2.5 text-sm text-neutral-200 transition hover:bg-white/5 hover:text-amber-300"
            >
              {child.label}
            </RouterNavLink>
          ))}
        </div>
      </div>
    </div>
  );
}
