import PageHeader from '@/components/common/PageHeader';
import PlatformGrid from '@/components/platforms/PlatformGrid';

export default function PlatformsPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-10 px-4 pb-20 pt-12 sm:px-6 lg:px-8">
      <PageHeader
        eyebrow="Platformlar"
        title="Hangi platformda izlemek istersin?"
        description="Abone olduğun yayın platformunu seç, Türkiye'de izleyebileceğin film ve dizileri listele."
      />
      <PlatformGrid />
    </div>
  );
}
