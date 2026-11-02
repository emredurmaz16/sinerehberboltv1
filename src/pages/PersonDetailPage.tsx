import { ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { EmptyState, ErrorState } from '@/components/common/StateMessage';
import PersonOverview from '@/components/person/PersonOverview';
import PopularPeopleList from '@/components/person/PopularPeopleList';
import PersonSection from '@/components/person/PersonSection';
import { useAsync } from '@/hooks/useAsync';
import NotFoundPage from '@/pages/NotFoundPage';
import { getPersonDetail } from '@/services/people';
import type { PersonDetail } from '@/types/media';

type PersonTab = 'home' | 'biography' | 'news';

const TABS: { value: PersonTab; label: string }[] = [
  { value: 'home', label: 'Ana Sayfa' },
  { value: 'biography', label: 'Biyografi' },
  { value: 'news', label: 'Haberler' },
];

export default function PersonDetailPage() {
  const { id = '' } = useParams();

  if (!/^\d+$/.test(id)) return <NotFoundPage />;

  return <PersonContent key={id} id={Number(id)} />;
}

function PersonContent({ id }: { id: number }) {
  const person = useAsync(() => getPersonDetail(id), [id]);
  const [tab, setTab] = useState<PersonTab>('home');

  if (person.loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="h-[60vh] animate-pulse rounded-2xl bg-neutral-900/60" />
      </div>
    );
  }

  if (person.error || !person.data) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <ErrorState message={person.error ?? 'Sanatçı bulunamadı.'} />
      </div>
    );
  }

  const detail = person.data;

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 pb-20 pt-10 sm:px-6 lg:px-8">
      <nav aria-label="Konum" className="flex flex-wrap items-center gap-2 text-xs text-neutral-400">
        <Link to="/" className="transition hover:text-amber-300">
          Ana Sayfa
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span>Sanatçılar</span>
        <ChevronRight className="h-3 w-3" />
        <span className="text-neutral-200">{detail.name}</span>
      </nav>

      <header className="space-y-6 animate-fade-up">
        <h1 className="text-3xl font-bold tracking-tight text-neutral-50 sm:text-4xl">{detail.name}</h1>
        <div role="tablist" aria-label="Sanatçı sayfası sekmeleri" className="scrollbar-hide flex gap-2 overflow-x-auto">
          {TABS.map((item) => {
            const active = item.value === tab;
            return (
              <button
                key={item.value}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setTab(item.value)}
                className={`shrink-0 rounded-full px-5 py-2 text-sm font-semibold transition ${
                  active
                    ? 'bg-neutral-100 text-neutral-950'
                    : 'bg-white/5 text-neutral-300 hover:bg-white/10 hover:text-neutral-50'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </header>

      <div className="grid gap-12 lg:grid-cols-12">
        <div className="min-w-0 lg:col-span-8">
          {tab === 'home' && <PersonOverview person={detail} onOpenBiography={() => setTab('biography')} />}
          {tab === 'biography' && <PersonBiography person={detail} />}
          {tab === 'news' && <PersonNews />}
        </div>
        <aside className="lg:col-span-4 lg:sticky lg:top-24 lg:self-start">
          <PopularPeopleList />
        </aside>
      </div>
    </div>
  );
}

function PersonBiography({ person }: { person: PersonDetail }) {
  const paragraphs = person.biography.split(/\n+/).map((line) => line.trim()).filter(Boolean);
  return (
    <PersonSection title="Biyografi">
      {paragraphs.length === 0 ? (
        <EmptyState message="Bu sanatçı için Türkçe biyografi bulunmuyor." />
      ) : (
        <div className="space-y-4">
          {paragraphs.map((paragraph, index) => (
            <p key={index} className="text-sm leading-[1.5] text-neutral-200 sm:text-base">
              {paragraph}
            </p>
          ))}
        </div>
      )}
    </PersonSection>
  );
}

function PersonNews() {
  return (
    <PersonSection title="Haberler">
      <EmptyState message="Bu sanatçıyla ilgili haber bulunamadı." />
    </PersonSection>
  );
}
