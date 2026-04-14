import { NextResponse } from "next/server";
import { getMovieDetails } from "@/lib/services/movieService";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const movie = await getMovieDetails(decodeURIComponent(id));

  if (!movie) {
    return NextResponse.json({ error: "Movie not found" }, { status: 404 });
  }

  return NextResponse.json(movie);
}
