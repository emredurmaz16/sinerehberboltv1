import type { MediaType } from '@/types/media';

export function formatRuntime(minutes: number | null): string | null {
  if (!minutes) return null;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return hours > 0 ? `${hours} sa ${rest} dk` : `${rest} dk`;
}

export function formatCount(value: number): string {
  return value.toLocaleString('tr-TR');
}

export function isMediaType(value: string): value is MediaType {
  return value === 'movie' || value === 'tv';
}

export function mediaTypeLabel(mediaType: MediaType): string {
  return mediaType === 'movie' ? 'Film' : 'Dizi';
}

export function mediaPath(item: { id: number; mediaType: MediaType }): string {
  return `/${item.mediaType === 'movie' ? 'film' : 'dizi'}/${item.id}`;
}
