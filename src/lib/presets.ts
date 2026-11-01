import { discoverMedia, getCategory } from '@/services/tmdb';
import type { MediaType, PagedResult } from '@/types/media';

export interface ListPreset {
  title: string;
  description: string;
  mediaType: MediaType;
  load: (page: number) => Promise<PagedResult>;
}

export const LIST_PRESETS: Record<string, ListPreset> = {
  'filmler-yerli': {
    title: 'Yerli Filmler',
    description: 'Türk yapımı filmler, en popülerden başlayarak.',
    mediaType: 'movie',
    load: (page) => discoverMedia('movie', { page, originalLanguage: 'tr' }),
  },
  'filmler-yabanci': {
    title: 'Yabancı Filmler',
    description: 'İngilizce dilindeki en popüler yapımlar.',
    mediaType: 'movie',
    load: (page) => discoverMedia('movie', { page, originalLanguage: 'en' }),
  },
  'filmler-vizyonda': {
    title: 'Vizyondaki Filmler',
    description: 'Şu an sinemalarda gösterimde olan filmler.',
    mediaType: 'movie',
    load: (page) => getCategory('/movie/now_playing', 'movie', page),
  },
  'filmler-yakinda': {
    title: 'Yakında',
    description: 'Önümüzdeki dönemde vizyona girecek filmler.',
    mediaType: 'movie',
    load: (page) => getCategory('/movie/upcoming', 'movie', page),
  },
  'filmler-populer': {
    title: 'Popüler Filmler',
    description: 'Şu an en çok ilgi gören filmler.',
    mediaType: 'movie',
    load: (page) => getCategory('/movie/popular', 'movie', page),
  },
  'filmler-en-iyi': {
    title: 'En İyi Filmler',
    description: 'İzleyici puanlarına göre en yüksek puanlı filmler.',
    mediaType: 'movie',
    load: (page) => getCategory('/movie/top_rated', 'movie', page),
  },
  'diziler-yerli': {
    title: 'Yerli Diziler',
    description: 'Türk yapımı diziler, en popülerden başlayarak.',
    mediaType: 'tv',
    load: (page) => discoverMedia('tv', { page, originalLanguage: 'tr' }),
  },
  'diziler-yabanci': {
    title: 'Yabancı Diziler',
    description: 'İngilizce dilindeki en popüler diziler.',
    mediaType: 'tv',
    load: (page) => discoverMedia('tv', { page, originalLanguage: 'en' }),
  },
  'diziler-populer': {
    title: 'Popüler Diziler',
    description: 'Şu an en çok izlenen diziler.',
    mediaType: 'tv',
    load: (page) => getCategory('/tv/popular', 'tv', page),
  },
  'diziler-yeni': {
    title: 'Yeni Diziler',
    description: 'Yakın zamanda yayınlanan ve yeni bölüm alan diziler.',
    mediaType: 'tv',
    load: (page) => getCategory('/tv/on_the_air', 'tv', page),
  },
  'diziler-en-iyi': {
    title: 'En İyi Diziler',
    description: 'İzleyici puanlarına göre en yüksek puanlı diziler.',
    mediaType: 'tv',
    load: (page) => getCategory('/tv/top_rated', 'tv', page),
  },
};
