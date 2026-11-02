export interface StreamingPlatform {
  id: number;
  slug: string;
  name: string;
  gradient: string;
}

export const PLATFORMS: StreamingPlatform[] = [
  { id: 8, slug: 'netflix', name: 'Netflix', gradient: 'from-red-700 to-red-950' },
  { id: 337, slug: 'disney-plus', name: 'Disney+', gradient: 'from-blue-700 to-slate-950' },
  { id: 119, slug: 'prime-video', name: 'Amazon Prime Video', gradient: 'from-sky-600 to-slate-950' },
  { id: 1899, slug: 'max', name: 'Max', gradient: 'from-indigo-800 to-black' },
  { id: 11, slug: 'mubi', name: 'MUBI', gradient: 'from-neutral-600 to-black' },
  { id: 1904, slug: 'apple-tv-plus', name: 'Apple TV+', gradient: 'from-zinc-600 to-black' },
];

export function findPlatformBySlug(slug: string): StreamingPlatform | undefined {
  return PLATFORMS.find((platform) => platform.slug === slug);
}
