import { Moon, Sun } from 'lucide-react';
import { useState } from 'react';

type Theme = 'dark' | 'light';

const THEME_STORAGE_KEY = 'sinerehber-theme';

function readStoredTheme(): Theme {
  return localStorage.getItem(THEME_STORAGE_KEY) === 'light' ? 'light' : 'dark';
}

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle('light', theme === 'light');
  localStorage.setItem(THEME_STORAGE_KEY, theme);
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(readStoredTheme);
  const isLight = theme === 'light';

  const toggle = () => {
    const next: Theme = isLight ? 'dark' : 'light';
    applyTheme(next);
    setTheme(next);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isLight ? 'Koyu temaya geç' : 'Açık temaya geç'}
      title={isLight ? 'Koyu tema' : 'Açık tema'}
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/5 text-neutral-100 transition duration-300 hover:border-amber-400/60 hover:text-amber-300 active:scale-95"
    >
      {isLight ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
    </button>
  );
}
