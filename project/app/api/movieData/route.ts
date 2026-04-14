import { NextResponse } from "next/server";
import * as movieService from "@/lib/services/movieService";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") ?? "").trim();

  if (!q) {
    const rows = await movieService.listMovies();
    return NextResponse.json(rows);
  }

  const rows = await movieService.searchMoviesByQuery(q);
  return NextResponse.json(rows);
}
