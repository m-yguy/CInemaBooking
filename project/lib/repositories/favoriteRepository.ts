import { sql } from "@/lib/dbSingleton";

export interface FavoriteMovie {
  movie_id: number;
  title: string;
  poster_path: string | null;
}

export async function getFavoriteMovieIds(userId: string): Promise<number[]> {
  const rows = await sql`
    SELECT movie_id FROM customer_favorite_movies
    WHERE customer_id = ${userId}
  `;
  return rows.map((r) => r.movie_id as number);
}

export async function addFavorite(
  userId: string,
  movieId: number,
): Promise<void> {
  await sql`
    INSERT INTO customer_favorite_movies (customer_id, movie_id)
    VALUES (${userId}, ${movieId})
    ON CONFLICT DO NOTHING
  `;
}

export async function removeFavorite(
  userId: string,
  movieId: number,
): Promise<void> {
  await sql`
    DELETE FROM customer_favorite_movies
    WHERE customer_id = ${userId} AND movie_id = ${movieId}
  `;
}

export async function getFavoriteMovies(
  userId: string,
): Promise<FavoriteMovie[]> {
  const rows = await sql`
    SELECT
      m.movie_id,
      m.movie_name AS title,
      m.trailer_image AS poster_path
    FROM movies m
    JOIN customer_favorite_movies f ON f.movie_id = m.movie_id
    WHERE f.customer_id = ${userId}
    ORDER BY m.movie_name ASC
  `;
  return rows as FavoriteMovie[];
}
