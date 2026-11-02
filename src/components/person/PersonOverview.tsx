import { useState } from 'react';
import { Link } from 'react-router-dom';
import MediaCard from '@/components/common/MediaCard';
import { EmptyState } from '@/components/common/StateMessage';
import PersonAvatar from '@/components/person/PersonAvatar';
import PersonSection from '@/components/person/PersonSection';
import { countryFromPlace, departmentLabel, formatLongDate, ageFrom, personPath } from '@/lib/format';
import { tmdbImage } from '@/services/tmdb';
import type { CoStar, PersonCredit, PersonDetail } from '@/types/media';

const FILMOGRAPHY_PREVIEW = 12;

interface PersonOverviewProps {
  person: PersonDetail;
  onOpenBiography: () => void;
}

export default function PersonOverview({ person, onOpenBiography }: PersonOverviewProps) {
  return (
    <div className="space-y-14">
      <PersonProfile person={person} />
      <PersonSection title="Biyografi">
        <PersonBioExcerpt biography={person.biography} onOpenBiography={onOpenBiography} />
      </PersonSection>
      <PersonSection title="Filmografi">
        <PersonFilmography items={person.filmography} />
      </PersonSection>
      <PersonSection title="Fotoğraflar">
        <PersonPhotos paths={person.photos} name={person.name} />
      </PersonSection>
      <PersonSection title="Beraber Çalıştığı Sanatçılar">
        <PersonCoStars coStars={person.coStars} />
      </PersonSection>
    </div>
  );
}

function PersonProfile({ person }: { person: PersonDetail }) {
  const careerStart = person.filmography
    .map((item) => Number(item.year))
    .filter((year) => Number.isFinite(year) && year > 0)
    .reduce<number | null>((earliest, year) => (earliest === null || year < earliest ? year : earliest), null);
  const careerYears = careerStart === null ? null : new Date().getFullYear() - careerStart;
  const country = countryFromPlace(person.placeOfBirth);
  const photo = tmdbImage(person.profilePath, 'w500');

  const facts: { label: string; value: string }[] = [
    { label: 'Görev', value: departmentLabel(person.department) },
    { label: 'Ülke', value: country ?? 'Belirtilmemiş' },
    { label: 'Doğum tarihi', value: person.birthday ? formatLongDate(person.birthday) : 'Belirtilmemiş' },
    {
      label: 'Yaş',
      value: person.birthday
        ? `${ageFrom(person.birthday, person.deathday)}${person.deathday ? ' (vefat etti)' : ''}`
        : 'Belirtilmemiş',
    },
    { label: 'Doğum yeri', value: person.placeOfBirth ?? 'Belirtilmemiş' },
  ];

  return (
    <div className="grid gap-8 md:grid-cols-[minmax(0,240px)_1fr] lg:gap-12">
      <div className="mx-auto w-full max-w-[240px] overflow-hidden rounded-2xl bg-neutral-900 ring-1 ring-white/10 shadow-xl shadow-black/40">
        {photo ? (
          <img src={photo} alt={person.name} className="aspect-[2/3] w-full object-cover" />
        ) : (
          <PersonAvatar name={person.name} path={null} className="aspect-[2/3] w-full" />
        )}
      </div>

      <div className="flex flex-col gap-8">
        <dl className="grid gap-4 sm:grid-cols-2">
          {facts.map((fact) => (
            <div key={fact.label} className="space-y-1 border-b border-white/5 pb-4">
              <dt className="text-xs font-semibold uppercase tracking-[0.15em] text-neutral-500">{fact.label}</dt>
              <dd className="text-sm font-medium text-neutral-100">{fact.value}</dd>
            </div>
          ))}
        </dl>

        <div className="grid grid-cols-2 divide-x divide-white/10 overflow-hidden rounded-2xl border border-white/10 bg-neutral-900/60">
          <div className="space-y-1 px-6 py-5 text-center">
            <p className="text-3xl font-bold text-neutral-50">{careerYears ?? '—'}</p>
            <p className="text-xs text-neutral-400">yıllık kariyer</p>
          </div>
          <div className="space-y-1 px-6 py-5 text-center">
            <p className="text-3xl font-bold text-neutral-50">{person.filmography.length}</p>
            <p className="text-xs text-neutral-400">film ve dizi</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function PersonBioExcerpt({ biography, onOpenBiography }: { biography: string; onOpenBiography: () => void }) {
  if (!biography) {
    return <EmptyState message="Bu sanatçı için Türkçe biyografi bulunmuyor." />;
  }
  const excerpt = biography.length > 420 ? `${biography.slice(0, 420).trimEnd()}…` : biography;
  return (
    <div className="space-y-4">
      <p className="text-sm leading-[1.5] text-neutral-200 sm:text-base">{excerpt}</p>
      {biography.length > 420 && (
        <button
          type="button"
          onClick={onOpenBiography}
          className="text-sm font-semibold text-amber-400 transition hover:text-amber-300"
        >
          Devamını oku
        </button>
      )}
    </div>
  );
}

function PersonFilmography({ items }: { items: PersonCredit[] }) {
  const [expanded, setExpanded] = useState(false);
  if (items.length === 0) return <EmptyState message="Filmografi bilgisi bulunmuyor." />;

  const visible = expanded ? items : items.slice(0, FILMOGRAPHY_PREVIEW);
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6">
        {visible.map((item) => (
          <MediaCard key={`${item.mediaType}-${item.id}`} item={item} />
        ))}
      </div>
      {items.length > FILMOGRAPHY_PREVIEW && (
        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => setExpanded((open) => !open)}
            className="rounded-full border border-white/15 bg-white/5 px-7 py-3 text-sm font-semibold text-neutral-100 transition hover:border-amber-400/60 hover:text-amber-300"
          >
            {expanded ? 'Daha az göster' : `Tümünü göster (${items.length})`}
          </button>
        </div>
      )}
    </div>
  );
}

function PersonPhotos({ paths, name }: { paths: string[]; name: string }) {
  if (paths.length === 0) return <EmptyState message="Fotoğraf bulunmuyor." />;
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {paths.map((path) => (
        <div key={path} className="overflow-hidden rounded-xl bg-neutral-900 ring-1 ring-white/5">
          <img
            src={tmdbImage(path, 'w342') ?? undefined}
            alt={`${name} fotoğrafı`}
            loading="lazy"
            className="aspect-[3/4] h-full w-full object-cover transition duration-500 hover:scale-105"
          />
        </div>
      ))}
    </div>
  );
}

function PersonCoStars({ coStars }: { coStars: CoStar[] }) {
  if (coStars.length === 0) return <EmptyState message="Birlikte çalıştığı sanatçı bilgisi bulunmuyor." />;
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {coStars.map((star) => (
        <Link
          key={star.id}
          to={personPath(star.id)}
          className="group flex items-center gap-4 rounded-xl border border-white/5 bg-neutral-900/60 p-3 transition hover:border-amber-400/40 hover:bg-neutral-900"
        >
          <PersonAvatar name={star.name} path={star.profilePath} className="h-16 w-14 shrink-0 rounded-lg" />
          <div className="min-w-0 space-y-1">
            <p className="line-clamp-1 text-sm font-semibold text-neutral-100 transition group-hover:text-amber-300">
              {star.name}
            </p>
            <p className="line-clamp-1 text-xs text-neutral-400">{star.sharedTitle}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
