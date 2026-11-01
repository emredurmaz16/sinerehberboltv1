import { useParams } from 'react-router-dom';
import PagedMediaGrid from '@/components/common/PagedMediaGrid';
import PageHeader from '@/components/common/PageHeader';
import { ErrorState } from '@/components/common/StateMessage';
import { useAsync } from '@/hooks/useAsync';
import NotFoundPage from '@/pages/NotFoundPage';
import { isMediaType, mediaTypeLabel } from '@/lib/format';
import { discoverMedia, getGenres } from '@/services/tmdb';
import type { MediaType } from '@/types/media';

export default function GenrePage() {
  const { mediaType = '', genreId = '' } = useParams();

  if (!isMediaType(mediaType) || !/^\d+$/.test(genreId)) return <NotFoundPage />;

  return <GenreContent key={`${mediaType}-${genreId}`} mediaType={mediaType} genreId={Number(genreId)} />;
}

interface GenreContentProps {
  mediaType: MediaType;
  genreId: number;
}

function GenreContent({ mediaType, genreId }: GenreContentProps) {
  const genres = useAsync(() => getGenres(mediaType), [mediaType]);
  const genreName = genres.data?.find((genre) => genre.id === genreId)?.name ?? 'Tür';

  return (
    <div className="mx-auto max-w-7xl space-y-10 px-4 pb-20 pt-12 sm:px-6 lg:px-8">
      <PageHeader
        eyebrow={`${mediaTypeLabel(mediaType)} Türleri`}
        title={genreName}
        description={`${genreName} türündeki en popüler ${mediaType === 'movie' ? 'filmler' : 'diziler'}.`}
      />
      {genres.error && <ErrorState message={genres.error} />}
      <PagedMediaGrid
        load={(page) => discoverMedia(mediaType, { page, genreId, sortBy: 'popularity.desc' })}
        emptyMessage="Bu türde gösterilecek içerik bulunamadı."
      />
    </div>
  );
}
