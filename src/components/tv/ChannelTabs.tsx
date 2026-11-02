import LogoTabs from '@/components/common/LogoTabs';
import { useAsync } from '@/hooks/useAsync';
import { ALL_CHANNELS, TV_CHANNELS } from '@/lib/channels';
import { getNetworkLogos, tmdbImage } from '@/services/tmdb';

interface ChannelTabsProps {
  value: string;
  onChange: (slug: string) => void;
}

export default function ChannelTabs({ value, onChange }: ChannelTabsProps) {
  const logos = useAsync(() => getNetworkLogos(TV_CHANNELS.map((channel) => channel.id)), []);
  const logoFor = (networkId: number) => {
    const path = logos.data?.[networkId];
    return path ? tmdbImage(path, 'w92') : null;
  };

  return (
    <LogoTabs
      label="TV kanalı"
      value={value}
      onChange={onChange}
      options={[
        { value: ALL_CHANNELS, label: 'Tüm Kanallar', logo: null },
        ...TV_CHANNELS.map((channel) => ({ value: channel.slug, label: channel.name, logo: logoFor(channel.id) })),
      ]}
    />
  );
}
