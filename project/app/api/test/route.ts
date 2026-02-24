import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

export async function GET() {
  const sql = neon(process.env.DATABASE_URL!);
  const rows = await sql`SELECT * FROM movieData`;
  return NextResponse.json(rows);
}
