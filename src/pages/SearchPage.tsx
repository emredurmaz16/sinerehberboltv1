import { useSearchParams } from 'react-router-dom';
import PagedMediaGrid from '@/components/common/PagedMediaGrid';
import PageHeader from '@/components/common/PageHeader';
import { EmptyState } from '@/components/common/StateMessage';
import { searchMedia } from '@/services/tmdb';

export default function SearchPage() {
  const [params] = useSearchParams();
  const query = (params.get('q') ?? '').trim();

  return (
    <div className="mx-auto max-w-7xl space-y-10 px-4 pb-20 pt-12 sm:px-6 lg:px-8">
      <PageHeader
        eyebrow="Arama"
        title={query ? `"${query}" için sonuçlar` : 'Film veya dizi ara'}
        description={query ? undefined : 'Aramak istediğin filmin ya da dizinin adını üst menüdeki arama kutusuna yaz.'}
      />
      {query ? (
        <PagedMediaGrid
          key={query}
          load={(page) => searchMedia(query, page)}
          emptyMessage={`"${query}" ile eşleşen bir sonuç bulunamadı.`}
        />
      ) : (
        <EmptyState message="Henüz bir arama yapılmadı." />
      )}
    </div>
  );
}
