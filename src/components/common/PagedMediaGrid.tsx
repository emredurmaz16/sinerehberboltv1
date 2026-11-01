import MediaCard from '@/components/common/MediaCard';
import { EmptyState, ErrorState, PosterSkeleton } from '@/components/common/StateMessage';
import { usePagedMedia } from '@/hooks/usePagedMedia';
import type { MediaItem, PagedResult } from '@/types/media';

interface PagedMediaGridProps {
  load: (page: number) => Promise<PagedResult>;
  emptyMessage?: string;
}

export default function PagedMediaGrid({ load, emptyMessage = 'Gösterilecek içerik bulunamadı.' }: PagedMediaGridProps) {
  const { items, loading, error, hasMore, loadMore } = usePagedMedia(load);

  if (error && items.length === 0) return <ErrorState message={error} />;
  if (!loading && !error && items.length === 0) return <EmptyState message={emptyMessage} />;

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
        {items.map((item: MediaItem) => (
          <MediaCard key={`${item.mediaType}-${item.id}`} item={item} />
        ))}
        {loading && <PosterSkeleton count={items.length === 0 ? 12 : 6} />}
      </div>

      {error && <ErrorState message={error} />}

      {hasMore && !loading && (
        <div className="flex justify-center">
          <button
            type="button"
            onClick={loadMore}
            className="rounded-full border border-white/15 bg-white/5 px-7 py-3 text-sm font-semibold text-neutral-100 transition hover:border-amber-400/60 hover:text-amber-300"
          >
            Daha Fazla Yükle
          </button>
        </div>
      )}
    </div>
  );
}
