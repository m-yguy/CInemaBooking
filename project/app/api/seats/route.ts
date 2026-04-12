import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const sql = neon(process.env.DATABASE_URL!);

    const { searchParams } = new URL(request.url);
    const showId = searchParams.get("showId");

    if (!showId) {
        return NextResponse.json({ error: "showId is required" }, { status: 400 });
    }

    const rows = await sql`
    SELECT
      show_seats.show_seat_id,
      show_seats.is_available,
      seats.seat_number
    FROM show_seats
    JOIN seats ON show_seats.seat_id = seats.seat_id
    WHERE show_seats.show_id = ${showId}
    ORDER BY seats.seat_number
  `;

    return NextResponse.json(rows);
}