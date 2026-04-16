import { sql } from "@/lib/dbSingleton";
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id: showId } = await params;

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

  // Verify the showtime exists
  const existing =
    await sql`SELECT showroom_id FROM showtimes WHERE show_id = ${showId}::uuid`;
  if (existing.length === 0) {
    return NextResponse.json({ error: "Showtime not found." }, { status: 404 });
  }

  const endTime = new Date(startTime.getTime() + duration * 60_000);
  const oldShowroomId = existing[0].showroom_id as number;

  // Check for conflicts in the target showroom, excluding this showtime
  const conflicts = await sql`
    SELECT show_id FROM showtimes
    WHERE showroom_id = ${showroomId}
      AND show_id != ${showId}::uuid
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

  // Update the showtime
  await sql`
    UPDATE showtimes SET
      movie_id  = ${movieId},
      showroom_id = ${showroomId},
      date      = ${startTime.toISOString()}::timestamp,
      "time"    = ${startTime.toISOString()}::timestamp,
      duration  = ${duration}
    WHERE show_id = ${showId}::uuid
  `;

  // If the showroom changed, rebuild show_seats
  if (oldShowroomId !== showroomId) {
    await sql`DELETE FROM show_seats WHERE show_id = ${showId}::uuid`;
    await sql`
      INSERT INTO show_seats (show_id, seat_id, is_available)
      SELECT ${showId}::uuid, seat_id, true
      FROM seats
      WHERE showroom_id = ${showroomId}
    `;
  }

  return NextResponse.json({ success: true });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id: showId } = await params;

  const existing =
    await sql`SELECT show_id FROM showtimes WHERE show_id = ${showId}::uuid`;
  if (existing.length === 0) {
    return NextResponse.json({ error: "Showtime not found." }, { status: 404 });
  }

  // Cascading deletes: tickets → show_seats → showtimes
  await sql`
    DELETE FROM tickets
    WHERE show_seat_id IN (
      SELECT show_seat_id FROM show_seats WHERE show_id = ${showId}::uuid
    )
  `;
  await sql`DELETE FROM show_seats WHERE show_id = ${showId}::uuid`;
  await sql`DELETE FROM showtimes WHERE show_id = ${showId}::uuid`;

  return NextResponse.json({ success: true });
}
