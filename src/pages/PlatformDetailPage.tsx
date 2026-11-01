import { useState } from 'react';
import { useParams } from 'react-router-dom';
import PagedMediaGrid from '@/components/common/PagedMediaGrid';
import PageHeader from '@/components/common/PageHeader';
import { findPlatformBySlug, type StreamingPlatform } from '@/lib/platforms';
import NotFoundPage from '@/pages/NotFoundPage';
import { discoverMedia } from '@/services/tmdb';
import type { MediaType } from '@/types/media';

const TABS: { value: MediaType; label: string }[] = [
  { value: 'movie', label: 'Filmler' },
  { value: 'tv', label: 'Diziler' },
];

export default function PlatformDetailPage() {
  const { slug = '' } = useParams();
  const platform = findPlatformBySlug(slug);

  if (!platform) return <NotFoundPage />;

  return <PlatformContent key={platform.slug} platform={platform} />;
}

interface PlatformContentProps {
  platform: StreamingPlatform;
}

function PlatformContent({ platform }: PlatformContentProps) {
  const [mediaType, setMediaType] = useState<MediaType>('movie');

  return (
    <div className="mx-auto max-w-7xl space-y-10 px-4 pb-20 pt-12 sm:px-6 lg:px-8">
      <section className={`animate-fade-up rounded-3xl bg-gradient-to-br ${platform.gradient} p-8 ring-1 ring-white/10 sm:p-12`}>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">Yayın Platformu</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-5xl">{platform.name}</h1>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/80 sm:text-base">
          {platform.name} üzerinde Türkiye'de izleyebileceğin film ve dizileri keşfet.
        </p>
      </section>

      <div role="tablist" aria-label="İçerik türü" className="flex gap-2">
        {TABS.map((tab) => (
          <button
            key={tab.value}
            type="button"
            role="tab"
            aria-selected={mediaType === tab.value}
            onClick={() => setMediaType(tab.value)}
            className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
              mediaType === tab.value
                ? 'bg-amber-400 text-neutral-950'
                : 'border border-white/10 bg-white/5 text-neutral-200 hover:border-amber-400/50 hover:text-amber-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <PagedMediaGrid
        key={mediaType}
        load={(page) => discoverMedia(mediaType, { page, providerId: platform.id, sortBy: 'popularity.desc' })}
        emptyMessage={`${platform.name} üzerinde bu kategoride içerik bulunamadı.`}
      />
    </div>
  );
}
