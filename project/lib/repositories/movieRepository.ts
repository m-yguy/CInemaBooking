import { sql } from "@/lib/dbSingleton";

export async function getAllMovies() {
  return sql`
    SELECT
      m.movie_id,
      m.movie_name AS title,
      COALESCE(string_agg(DISTINCT g.name, ' / '), '') AS genre,
      m.average_rating AS rating,
      m.synopsis AS movie_description,
      m.trailer_image AS poster_path,
      COALESCE(MIN(s.date), NOW()) AS showtime,
      m.trailer AS trailer_link,
      CASE
        WHEN m.release_status = 'NOW_PLAYING' THEN 'Now Playing'
        WHEN m.release_status = 'COMING_SOON' THEN 'Coming Soon'
        ELSE 'Now Playing'
      END AS release_status,
      m.mpaa_us::text AS mpa_rating,
      COALESCE(string_agg(DISTINCT a.actor_name, ', '), '') AS movie_cast,
      COALESCE(string_agg(DISTINCT d.director_name, ', '), '') AS director,
      COALESCE(string_agg(DISTINCT p.producer_name, ', '), '') AS producer,
      m.runtime
    FROM movies m
    LEFT JOIN showtimes s ON s.movie_id = m.movie_id
    LEFT JOIN movie_genres mg ON mg.movie_id = m.movie_id
    LEFT JOIN genres g ON g.genre_id = mg.genre_id
    LEFT JOIN movie_casts mc ON mc.movie_id = m.movie_id
    LEFT JOIN actors a ON a.actor_id = mc.actor_id
    LEFT JOIN movie_directors md ON md.movie_id = m.movie_id
    LEFT JOIN directors d ON d.director_id = md.director_id
    LEFT JOIN movie_producers mp ON mp.movie_id = m.movie_id
    LEFT JOIN producers p ON p.producer_id = mp.producer_id
    GROUP BY m.movie_id
    ORDER BY m.movie_name ASC
  `;
}

export async function searchMovies(q: string) {
  return sql`
    SELECT
      m.movie_name AS title,
      m.trailer_image AS poster_path,
      CASE
        WHEN m.release_status = 'NOW_PLAYING' THEN 'Now Playing'
        WHEN m.release_status = 'COMING_SOON' THEN 'Coming Soon'
        ELSE 'Now Playing'
      END AS release_status
    FROM movies m
    WHERE m.movie_name ILIKE ${"%" + q + "%"}
    ORDER BY
      CASE WHEN m.movie_name ILIKE ${q + "%"} THEN 0 ELSE 1 END,
      m.movie_name ASC
    LIMIT 8
  `;
}

export async function getMovieByTitle(title: string) {
  const rows = await sql`
    SELECT
      m.movie_name AS title,
      COALESCE(string_agg(DISTINCT g.name, ' / '), '') AS genre,
      m.average_rating AS rating,
      m.synopsis AS movie_description,
      m.trailer_image AS poster_path,
      COALESCE(MIN(s.date), NOW()) AS showtime,
      m.trailer AS trailer_link,
      CASE
        WHEN m.release_status = 'NOW_PLAYING' THEN 'Now Playing'
        WHEN m.release_status = 'COMING_SOON' THEN 'Coming Soon'
        ELSE 'Now Playing'
      END AS release_status,
      m.mpaa_us::text AS mpa_rating,
      COALESCE(string_agg(DISTINCT a.actor_name, ', '), '') AS movie_cast,
      COALESCE(string_agg(DISTINCT d.director_name, ', '), '') AS director,
      COALESCE(string_agg(DISTINCT p.producer_name, ', '), '') AS producer,
      m.runtime
    FROM movies m
    LEFT JOIN showtimes s ON s.movie_id = m.movie_id
    LEFT JOIN movie_genres mg ON mg.movie_id = m.movie_id
    LEFT JOIN genres g ON g.genre_id = mg.genre_id
    LEFT JOIN movie_casts mc ON mc.movie_id = m.movie_id
    LEFT JOIN actors a ON a.actor_id = mc.actor_id
    LEFT JOIN movie_directors md ON md.movie_id = m.movie_id
    LEFT JOIN directors d ON d.director_id = md.director_id
    LEFT JOIN movie_producers mp ON mp.movie_id = m.movie_id
    LEFT JOIN producers p ON p.producer_id = mp.producer_id
    WHERE m.movie_name ILIKE ${title}
    GROUP BY m.movie_id
    LIMIT 1
  `;
  return rows[0] ?? null;
}

