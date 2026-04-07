import { NextResponse } from "next/server";
import { getAllMovies, searchMovies } from "@/lib/repositories/movieRepository";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") ?? "").trim();

  if (!q) {
    const rows = await getAllMovies();
    return NextResponse.json(rows);
  }

  const rows = await searchMovies(q);
  return NextResponse.json(rows);
}
