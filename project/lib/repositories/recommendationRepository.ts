import { sql } from "@/lib/dbSingleton";

export async function getRecommendationsForCustomer(customerId: string) {
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
    FROM public.customer_recommendations cr
    JOIN public.movies m ON m.movie_id = cr.movie_id
    LEFT JOIN public.showtimes s ON s.movie_id = m.movie_id
    LEFT JOIN public.movie_genres mg ON mg.movie_id = m.movie_id
    LEFT JOIN public.genres g ON g.genre_id = mg.genre_id
    LEFT JOIN public.movie_casts mc ON mc.movie_id = m.movie_id
    LEFT JOIN public.actors a ON a.actor_id = mc.actor_id
    LEFT JOIN public.movie_directors md ON md.movie_id = m.movie_id
    LEFT JOIN public.directors d ON d.director_id = md.director_id
    LEFT JOIN public.movie_producers mp ON mp.movie_id = m.movie_id
    LEFT JOIN public.producers p ON p.producer_id = mp.producer_id
    WHERE cr.customer_id = ${customerId}
    GROUP BY m.movie_id, cr.recommendation_rank
    ORDER BY cr.recommendation_rank ASC;
  `;
}
