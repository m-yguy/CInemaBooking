import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: { id: string } }) {
    const sql = neon(process.env.DATABASE_URL!);
    const { id } = await params;

    const rows = await sql`SELECT * FROM movieData WHERE title = ${id}`;
    if (rows.length === 0) {
        return NextResponse.json({ error: "Movie not found" }, { status: 404 });
    }
    return NextResponse.json(rows[0]);
}
