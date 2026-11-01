import { ChevronRight } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import SearchBox from '@/components/layout/SearchBox';
import { NAV_ENTRIES } from '@/lib/navigation';

interface MobileMenuProps {
  onNavigate: () => void;
}

export default function MobileMenu({ onNavigate }: MobileMenuProps) {
  return (
    <div className="space-y-6 px-4 pb-8 pt-4">
      <SearchBox onSubmit={onNavigate} />
      <nav className="divide-y divide-white/5 rounded-xl border border-white/10 bg-neutral-900/80">
        {NAV_ENTRIES.map((entry) => {
          if (entry.comingSoon) {
            return (
              <div key={entry.label} className="flex items-center justify-between px-4 py-3.5 text-sm font-semibold text-neutral-500">
                {entry.label}
                <span className="text-[10px] font-normal text-neutral-500">Yakında</span>
              </div>
            );
          }
          if (entry.to) {
            return (
              <NavLink
                key={entry.label}
                to={entry.to}
                end={entry.to === '/'}
                onClick={onNavigate}
                className="flex items-center justify-between px-4 py-3.5 text-sm font-semibold text-neutral-100 transition hover:text-amber-300"
              >
                {entry.label}
                <ChevronRight className="h-4 w-4 text-neutral-500" />
              </NavLink>
            );
          }
          return (
            <div key={entry.label} className="px-4 py-3">
              <p className="pb-2 text-xs font-semibold uppercase tracking-wider text-amber-400">{entry.label}</p>
              <div className="flex flex-col">
                {entry.children?.map((child) => (
                  <NavLink
                    key={child.to}
                    to={child.to}
                    onClick={onNavigate}
                    className="rounded-lg px-2 py-2 text-sm text-neutral-300 transition hover:bg-white/5 hover:text-white"
                  >
                    {child.label}
                  </NavLink>
                ))}
              </div>
            </div>
          );
        })}
      </nav>
    </div>
  );
}
