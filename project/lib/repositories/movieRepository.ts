import { sql } from "@/lib/db";

export async function getAllMovies() {
  return sql`
    SELECT
      m.movie_id,
      m.movie_name AS title,
      m.category AS genre,
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
      m.category AS genre,
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
