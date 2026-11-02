export interface TvChannel {
  id: number;
  slug: string;
  name: string;
}

export const ALL_CHANNELS = 'tum-kanallar';

export const TV_CHANNELS: TvChannel[] = [
  { id: 439, slug: 'kanal-d', name: 'Kanal D' },
  { id: 36, slug: 'atv', name: 'ATV' },
  { id: 778, slug: 'star-tv', name: 'Star TV' },
  { id: 869, slug: 'trt-1', name: 'TRT 1' },
  { id: 7380, slug: 'now', name: 'NOW' },
  { id: 750, slug: 'show-tv', name: 'Show TV' },
];

export function networkIdsFor(slug: string): number[] {
  const channel = TV_CHANNELS.find((item) => item.slug === slug);
  return channel ? [channel.id] : TV_CHANNELS.map((item) => item.id);
}
