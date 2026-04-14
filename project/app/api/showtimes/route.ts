import { auth } from "@/auth";
import { NextResponse } from "next/server";
import * as showtimeService from "@/lib/services/showtimeService";
import { withAuthAdminRoute } from "@/lib/middleware/withAuth";

// GET is public (grouped list) or admin-gated (?admin=true).
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  if (searchParams.get("admin") === "true") {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const rows = await showtimeService.getShowtimesAdmin();
    return NextResponse.json(rows);
  }

  const rows = await showtimeService.getShowtimes();

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

export const POST = withAuthAdminRoute(async (_session, request) => {
  const body = (await request.json()) as {
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

  // Verify the showroom exists before delegating to the service.
  const exists = await showtimeService.verifyShowroomExists(showroomId);
  if (!exists) {
    return NextResponse.json({ error: "Showroom not found." }, { status: 404 });
  }

  const result = await showtimeService.addShowtime({
    movieId,
    showroomId,
    startTime,
    duration,
  });
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 409 });
  }

  return NextResponse.json(
    { success: true, show_id: result.show_id },
    { status: 201 },
  );
});
