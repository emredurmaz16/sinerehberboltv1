export type MediaType = 'movie' | 'tv';

export interface Genre {
  id: number;
  name: string;
}

export interface MediaItem {
  id: number;
  mediaType: MediaType;
  title: string;
  overview: string;
  posterPath: string | null;
  backdropPath: string | null;
  rating: number;
  voteCount: number;
  year: string;
  genreIds: number[];
}

export interface PagedResult {
  items: MediaItem[];
  page: number;
  totalPages: number;
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profilePath: string | null;
}

export interface Provider {
  id: number;
  name: string;
}

export interface MediaDetail extends MediaItem {
  tagline: string;
  runtime: number | null;
  seasons: number | null;
  episodes: number | null;
  genres: Genre[];
  cast: CastMember[];
  trailerKey: string | null;
  providers: Provider[];
  similar: MediaItem[];
}

export interface TrailerItem extends MediaItem {
  trailerKey: string;
  genreNames: string[];
}

export interface PersonCredit extends MediaItem {
  character: string;
}

export interface CoStar {
  id: number;
  name: string;
  profilePath: string | null;
  sharedTitle: string;
}

export interface PersonDetail {
  id: number;
  name: string;
  department: string | null;
  profilePath: string | null;
  birthday: string | null;
  deathday: string | null;
  placeOfBirth: string | null;
  biography: string;
  filmography: PersonCredit[];
  photos: string[];
  coStars: CoStar[];
}

export interface PopularPerson {
  id: number;
  name: string;
  profilePath: string | null;
  department: string | null;
}
