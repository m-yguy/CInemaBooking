import { sql } from "@/lib/db";

export interface ShowtimeRow {
  show_id: string;
  showroom_id: number;
}

export interface ShowtimeSummary {
  show_id: string;
  time: string;
  movie_name: string;
  showroom_num: number;
}

export interface ShowtimeAdminRow {
  show_id: string;
  movie_id: number;
  movie_name: string;
  showroom_id: number;
  showroom_num: number;
  time: string;
  duration: number;
}

export async function checkShowtimeConflicts(
  showroomId: number,
  startTime: Date,
  endTime: Date,
  excludeShowId?: string,
): Promise<boolean> {
  let conflicts;
  if (excludeShowId) {
    conflicts = await sql`
      SELECT show_id FROM showtimes
      WHERE showroom_id = ${showroomId}
        AND show_id != ${excludeShowId}::uuid
        AND "time" < ${endTime.toISOString()}::timestamp
        AND ("time" + (duration || ' minutes')::interval) > ${startTime.toISOString()}::timestamp
    `;
  } else {
    conflicts = await sql`
      SELECT show_id FROM showtimes
      WHERE showroom_id = ${showroomId}
        AND "time" < ${endTime.toISOString()}::timestamp
        AND ("time" + (duration || ' minutes')::interval) > ${startTime.toISOString()}::timestamp
    `;
  }
  return conflicts.length > 0;
}

export async function getShowtimeById(
  showId: string,
): Promise<ShowtimeRow | null> {
  const rows = await sql`
    SELECT showroom_id FROM showtimes WHERE show_id = ${showId}::uuid
  `;
  return (rows[0] as ShowtimeRow) ?? null;
}

export async function insertShowtime(data: {
  showroomId: number;
  movieId: number;
  startTime: Date;
  duration: number;
}): Promise<string> {
  const [newShow] = await sql`
    INSERT INTO showtimes (showroom_id, movie_id, date, "time", duration)
    VALUES (
      ${data.showroomId},
      ${data.movieId},
      ${data.startTime.toISOString()}::timestamp,
      ${data.startTime.toISOString()}::timestamp,
      ${data.duration}
    )
    RETURNING show_id
  `;
  return newShow.show_id as string;
}

export async function insertShowSeats(
  showId: string,
  showroomId: number,
): Promise<void> {
  await sql`
    INSERT INTO show_seats (show_id, seat_id, is_available)
    SELECT ${showId}::uuid, seat_id, true
    FROM seats
    WHERE showroom_id = ${showroomId}
  `;
}

export async function updateShowtime(
  showId: string,
  data: {
    movieId: number;
    showroomId: number;
    startTime: Date;
    duration: number;
  },
): Promise<void> {
  await sql`
    UPDATE showtimes SET
      movie_id    = ${data.movieId},
      showroom_id = ${data.showroomId},
      date        = ${data.startTime.toISOString()}::timestamp,
      "time"      = ${data.startTime.toISOString()}::timestamp,
      duration    = ${data.duration}
    WHERE show_id = ${showId}::uuid
  `;
}

export async function rebuildShowSeats(
  showId: string,
  showroomId: number,
): Promise<void> {
  await sql`DELETE FROM show_seats WHERE show_id = ${showId}::uuid`;
  await sql`
    INSERT INTO show_seats (show_id, seat_id, is_available)
    SELECT ${showId}::uuid, seat_id, true
    FROM seats
    WHERE showroom_id = ${showroomId}
  `;
}

export async function deleteShowtime(showId: string): Promise<void> {
  await sql`
    DELETE FROM tickets
    WHERE show_seat_id IN (
      SELECT show_seat_id FROM show_seats WHERE show_id = ${showId}::uuid
    )
  `;
  await sql`DELETE FROM show_seats WHERE show_id = ${showId}::uuid`;
  await sql`DELETE FROM showtimes WHERE show_id = ${showId}::uuid`;
}

export async function showroomExists(showroomId: number): Promise<boolean> {
  const rows = await sql`
    SELECT showroom_id FROM showrooms WHERE showroom_id = ${showroomId}
  `;
  return rows.length > 0;
}

export async function listShowtimesAdmin(): Promise<ShowtimeAdminRow[]> {
  const rows = await sql`
    SELECT
      s.show_id,
      s.movie_id,
      m.movie_name,
      s.showroom_id,
      r.showroom_num,
      s.time,
      s.duration
    FROM showtimes s
    JOIN movies m ON s.movie_id = m.movie_id
    JOIN showrooms r ON s.showroom_id = r.showroom_id
    ORDER BY s.time ASC, m.movie_name ASC
  `;
  return rows as ShowtimeAdminRow[];
}

export async function listShowtimes(): Promise<ShowtimeSummary[]> {
  const rows = await sql`
    SELECT
      showtimes.show_id,
      showtimes.time,
      movies.movie_name,
      showrooms.showroom_num
    FROM showtimes
    JOIN movies ON showtimes.movie_id = movies.movie_id
    JOIN showrooms ON showtimes.showroom_id = showrooms.showroom_id
    ORDER BY movies.movie_name, showtimes.time
  `;
  return rows as ShowtimeSummary[];
}
