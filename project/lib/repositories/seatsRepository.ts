import { sql } from "@/lib/db";

export async function getSeatsByShowId(showId: string) {
  return sql`
    SELECT
      show_seats.show_seat_id,
      show_seats.is_available,
      seats.seat_number
    FROM show_seats
    JOIN seats ON show_seats.seat_id = seats.seat_id
    WHERE show_seats.show_id = ${showId}
    ORDER BY seats.seat_number
  `;
}
