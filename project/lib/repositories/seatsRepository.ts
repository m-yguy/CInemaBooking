import { sql } from "@/lib/dbSingleton";

export interface ShowSeat {
  show_seat_id: number;
  is_available: boolean;
  seat_number: string;
}

export async function getSeatsByShowId(showId: string): Promise<ShowSeat[]> {
  const rows = await sql`
    SELECT
      show_seats.show_seat_id,
      show_seats.is_available,
      seats.seat_number
    FROM show_seats
    JOIN seats ON show_seats.seat_id = seats.seat_id
    WHERE show_seats.show_id = ${showId}
    ORDER BY seats.seat_number
  `;
  return rows as ShowSeat[];
}
