import {
  listShowtimes,
  type ShowtimeSummary,
} from "@/lib/repositories/showtimeRepository";

export type { ShowtimeSummary };

export async function getShowtimes(): Promise<ShowtimeSummary[]> {
  return listShowtimes();
}
