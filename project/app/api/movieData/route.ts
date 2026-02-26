import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") ?? "").trim();

  const sql = neon(process.env.DATABASE_URL!);

  // If no query, return all (homepage behavior)
  if (!q) {
    const rows = await sql`SELECT * FROM movieData`;
    return NextResponse.json(rows);
  }

  // If query, return search results (Navbar behavior)
  const rows = await sql`
    SELECT title, poster_path, release_status
    FROM movieData
    WHERE title ILIKE ${"%" + q + "%"}
    ORDER BY
      CASE WHEN title ILIKE ${q + "%"} THEN 0 ELSE 1 END,
      title ASC
    LIMIT 8
  `;

  return NextResponse.json(rows);
}