export async function addMovie(data: {
  title: string;
  genres: string[];
  synopsis: string;
  trailer: string;
  trailerImage: string;
  mpaaRating: string;
  releaseStatus: string;
  runtime: number;
  cast: string[];
  directors: string[];
  producers: string[];
}): Promise<number> {
  const mpaaParam = data.mpaaRating || null;
  const [movie] = await sql`
    INSERT INTO movies (movie_name, synopsis, trailer, trailer_image, mpaa_us, release_status, runtime)
    VALUES (
      ${data.title},
      ${data.synopsis || null},
      ${data.trailer || null},
      ${data.trailerImage || null},
      ${mpaaParam}::public.mpaa_rating,
      ${data.releaseStatus}::public.release_status,
      ${data.runtime}
    )
    RETURNING movie_id
  `;
  const movieId: number = movie.movie_id;

  for (const name of data.genres) {
    const trimmed = name.trim();
    if (!trimmed) continue;
    const existing =
      await sql`SELECT genre_id FROM genres WHERE LOWER(name) = LOWER(${trimmed}) LIMIT 1`;
    let genreId: number;
    if (existing.length > 0) {
      genreId = existing[0].genre_id;
    } else {
      const [inserted] =
        await sql`INSERT INTO genres (name) VALUES (${trimmed}) RETURNING genre_id`;
      genreId = inserted.genre_id;
    }
    await sql`INSERT INTO movie_genres (movie_id, genre_id) VALUES (${movieId}, ${genreId}) ON CONFLICT DO NOTHING`;
  }

  for (const name of data.cast) {
    const trimmed = name.trim();
    if (!trimmed) continue;
    const existing =
      await sql`SELECT actor_id FROM actors WHERE actor_name = ${trimmed} LIMIT 1`;
    let actorId: number;
    if (existing.length > 0) {
      actorId = existing[0].actor_id;
    } else {
      const [inserted] =
        await sql`INSERT INTO actors (actor_name) VALUES (${trimmed}) RETURNING actor_id`;
      actorId = inserted.actor_id;
    }
    await sql`INSERT INTO movie_casts (movie_id, actor_id) VALUES (${movieId}, ${actorId}) ON CONFLICT DO NOTHING`;
  }

  for (const name of data.directors) {
    const trimmed = name.trim();
    if (!trimmed) continue;
    const existing =
      await sql`SELECT director_id FROM directors WHERE director_name = ${trimmed} LIMIT 1`;
    let directorId: number;
    if (existing.length > 0) {
      directorId = existing[0].director_id;
    } else {
      const [inserted] =
        await sql`INSERT INTO directors (director_name) VALUES (${trimmed}) RETURNING director_id`;
      directorId = inserted.director_id;
    }
    await sql`INSERT INTO movie_directors (movie_id, director_id) VALUES (${movieId}, ${directorId}) ON CONFLICT DO NOTHING`;
  }

  for (const name of data.producers) {
    const trimmed = name.trim();
    if (!trimmed) continue;
    const existing =
      await sql`SELECT producer_id FROM producers WHERE producer_name = ${trimmed} LIMIT 1`;
    let producerId: number;
    if (existing.length > 0) {
      producerId = existing[0].producer_id;
    } else {
      const [inserted] =
        await sql`INSERT INTO producers (producer_name) VALUES (${trimmed}) RETURNING producer_id`;
      producerId = inserted.producer_id;
    }
    await sql`INSERT INTO movie_producers (movie_id, producer_id) VALUES (${movieId}, ${producerId}) ON CONFLICT DO NOTHING`;
  }

  return movieId;
}
