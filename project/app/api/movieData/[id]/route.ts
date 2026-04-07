import { NextResponse } from "next/server";
import { getMovieByTitle } from "@/lib/repositories/movieRepository";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const movie = await getMovieByTitle(decodeURIComponent(id));

  if (!movie) {
    return NextResponse.json({ error: "Movie not found" }, { status: 404 });
  }

  return NextResponse.json(movie);
}
