import { useSearchParams } from 'react-router-dom';
import PageHeader from '@/components/common/PageHeader';
import PagedMediaGrid from '@/components/common/PagedMediaGrid';
import ChannelTabs from '@/components/tv/ChannelTabs';
import { ALL_CHANNELS, networkIdsFor, TV_CHANNELS } from '@/lib/channels';
import { discoverMedia } from '@/services/tmdb';

export default function TvShowsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const requested = searchParams.get('kanal') ?? ALL_CHANNELS;
  const slug = TV_CHANNELS.some((channel) => channel.slug === requested) ? requested : ALL_CHANNELS;

  const selectChannel = (next: string) => {
    setSearchParams(next === ALL_CHANNELS ? {} : { kanal: next });
  };

  return (
    <div className="mx-auto max-w-7xl space-y-10 px-4 pb-20 pt-12 sm:px-6 lg:px-8">
      <PageHeader
        eyebrow="Diziler"
        title="TV Dizileri"
        description="Türk kanallarında yayınlanan dizileri kanala göre keşfet."
      />
      <ChannelTabs value={slug} onChange={selectChannel} />
      <PagedMediaGrid
        key={slug}
        load={(page) => discoverMedia('tv', { page, networkIds: networkIdsFor(slug) })}
        emptyMessage="Bu kanalda gösterilecek dizi bulunamadı."
      />
    </div>
  );
}
