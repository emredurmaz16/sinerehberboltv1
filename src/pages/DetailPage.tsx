import { useParams } from 'react-router-dom';
import CastRow from '@/components/detail/CastRow';
import DetailHero from '@/components/detail/DetailHero';
import MediaRow from '@/components/common/MediaRow';
import { ErrorState } from '@/components/common/StateMessage';
import { useAsync } from '@/hooks/useAsync';
import NotFoundPage from '@/pages/NotFoundPage';
import { getMediaDetail } from '@/services/tmdb';
import type { MediaType } from '@/types/media';

interface DetailPageProps {
  mediaType: MediaType;
}

export default function DetailPage({ mediaType }: DetailPageProps) {
  const { id = '' } = useParams();

  if (!/^\d+$/.test(id)) return <NotFoundPage />;

  return <DetailContent key={`${mediaType}-${id}`} mediaType={mediaType} id={Number(id)} />;
}

interface DetailContentProps {
  mediaType: MediaType;
  id: number;
}

function DetailContent({ mediaType, id }: DetailContentProps) {
  const detail = useAsync(() => getMediaDetail(mediaType, id), [mediaType, id]);

  if (detail.loading) {
    return <div className="h-[70vh] animate-pulse bg-neutral-900/60" />;
  }

  if (detail.error || !detail.data) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <ErrorState message={detail.error ?? 'İçerik bulunamadı.'} />
      </div>
    );
  }

  const item = detail.data;

  return (
    <div className="pb-20">
      <DetailHero detail={item} />
      <div className="mx-auto flex max-w-7xl flex-col gap-16 px-4 pt-14 sm:px-6 lg:px-8">
        <CastRow cast={item.cast} />
        {item.similar.length > 0 && (
          <MediaRow title="Benzer İçerikler" items={item.similar} isLoading={false} error={null} />
        )}
      </div>
    </div>
  );
}
