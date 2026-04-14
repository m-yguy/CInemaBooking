import { auth } from "@/auth";
import * as favoriteService from "@/lib/services/favoriteService";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json([], { status: 200 });

  const movieIds = await favoriteService.listFavoriteIds(session.user.id);
  return NextResponse.json(movieIds);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { movieId, favorited } = await req.json();
  if (!movieId)
    return NextResponse.json({ error: "Missing movieId" }, { status: 400 });

  await favoriteService.toggleFavorite(session.user.id, movieId, favorited);

  return NextResponse.json({ ok: true });
}
