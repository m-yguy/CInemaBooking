import { auth } from "@/auth";
import { NextResponse } from "next/server";
import {
  checkShowtimeConflicts,
  insertShowtime,
  insertShowSeats,
  showroomExists,
  listShowtimesAdmin,
  listShowtimes,
} from "@/lib/repositories/showtimeRepository";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  if (searchParams.get("admin") === "true") {
    const rows = await listShowtimesAdmin();
    return NextResponse.json(rows);
  }

  const rows = await listShowtimes();

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

  const hasConflict = await checkShowtimeConflicts(
    showroomId,
    startTime,
    endTime,
  );
  if (hasConflict) {
    return NextResponse.json(
      {
        error:
          "Scheduling conflict: this showroom is already booked during that time.",
      },
      { status: 409 },
    );
  }

  const exists = await showroomExists(showroomId);
  if (!exists) {
    return NextResponse.json({ error: "Showroom not found." }, { status: 404 });
  }

  const show_id = await insertShowtime({
    showroomId,
    movieId,
    startTime,
    duration,
  });
  await insertShowSeats(show_id, showroomId);

  return NextResponse.json({ success: true, show_id }, { status: 201 });
}
