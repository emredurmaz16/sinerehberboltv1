import { useParams } from 'react-router-dom';
import PagedMediaGrid from '@/components/common/PagedMediaGrid';
import PageHeader from '@/components/common/PageHeader';
import NotFoundPage from '@/pages/NotFoundPage';
import { LIST_PRESETS, type ListPreset } from '@/lib/presets';
import { mediaTypeLabel } from '@/lib/format';

export default function PresetListPage() {
  const { presetId = '' } = useParams();
  const preset: ListPreset | undefined = LIST_PRESETS[presetId];

  if (!preset) return <NotFoundPage />;

  return (
    <div className="mx-auto max-w-7xl space-y-10 px-4 pb-20 pt-12 sm:px-6 lg:px-8">
      <PageHeader eyebrow={mediaTypeLabel(preset.mediaType)} title={preset.title} description={preset.description} />
      <PagedMediaGrid key={presetId} load={preset.load} />
    </div>
  );
}
