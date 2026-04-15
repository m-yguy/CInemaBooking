import { sql } from "@/lib/dbSingleton";

export interface ShowroomRow {
  showroom_id: number;
  showroom_num: number;
  number_seats: number;
}

export async function getShowrooms(): Promise<ShowroomRow[]> {
  const rows = await sql`
    SELECT showroom_id, showroom_num, number_seats
    FROM showrooms
    ORDER BY showroom_num ASC
  `;
  return rows as ShowroomRow[];
}
