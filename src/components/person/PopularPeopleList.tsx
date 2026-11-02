import { useAsync } from '@/hooks/useAsync';
import { ErrorState } from '@/components/common/StateMessage';
import PersonAvatar from '@/components/person/PersonAvatar';
import PersonSection from '@/components/person/PersonSection';
import { departmentLabel, personPath } from '@/lib/format';
import { getPopularPeople } from '@/services/people';
import { Link } from 'react-router-dom';

export default function PopularPeopleList() {
  const people = useAsync(getPopularPeople, []);

  return (
    <PersonSection title="Günün Popüler Sanatçıları">
      {people.error && <ErrorState message={people.error} />}
      {people.loading && (
        <div className="space-y-4">
          {Array.from({ length: 5 }, (_, index) => (
            <div key={index} className="h-16 animate-pulse rounded-xl bg-neutral-800/70" />
          ))}
        </div>
      )}
      {people.data && (
        <ol className="space-y-3">
          {people.data.map((person, index) => (
            <li key={person.id}>
              <Link
                to={personPath(person.id)}
                className="group flex items-center gap-4 rounded-xl p-2 transition hover:bg-white/5"
              >
                <span className="relative shrink-0">
                  <PersonAvatar name={person.name} path={person.profilePath} className="h-16 w-14 rounded-lg" />
                  <span className="absolute -left-1.5 -top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-amber-400 text-xs font-bold text-black">
                    {index + 1}
                  </span>
                </span>
                <span className="min-w-0 space-y-1">
                  <span className="line-clamp-1 block text-sm font-semibold text-neutral-100 transition group-hover:text-amber-300">
                    {person.name}
                  </span>
                  <span className="line-clamp-2 block text-xs text-neutral-400">
                    {departmentLabel(person.department)}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ol>
      )}
    </PersonSection>
  );
}
