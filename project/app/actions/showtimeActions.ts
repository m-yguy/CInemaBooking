"use server";

import { auth } from "@/auth";
import { sql } from "@/lib/db";

export async function addShowtimeAction(data: {
  movieId: number;
  showroomId: number;
  datetime: string;
  duration: number;
}): Promise<{ error: string } | { success: true; show_id: string }> {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return { error: "Forbidden" };
  }

  if (!data.movieId || !data.showroomId || !data.datetime || !data.duration) {
    return { error: "All fields are required." };
  }

  if (!Number.isInteger(data.duration) || data.duration <= 0) {
    return { error: "Duration must be a positive whole number." };
  }

  const startTime = new Date(data.datetime);
  if (isNaN(startTime.getTime())) {
    return { error: "Invalid date/time." };
  }

  const endTime = new Date(startTime.getTime() + data.duration * 60_000);

  try {
    // Check for scheduling conflicts: same showroom, overlapping time window
    const conflicts = await sql`
      SELECT show_id FROM showtimes
      WHERE showroom_id = ${data.showroomId}
        AND "time" < ${endTime.toISOString()}::timestamp
        AND ("time" + (duration || ' minutes')::interval) > ${startTime.toISOString()}::timestamp
    `;

    if (conflicts.length > 0) {
      return {
        error:
          "Scheduling conflict: this showroom is already booked during that time.",
      };
    }

    // Insert the new showtime
    const [newShow] = await sql`
      INSERT INTO showtimes (showroom_id, movie_id, date, "time", duration)
      VALUES (
        ${data.showroomId},
        ${data.movieId},
        ${startTime.toISOString()}::timestamp,
        ${startTime.toISOString()}::timestamp,
        ${data.duration}
      )
      RETURNING show_id
    `;

    // Populate show_seats for every seat in the showroom
    await sql`
      INSERT INTO show_seats (show_id, seat_id, is_available)
      SELECT ${newShow.show_id}::uuid, seat_id, true
      FROM seats
      WHERE showroom_id = ${data.showroomId}
    `;

    return { success: true, show_id: newShow.show_id as string };
  } catch {
    return { error: "Failed to add showtime. Please try again." };
  }
}

export async function editShowtimeAction(
  showId: string,
  data: {
    movieId: number;
    showroomId: number;
    datetime: string;
    duration: number;
  }
): Promise<{ error: string } | { success: true }> {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return { error: "Forbidden" };
  }

  if (!showId || !data.movieId || !data.showroomId || !data.datetime || !data.duration) {
    return { error: "All fields are required." };
  }

  if (!Number.isInteger(data.duration) || data.duration <= 0) {
    return { error: "Duration must be a positive whole number." };
  }

  const startTime = new Date(data.datetime);
  if (isNaN(startTime.getTime())) {
    return { error: "Invalid date/time." };
  }

  const endTime = new Date(startTime.getTime() + data.duration * 60_000);

  try {
    const existing = await sql`SELECT showroom_id FROM showtimes WHERE show_id = ${showId}::uuid`;
    if (existing.length === 0) {
      return { error: "Showtime not found." };
    }

    const oldShowroomId = existing[0].showroom_id as number;

    // Check conflicts, excluding this showtime
    const conflicts = await sql`
      SELECT show_id FROM showtimes
      WHERE showroom_id = ${data.showroomId}
        AND show_id != ${showId}::uuid
        AND "time" < ${endTime.toISOString()}::timestamp
        AND ("time" + (duration || ' minutes')::interval) > ${startTime.toISOString()}::timestamp
    `;

    if (conflicts.length > 0) {
      return {
        error:
          "Scheduling conflict: this showroom is already booked during that time.",
      };
    }

    await sql`
      UPDATE showtimes SET
        movie_id    = ${data.movieId},
        showroom_id = ${data.showroomId},
        date        = ${startTime.toISOString()}::timestamp,
        "time"      = ${startTime.toISOString()}::timestamp,
        duration    = ${data.duration}
      WHERE show_id = ${showId}::uuid
    `;

    // Rebuild show_seats if showroom changed
    if (oldShowroomId !== data.showroomId) {
      await sql`DELETE FROM show_seats WHERE show_id = ${showId}::uuid`;
      await sql`
        INSERT INTO show_seats (show_id, seat_id, is_available)
        SELECT ${showId}::uuid, seat_id, true
        FROM seats
        WHERE showroom_id = ${data.showroomId}
      `;
    }

    return { success: true };
  } catch {
    return { error: "Failed to update showtime. Please try again." };
  }
}

export async function deleteShowtimeAction(
  showId: string
): Promise<{ error: string } | { success: true }> {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return { error: "Forbidden" };
  }

  if (!showId) return { error: "Showtime ID is required." };

  try {
    const existing = await sql`SELECT show_id FROM showtimes WHERE show_id = ${showId}::uuid`;
    if (existing.length === 0) return { error: "Showtime not found." };

    await sql`
      DELETE FROM tickets
      WHERE show_seat_id IN (
        SELECT show_seat_id FROM show_seats WHERE show_id = ${showId}::uuid
      )
    `;
    await sql`DELETE FROM show_seats WHERE show_id = ${showId}::uuid`;
    await sql`DELETE FROM showtimes WHERE show_id = ${showId}::uuid`;

    return { success: true };
  } catch {
    return { error: "Failed to delete showtime. Please try again." };
  }
}
