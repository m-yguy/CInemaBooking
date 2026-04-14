import {
  getFavoriteMovieIds,
  getFavoriteMovies,
  addFavorite,
  removeFavorite,
  type FavoriteMovie,
} from "@/lib/repositories/favoriteRepository";

export type { FavoriteMovie };

export async function listFavoriteIds(userId: string): Promise<number[]> {
  return getFavoriteMovieIds(userId);
}

export async function toggleFavorite(
  userId: string,
  movieId: number,
  favorited: boolean,
): Promise<void> {
  if (favorited) {
    await addFavorite(userId, movieId);
  } else {
    await removeFavorite(userId, movieId);
  }
}

export async function getFavoriteMovieList(
  userId: string,
): Promise<FavoriteMovie[]> {
  return getFavoriteMovies(userId);
}

export async function removeFavoriteMovie(
  userId: string,
  movieId: number,
): Promise<void> {
  await removeFavorite(userId, movieId);
}
