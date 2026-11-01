import { Search } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';

interface SearchBoxProps {
  className?: string;
  onSubmit?: () => void;
}

export default function SearchBox({ className = '', onSubmit }: SearchBoxProps) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    navigate(`/ara?q=${encodeURIComponent(trimmed)}`);
    setQuery('');
    onSubmit?.();
  };

  return (
    <form role="search" onSubmit={handleSubmit} className={`relative ${className}`}>
      <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
      <input
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Film, dizi ara..."
        aria-label="Film veya dizi ara"
        className="h-10 w-full rounded-full border border-white/10 bg-white/5 pl-10 pr-4 text-sm text-neutral-100 placeholder:text-neutral-500 outline-none transition focus:border-amber-400/70 focus:bg-white/10 focus:ring-2 focus:ring-amber-400/20"
      />
    </form>
  );
}
