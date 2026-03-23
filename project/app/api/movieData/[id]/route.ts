import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const decodedTitle = decodeURIComponent(id);

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
        WHERE m.movie_name ILIKE ${decodedTitle}
        GROUP BY m.movie_id
        LIMIT 1
    `;

  if (rows.length === 0) {
    return NextResponse.json({ error: "Movie not found" }, { status: 404 });
  }

  return NextResponse.json(rows[0]);
}
