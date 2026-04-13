import { NextResponse } from "next/server";
import { getSeatsByShowId } from "@/lib/repositories/seatsRepository";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const showId = searchParams.get("showId");

  if (!showId) {
    return NextResponse.json({ error: "showId is required" }, { status: 400 });
  }

  const rows = await getSeatsByShowId(showId);
  return NextResponse.json(rows);
}
