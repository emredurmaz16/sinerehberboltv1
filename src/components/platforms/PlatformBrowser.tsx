import { useState } from 'react';
import LogoTabs from '@/components/common/LogoTabs';
import MediaRow from '@/components/common/MediaRow';
import { useAsync } from '@/hooks/useAsync';
import { PLATFORMS, type StreamingPlatform } from '@/lib/platforms';
import { discoverMedia, getPlatformLogos, tmdbImage } from '@/services/tmdb';
import type { MediaItem, PagedResult } from '@/types/media';

type Ordering = 'popular' | 'latest';

const SORT_BY: Record<Ordering, { movie: string; tv: string }> = {
  popular: { movie: 'popularity.desc', tv: 'popularity.desc' },
  latest: { movie: 'primary_release_date.desc', tv: 'first_air_date.desc' },
};

function interleave(movies: MediaItem[], shows: MediaItem[]): MediaItem[] {
  const merged: MediaItem[] = [];
  const longest = Math.max(movies.length, shows.length);
  for (let index = 0; index < longest; index += 1) {
    if (movies[index]) merged.push(movies[index]);
    if (shows[index]) merged.push(shows[index]);
  }
  return merged.slice(0, 14);
}

async function loadPlatformTitles(providerId: number, ordering: Ordering): Promise<PagedResult> {
  const [movies, shows] = await Promise.all([
    discoverMedia('movie', { providerId, sortBy: SORT_BY[ordering].movie }),
    discoverMedia('tv', { providerId, sortBy: SORT_BY[ordering].tv }),
  ]);
  return { items: interleave(movies.items, shows.items), page: 1, totalPages: 1 };
}

export default function PlatformBrowser() {
  const [platform, setPlatform] = useState<StreamingPlatform>(PLATFORMS[0]);
  const logos = useAsync(getPlatformLogos, []);
  const logoFor = (providerId: number) => {
    const path = logos.data?.[providerId];
    return path ? tmdbImage(path, 'w92') : null;
  };

  return (
    <div className="space-y-12">
      <LogoTabs
        label="Platform seçimi"
        value={platform.id}
        onChange={(id) => setPlatform(PLATFORMS.find((option) => option.id === id) ?? PLATFORMS[0])}
        options={PLATFORMS.map((option) => ({
          value: option.id,
          label: option.name,
          logo: logoFor(option.id),
          fallbackDotClassName: `bg-gradient-to-br ${option.gradient}`,
        }))}
      />

      <PlatformRows key={platform.id} platform={platform} platformLogo={logoFor(platform.id)} />

      <p className="text-xs text-neutral-500">
        Platform verileri TMDB aracılığıyla JustWatch üzerinden alınır. Uygunluk zamanla değişebilir.
      </p>
    </div>
  );
}

function PlatformRows({ platform, platformLogo }: { platform: StreamingPlatform; platformLogo: string | null }) {
  const popular = useAsync(() => loadPlatformTitles(platform.id, 'popular'), [platform.id]);
  const latest = useAsync(() => loadPlatformTitles(platform.id, 'latest'), [platform.id]);
  const viewAllTo = `/platform/${platform.slug}`;

  return (
    <div className="space-y-12">
      <MediaRow
        title={`${platform.name}'da Popüler`}
        items={popular.data?.items ?? []}
        isLoading={popular.loading}
        error={popular.error}
        viewAllTo={viewAllTo}
        platformLogo={platformLogo}
      />
      <MediaRow
        title={`${platform.name}'daki Yeni Yapımlar`}
        items={latest.data?.items ?? []}
        isLoading={latest.loading}
        error={latest.error}
        viewAllTo={viewAllTo}
        platformLogo={platformLogo}
      />
    </div>
  );
}
