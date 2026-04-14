import {
  getAllMovies,
  searchMovies,
  getMovieByTitle,
  addMovie as addMovieRepo,
} from "@/lib/repositories/movieRepository";

export type AddMovieInput = Parameters<typeof addMovieRepo>[0];

export async function listMovies() {
  return getAllMovies();
}

export async function searchMoviesByQuery(query: string) {
  return searchMovies(query);
}

export async function getMovieDetails(title: string) {
  return getMovieByTitle(title);
}

export async function addMovie(data: AddMovieInput): Promise<number> {
  return addMovieRepo(data);
}
