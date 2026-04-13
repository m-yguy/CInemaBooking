import { sql } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const rows = await sql`
    SELECT showroom_id, showroom_num, number_seats
    FROM showrooms
    ORDER BY showroom_num ASC
  `;
  return NextResponse.json(rows);
}
