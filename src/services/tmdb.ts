import type {
  CastMember,
  Genre,
  MediaDetail,
  MediaItem,
  MediaType,
  PagedResult,
  TrailerItem,
} from '@/types/media';

const API_BASE = 'https://api.themoviedb.org/3';
const READ_TOKEN =
  'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0YzI1Yjg3MTg3ZWYyNGQwNDIxY2E2ZDk4YmU4YzEyZCIsIm5iZiI6MTYyMDE4NjgyNi40NDEsInN1YiI6IjYwOTIxNmNhYWYzZGE2MDAyOTAzYjY1YyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.aygnzZT0NOd36iViHS95uxqyrMQmEK8F46y8WTSVV9U';
const LANGUAGE = 'tr-TR';
const REGION = 'TR';

export type ImageSize = 'w92' | 'w185' | 'w342' | 'w500' | 'w780' | 'w1280' | 'original';

export function tmdbImage(path: string | null | undefined, size: ImageSize = 'w500'): string | null {
  return path ? `https://image.tmdb.org/t/p/${size}${path}` : null;
}

export class TmdbError extends Error {}

export function getErrorMessage(error: unknown): string {
  if (error instanceof TmdbError) return error.message;
  return 'Bağlantı sırasında bir sorun oluştu. Lütfen tekrar deneyin.';
}

type Params = Record<string, string | number | undefined>;

export interface RawMedia {
  id: number;
  media_type?: string;
  title?: string;
  name?: string;
  overview?: string;
  poster_path?: string | null;
  backdrop_path?: string | null;
  vote_average?: number;
  vote_count?: number;
  release_date?: string;
  first_air_date?: string;
  genre_ids?: number[];
}

interface RawPage<T> {
  page: number;
  total_pages: number;
  results: T[];
}

interface RawDetail extends RawMedia {
  tagline?: string;
  runtime?: number | null;
  episode_run_time?: number[];
  number_of_seasons?: number;
  number_of_episodes?: number;
  genres?: Genre[];
  credits?: {
    cast: { id: number; name: string; character: string; profile_path: string | null }[];
  };
  videos?: {
    results: { key: string; site: string; type: string; official: boolean }[];
  };
  'watch/providers'?: {
    results: Record<string, { flatrate?: { provider_id: number; provider_name: string }[] }>;
  };
  similar?: RawPage<RawMedia>;
}

