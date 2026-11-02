import { tmdbImage } from '@/services/tmdb';

interface PersonAvatarProps {
  name: string;
  path: string | null;
  className?: string;
}

export default function PersonAvatar({ name, path, className = '' }: PersonAvatarProps) {
  const photo = tmdbImage(path, 'w185');
  return (
    <div className={`flex items-center justify-center overflow-hidden bg-neutral-800 ${className}`}>
      {photo ? (
        <img src={photo} alt={name} loading="lazy" className="h-full w-full object-cover" />
      ) : (
        <span className="text-2xl font-semibold text-neutral-400">{name.charAt(0)}</span>
      )}
    </div>
  );
}
