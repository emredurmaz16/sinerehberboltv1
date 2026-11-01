import { PLATFORMS } from '@/lib/platforms';

export interface NavLink {
  label: string;
  to: string;
}

export interface NavEntry {
  label: string;
  to?: string;
  children?: NavLink[];
  comingSoon?: boolean;
}

export const NAV_ENTRIES: NavEntry[] = [
  { label: 'Ana Sayfa', to: '/' },
  {
    label: 'Filmler',
    children: [
      { label: 'Yerli Filmler', to: '/liste/filmler-yerli' },
      { label: 'Yabancı Filmler', to: '/liste/filmler-yabanci' },
      { label: 'Vizyondaki Filmler', to: '/liste/filmler-vizyonda' },
      { label: 'Yakında', to: '/liste/filmler-yakinda' },
      { label: 'Popüler Filmler', to: '/liste/filmler-populer' },
      { label: 'En İyi Filmler', to: '/liste/filmler-en-iyi' },
    ],
  },
  {
    label: 'Diziler',
    children: [
      { label: 'Yerli Diziler', to: '/liste/diziler-yerli' },
      { label: 'Yabancı Diziler', to: '/liste/diziler-yabanci' },
      { label: 'Popüler Diziler', to: '/liste/diziler-populer' },
      { label: 'Yeni Diziler', to: '/liste/diziler-yeni' },
      { label: 'En İyi Diziler', to: '/liste/diziler-en-iyi' },
    ],
  },
  { label: 'Vizyondakiler', to: '/liste/filmler-vizyonda' },
  {
    label: 'Platformlar',
    children: [
      { label: 'Tüm Platformlar', to: '/platformlar' },
      ...PLATFORMS.map((platform) => ({ label: platform.name, to: `/platform/${platform.slug}` })),
    ],
  },
  { label: 'Haberler', comingSoon: true },
  { label: 'Ne İzlesem?', to: '/ne-izlesem' },
];
