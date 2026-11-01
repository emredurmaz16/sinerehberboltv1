import { X } from 'lucide-react';
import { useEffect } from 'react';

interface TrailerModalProps {
  youtubeKey: string;
  title: string;
  onClose: () => void;
}

export default function TrailerModal({ youtubeKey, title, onClose }: TrailerModalProps) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${title} fragmanı`}
      onClick={onClose}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm animate-fade-up"
    >
      <div className="relative w-full max-w-4xl" onClick={(event) => event.stopPropagation()}>
        <button
          type="button"
          onClick={onClose}
          aria-label="Fragmanı kapat"
          className="absolute -top-12 right-0 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
        >
          <X className="h-5 w-5" />
        </button>
        <div className="aspect-video overflow-hidden rounded-2xl bg-black shadow-2xl ring-1 ring-white/10">
          <iframe
            src={`https://www.youtube.com/embed/${youtubeKey}?autoplay=1`}
            title={`${title} fragmanı`}
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
            className="h-full w-full"
          />
        </div>
      </div>
    </div>
  );
}
