import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";


export async function GET() {
    const sql = neon(process.env.DATABASE_URL!);

    const rows = await sql
        `
    SELECT
        showtimes.show_id,
        showtimes.time,
        movies.movie_name
    FROM showtimes
    JOIN movies ON showtimes.movie_id = movies.movie_id
    ORDER BY movies.movie_name, showtimes.time
    `
    const grouped: Record<string, { show_id: string; time: string }[]> = {};

    for (const row of rows) {
        const label = new Date(row.time).toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
        });

        if (!grouped[row.movie_name]) grouped[row.movie_name] = [];
        grouped[row.movie_name].push({ show_id: row.show_id, time: label });
    }

    return NextResponse.json(grouped);
}