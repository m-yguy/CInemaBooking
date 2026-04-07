import { auth } from "@/auth";
import {
  getFavoriteMovieIds,
  addFavorite,
  removeFavorite,
} from "@/lib/repositories/favoriteRepository";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json([], { status: 200 });

  const movieIds = await getFavoriteMovieIds(session.user.id);
  return NextResponse.json(movieIds);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { movieId, favorited } = await req.json();
  if (!movieId)
    return NextResponse.json({ error: "Missing movieId" }, { status: 400 });

  if (favorited) {
    await addFavorite(session.user.id, movieId);
  } else {
    await removeFavorite(session.user.id, movieId);
  }

  return NextResponse.json({ ok: true });
}
