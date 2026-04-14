import {
  getSeatsByShowId,
  type ShowSeat,
} from "@/lib/repositories/seatsRepository";

export type { ShowSeat };

export async function getSeatsForShow(showId: string): Promise<ShowSeat[]> {
  return getSeatsByShowId(showId);
}
