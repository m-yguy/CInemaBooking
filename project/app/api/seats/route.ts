import { NextResponse } from "next/server";
import * as seatService from "@/lib/services/seatService";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const showId = searchParams.get("showId");

  if (!showId) {
    return NextResponse.json({ error: "showId is required" }, { status: 400 });
  }

  const rows = await seatService.getSeatsForShow(showId);
  return NextResponse.json(rows);
}
