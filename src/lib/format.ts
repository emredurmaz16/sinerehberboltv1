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

export function personPath(id: number): string {
  return `/sanatcilar/${id}`;
}

const DEPARTMENT_LABELS: Record<string, string> = {
  Acting: 'Oyuncu',
  Directing: 'Yönetmen',
  Writing: 'Senarist',
  Production: 'Yapımcı',
};

export function departmentLabel(department: string | null): string {
  if (!department) return 'Belirtilmemiş';
  return DEPARTMENT_LABELS[department] ?? department;
}

export function formatLongDate(isoDate: string): string {
  return new Date(`${isoDate}T00:00:00`).toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function ageFrom(birthday: string, deathday: string | null): number {
  const end = deathday ? new Date(`${deathday}T00:00:00`) : new Date();
  const start = new Date(`${birthday}T00:00:00`);
  let age = end.getFullYear() - start.getFullYear();
  const monthDiff = end.getMonth() - start.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && end.getDate() < start.getDate())) age -= 1;
  return age;
}

export function countryFromPlace(placeOfBirth: string | null): string | null {
  if (!placeOfBirth) return null;
  const parts = placeOfBirth.split(',').map((part) => part.trim()).filter(Boolean);
  return parts.length > 0 ? parts[parts.length - 1] : null;
}

