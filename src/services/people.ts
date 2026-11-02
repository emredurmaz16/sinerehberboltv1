import { normalize, resolveType, tmdbGet, type RawMedia } from '@/services/tmdb';
import type { CoStar, PersonCredit, PersonDetail, PopularPerson } from '@/types/media';

interface RawCastMember {
  id: number;
  name: string;
  character?: string;
  profile_path: string | null;
}

interface RawPerson {
  id: number;
  name: string;
  biography?: string;
  birthday?: string | null;
  deathday?: string | null;
  place_of_birth?: string | null;
  profile_path?: string | null;
  known_for_department?: string | null;
  combined_credits?: { cast: (RawMedia & { character?: string })[] };
  images?: { profiles: { file_path: string }[] };
}

const CO_STAR_SOURCE_COUNT = 4;
const CO_STAR_LIMIT = 12;
const PHOTO_LIMIT = 24;
const POPULAR_LIMIT = 8;

function toFilmography(credits: (RawMedia & { character?: string })[]): PersonCredit[] {
  const unique = new Map<string, PersonCredit>();
  credits.forEach((credit) => {
    const type = resolveType(credit);
    if (!type) return;
    const key = `${type}-${credit.id}`;
    if (!unique.has(key)) unique.set(key, { ...normalize(credit, type), character: credit.character ?? '' });
  });
  return [...unique.values()].sort((a, b) => b.year.localeCompare(a.year));
}

async function deriveCoStars(films: PersonCredit[], personId: number): Promise<CoStar[]> {
  const sources = [...films].sort((a, b) => b.voteCount - a.voteCount).slice(0, CO_STAR_SOURCE_COUNT);
  const credits = await Promise.allSettled(
    sources.map((source) =>
      tmdbGet<{ cast: RawCastMember[] }>(`/${source.mediaType}/${source.id}/credits`).then((data) => ({
        source,
        cast: data.cast.slice(0, 20),
      })),
    ),
  );

  const tally = new Map<number, { member: RawCastMember; count: number; sharedTitle: string }>();
  credits.forEach((result) => {
    if (result.status !== 'fulfilled') return;
    result.value.cast.forEach((member) => {
      if (member.id === personId) return;
      const entry = tally.get(member.id);
      if (entry) entry.count += 1;
      else tally.set(member.id, { member, count: 1, sharedTitle: result.value.source.title });
    });
  });

  return [...tally.values()]
    .sort((a, b) => b.count - a.count)
    .slice(0, CO_STAR_LIMIT)
    .map(({ member, sharedTitle }) => ({
      id: member.id,
      name: member.name,
      profilePath: member.profile_path,
      sharedTitle,
    }));
}

export async function getPersonDetail(id: number): Promise<PersonDetail> {
  const raw = await tmdbGet<RawPerson>(`/person/${id}`, { append_to_response: 'combined_credits,images' });
  const filmography = toFilmography(raw.combined_credits?.cast ?? []);
  const coStars = await deriveCoStars(filmography, raw.id);

  return {
    id: raw.id,
    name: raw.name,
    department: raw.known_for_department ?? null,
    profilePath: raw.profile_path ?? null,
    birthday: raw.birthday || null,
    deathday: raw.deathday || null,
    placeOfBirth: raw.place_of_birth || null,
    biography: raw.biography?.trim() ?? '',
    filmography,
    photos: (raw.images?.profiles ?? []).slice(0, PHOTO_LIMIT).map((photo) => photo.file_path),
    coStars,
  };
}

export async function getPopularPeople(): Promise<PopularPerson[]> {
  const data = await tmdbGet<{
    results: { id: number; name: string; profile_path: string | null; known_for_department: string | null }[];
  }>('/person/popular', { page: 1 });
  return data.results.slice(0, POPULAR_LIMIT).map((person) => ({
    id: person.id,
    name: person.name,
    profilePath: person.profile_path,
    department: person.known_for_department,
  }));
}