export async function tmdbGet<T>(path: string, params: Params = {}): Promise<T> {
  const url = new URL(`${API_BASE}${path}`);
  url.searchParams.set('language', LANGUAGE);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') url.searchParams.set(key, String(value));
  });

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${READ_TOKEN}`,
      Accept: 'application/json',
    },
  });
  if (!response.ok) {
    throw new TmdbError('Veriler şu anda alınamıyor. Lütfen daha sonra tekrar deneyin.');
  }
  return (await response.json()) as T;
}

export function resolveType(raw: RawMedia, fallback?: MediaType): MediaType | null {
  if (fallback) return fallback;
  return raw.media_type === 'movie' || raw.media_type === 'tv' ? raw.media_type : null;
}

export function normalize(raw: RawMedia, mediaType: MediaType): MediaItem {
  const isMovie = mediaType === 'movie';
  const date = (isMovie ? raw.release_date : raw.first_air_date) ?? '';
  return {
    id: raw.id,
    mediaType,
    title: (isMovie ? raw.title : raw.name) ?? '',
    overview: raw.overview ?? '',
    posterPath: raw.poster_path ?? null,
    backdropPath: raw.backdrop_path ?? null,
    rating: Math.round((raw.vote_average ?? 0) * 10) / 10,
    voteCount: raw.vote_count ?? 0,
    year: date.slice(0, 4),
    genreIds: raw.genre_ids ?? [],
  };
}

function toPaged(data: RawPage<RawMedia>, fallbackType?: MediaType): PagedResult {
  const items = data.results.flatMap((raw) => {
    const type = resolveType(raw, fallbackType);
    return type ? [normalize(raw, type)] : [];
  });
  return { items, page: data.page, totalPages: data.total_pages };
}

export async function getPlatformLogos(): Promise<Record<number, string>> {
  const data = await tmdbGet<{ results: { provider_id: number; logo_path: string | null }[] }>(
    '/watch/providers/movie',
    { watch_region: REGION },
  );
  return Object.fromEntries(
    data.results.flatMap((provider) => (provider.logo_path ? [[provider.provider_id, provider.logo_path]] : [])),
  );
}

export async function getNetworkLogos(networkIds: number[]): Promise<Record<number, string>> {
  const networks = await Promise.all(
    networkIds.map((id) => tmdbGet<{ logo_path: string | null }>(`/network/${id}`).then((data) => [id, data.logo_path] as const)),
  );
  return Object.fromEntries(networks.flatMap(([id, logoPath]) => (logoPath ? [[id, logoPath]] : [])));
}

export function getTrending(
  window: 'day' | 'week',
  type: MediaType | 'all',
  page = 1,
): Promise<PagedResult> {
  return tmdbGet<RawPage<RawMedia>>(`/trending/${type}/${window}`, { page }).then((data) =>
    toPaged(data, type === 'all' ? undefined : type),
  );
}

export function getCategory(path: string, mediaType: MediaType, page = 1): Promise<PagedResult> {
  return tmdbGet<RawPage<RawMedia>>(path, { page }).then((data) => toPaged(data, mediaType));
}

interface DiscoverOptions {
  page?: number;
  genreId?: number;
  providerId?: number;
  networkIds?: number[];
  originalLanguage?: string;
  sortBy?: string;
  minVotes?: number;
}

export function discoverMedia(mediaType: MediaType, options: DiscoverOptions = {}): Promise<PagedResult> {
  const {
    page = 1,
    genreId,
    providerId,
    networkIds,
    originalLanguage,
    sortBy = 'popularity.desc',
    minVotes,
  } = options;

  return tmdbGet<RawPage<RawMedia>>(`/discover/${mediaType}`, {
    page,
    sort_by: sortBy,
    with_genres: genreId,
    with_watch_providers: providerId,
    with_networks: networkIds?.join('|'),
    watch_region: providerId ? REGION : undefined,
    with_original_language: originalLanguage,
    'vote_count.gte': minVotes,
  }).then((data) => toPaged(data, mediaType));
}

export async function getGenres(mediaType: MediaType): Promise<Genre[]> {
  const data = await tmdbGet<{ genres: Genre[] }>(`/genre/${mediaType}/list`);
  return data.genres;
}

interface RawVideos {
  results: { key: string; site: string; type: string; official: boolean }[];
}

async function getTrailerKey(mediaType: MediaType, id: number): Promise<string | null> {
  const data = await tmdbGet<RawVideos>(`/${mediaType}/${id}/videos`, { language: 'en-US' });
  const trailer =
    data.results.find((v) => v.site === 'YouTube' && v.type === 'Trailer' && v.official) ??
    data.results.find((v) => v.site === 'YouTube' && v.type === 'Trailer');
  return trailer?.key ?? null;
}

export async function getLatestTrailers(): Promise<TrailerItem[]> {
  const [movies, shows, movieGenres, tvGenres] = await Promise.all([
    getCategory('/movie/now_playing', 'movie'),
    getCategory('/tv/on_the_air', 'tv'),
    getGenres('movie'),
    getGenres('tv'),
  ]);
  const candidates = [...movies.items, ...shows.items];
  const keys = await Promise.allSettled(candidates.map((item) => getTrailerKey(item.mediaType, item.id)));
  const genreNames = new Map<number, string>([...movieGenres, ...tvGenres].map((genre) => [genre.id, genre.name]));

  return candidates.flatMap((item, index) => {
    const result = keys[index];
    const trailerKey = result.status === 'fulfilled' ? result.value : null;
    if (!trailerKey) return [];
    const names = item.genreIds
      .map((id) => genreNames.get(id))
      .filter((name): name is string => Boolean(name))
      .slice(0, 3);
    return [{ ...item, trailerKey, genreNames: names }];
  }).slice(0, 14);
}

export function searchMedia(query: string, page = 1): Promise<PagedResult> {
  return tmdbGet<RawPage<RawMedia>>('/search/multi', {
    query,
    page,
    include_adult: 'false',
  }).then((data) => toPaged(data));
}

export async function getMediaDetail(mediaType: MediaType, id: number): Promise<MediaDetail> {
  const raw = await tmdbGet<RawDetail>(`/${mediaType}/${id}`, {
    append_to_response: 'credits,videos,watch/providers,similar',
  });

  const isMovie = mediaType === 'movie';
  const videos = raw.videos?.results ?? [];
  const trailer =
    videos.find((v) => v.site === 'YouTube' && v.type === 'Trailer' && v.official) ??
    videos.find((v) => v.site === 'YouTube' && v.type === 'Trailer') ??
    null;
  const flatrate = raw['watch/providers']?.results[REGION]?.flatrate ?? [];
  const cast: CastMember[] = (raw.credits?.cast ?? []).slice(0, 15).map((member) => ({
    id: member.id,
    name: member.name,
    character: member.character,
    profilePath: member.profile_path,
  }));

  return {
    ...normalize(raw, mediaType),
    tagline: raw.tagline ?? '',
    runtime: isMovie ? (raw.runtime ?? null) : (raw.episode_run_time?.[0] ?? null),
    seasons: isMovie ? null : (raw.number_of_seasons ?? null),
    episodes: isMovie ? null : (raw.number_of_episodes ?? null),
    genres: raw.genres ?? [],
    cast,
    trailerKey: trailer?.key ?? null,
    providers: flatrate.map((provider) => ({ id: provider.provider_id, name: provider.provider_name })),
    similar: toPaged(raw.similar ?? { page: 1, total_pages: 1, results: [] }, mediaType).items.slice(0, 15),
  };
}
