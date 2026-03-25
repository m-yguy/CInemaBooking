import { auth } from "@/auth";
import { sql } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json([], { status: 200 });

  const rows = await sql`
        SELECT movie_id FROM customer_favorite_movies
        WHERE customer_id = ${session.user.id}
    `;
  return NextResponse.json(rows.map((r) => r.movie_id));
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { movieId, favorited } = await req.json();
  if (!movieId)
    return NextResponse.json({ error: "Missing movieId" }, { status: 400 });

  const customerId = session.user.id;

  if (favorited) {
    await sql`
            INSERT INTO customer_favorite_movies (customer_id, movie_id)
            VALUES (${customerId}, ${movieId})
            ON CONFLICT DO NOTHING
        `;
  } else {
    await sql`
            DELETE FROM customer_favorite_movies
            WHERE customer_id = ${customerId} AND movie_id = ${movieId}
        `;
  }

  return NextResponse.json({ ok: true });
}
