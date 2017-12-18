export interface Movie {
  id: string;
  title: string;
  genres: string;
  adult: boolean;
  runtimeMinutes?: number;
  actors: string[];
}
