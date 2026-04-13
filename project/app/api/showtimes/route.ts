import { sql } from "@/lib/db";
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  if (searchParams.get("admin") === "true") {
    // Flat list with full details for the admin panel
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
    return NextResponse.json(rows);
  }

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

  const grouped: Record<
    string,
    { show_id: string; time: string; showroom: number }[]
  > = {};

  for (const row of rows) {
    const label = new Date(row.time).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });

    if (!grouped[row.movie_name]) grouped[row.movie_name] = [];
    grouped[row.movie_name].push({
      show_id: row.show_id,
      time: label,
      showroom: row.showroom_num,
    });
  }

  return NextResponse.json(grouped);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = (await req.json()) as {
    movieId?: unknown;
    showroomId?: unknown;
    datetime?: unknown;
    duration?: unknown;
  };

  const movieId = Number(body.movieId);
  const showroomId = Number(body.showroomId);
  const datetimeStr = String(body.datetime ?? "");
  const duration = Number(body.duration);

  if (
    !movieId ||
    !showroomId ||
    !datetimeStr ||
    !duration ||
    isNaN(movieId) ||
    isNaN(showroomId) ||
    isNaN(duration)
  ) {
    return NextResponse.json(
      { error: "Missing or invalid fields." },
      { status: 400 },
    );
  }

  const startTime = new Date(datetimeStr);
  if (isNaN(startTime.getTime())) {
    return NextResponse.json({ error: "Invalid datetime." }, { status: 400 });
  }

  const endTime = new Date(startTime.getTime() + duration * 60_000);

  // Check for scheduling conflicts: same showroom, overlapping time window
  const conflicts = await sql`
        SELECT show_id FROM showtimes
        WHERE showroom_id = ${showroomId}
          AND "time" < ${endTime.toISOString()}::timestamp
          AND ("time" + (duration || ' minutes')::interval) > ${startTime.toISOString()}::timestamp
    `;

  if (conflicts.length > 0) {
    return NextResponse.json(
      {
        error:
          "Scheduling conflict: this showroom is already booked during that time.",
      },
      { status: 409 },
    );
  }

  // Verify the showroom exists
  const showroomRows = await sql`
        SELECT showroom_id FROM showrooms WHERE showroom_id = ${showroomId}
    `;
  if (showroomRows.length === 0) {
    return NextResponse.json({ error: "Showroom not found." }, { status: 404 });
  }

  // Insert the new showtime
  const [newShow] = await sql`
        INSERT INTO showtimes (showroom_id, movie_id, date, "time", duration)
        VALUES (
            ${showroomId},
            ${movieId},
            ${startTime.toISOString()}::timestamp,
            ${startTime.toISOString()}::timestamp,
            ${duration}
        )
        RETURNING show_id
    `;

  // Populate show_seats for every seat in the showroom
  await sql`
        INSERT INTO show_seats (show_id, seat_id, is_available)
        SELECT ${newShow.show_id}::uuid, seat_id, true
        FROM seats
        WHERE showroom_id = ${showroomId}
    `;

  return NextResponse.json(
    { success: true, show_id: newShow.show_id },
    { status: 201 },
  );
}
