import { useState } from 'react';
import MediaRow from '@/components/common/MediaRow';
import ChannelTabs from '@/components/tv/ChannelTabs';
import { useAsync } from '@/hooks/useAsync';
import { ALL_CHANNELS, networkIdsFor } from '@/lib/channels';
import { discoverMedia } from '@/services/tmdb';

export default function TvShowsByChannel() {
  const [slug, setSlug] = useState(ALL_CHANNELS);
  const shows = useAsync(() => discoverMedia('tv', { networkIds: networkIdsFor(slug) }), [slug]);
  const viewAllTo = slug === ALL_CHANNELS ? '/tv-dizileri' : `/tv-dizileri?kanal=${slug}`;

  return (
    <MediaRow
      title="TV Dizileri"
      items={shows.data?.items ?? []}
      isLoading={shows.loading}
      error={shows.error}
      viewAllTo={viewAllTo}
      toolbar={<ChannelTabs value={slug} onChange={setSlug} />}
    />
  );
}
