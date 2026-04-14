import {
  getAllMovies,
  searchMovies,
  getMovieByTitle,
} from "@/lib/repositories/movieRepository";

export async function listMovies() {
  return getAllMovies();
}

export async function searchMoviesByQuery(query: string) {
  return searchMovies(query);
}

export async function getMovieDetails(title: string) {
  return getMovieByTitle(title);
}
