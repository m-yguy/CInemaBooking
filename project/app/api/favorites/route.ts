import { auth } from "@/auth";
import * as favoriteService from "@/lib/services/favoriteService";
import { NextResponse } from "next/server";
import { withAuthRoute } from "@/lib/middleware/withAuth";

// GET is intentionally unauthenticated — returns empty array for guests.
export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json([], { status: 200 });

  const movieIds = await favoriteService.listFavoriteIds(session.user.id);
  return NextResponse.json(movieIds);
}

export const POST = withAuthRoute(async (session, request) => {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { movieId, favorited } = body as { movieId?: unknown; favorited?: unknown };
  if (!movieId)
    return NextResponse.json({ error: "Missing movieId" }, { status: 400 });

  await favoriteService.toggleFavorite(session.id, Number(movieId), Boolean(favorited));
  return NextResponse.json({ ok: true });
});
