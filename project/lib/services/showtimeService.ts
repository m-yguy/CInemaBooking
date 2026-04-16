import {
  listShowtimes,
  listShowtimesAdmin,
  checkShowtimeConflicts,
  getShowtimeById,
  insertShowtime,
  insertShowSeats,
  updateShowtime,
  rebuildShowSeats,
  deleteShowtime,
  showroomExists,
  type ShowtimeSummary,
  type ShowtimeAdminRow,
} from "@/lib/repositories/showtimeRepository";
import { ShowtimeFactory } from "@/lib/factories/showtimeFactory";

export type { ShowtimeSummary, ShowtimeAdminRow };

export async function getShowtimes(): Promise<ShowtimeSummary[]> {
  return listShowtimes();
}

export async function getShowtimesAdmin(): Promise<ShowtimeAdminRow[]> {
  return listShowtimesAdmin();
}

export async function verifyShowroomExists(
  showroomId: number,
): Promise<boolean> {
  return showroomExists(showroomId);
}

export interface AddShowtimeInput {
  movieId: number;
  showroomId: number;
  startTime: Date;
  duration: number;
}

export async function addShowtime(
  data: AddShowtimeInput,
): Promise<{ ok: true; show_id: string } | { ok: false; error: string }> {
  const showtimeInput = ShowtimeFactory.createShowtimeInput(
    "",
    data.movieId,
    data.startTime,
    data.duration,
  );

  const hasConflict = await checkShowtimeConflicts(
    data.showroomId,
    showtimeInput.startTime,
    showtimeInput.endTime,
  );
  if (hasConflict) {
    return {
      ok: false,
      error:
        "Scheduling conflict: this showroom is already booked during that time.",
    };
  }

  const show_id = await insertShowtime({
    showroomId: data.showroomId,
    movieId: showtimeInput.movieId,
    startTime: showtimeInput.startTime,
    duration: showtimeInput.duration,
  });
  await insertShowSeats(show_id, data.showroomId);
  return { ok: true, show_id };
}

export interface EditShowtimeInput {
  movieId: number;
  showroomId: number;
  startTime: Date;
  duration: number;
}

export async function editShowtime(
  showId: string,
  data: EditShowtimeInput,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const existing = await getShowtimeById(showId);
  if (!existing) return { ok: false, error: "Showtime not found." };

  const oldShowroomId = existing.showroom_id as number;
  const showtimeInput = ShowtimeFactory.createShowtimeInput(
    showId,
    data.movieId,
    data.startTime,
    data.duration,
  );

  const hasConflict = await checkShowtimeConflicts(
    data.showroomId,
    showtimeInput.startTime,
    showtimeInput.endTime,
    showId,
  );
  if (hasConflict) {
    return {
      ok: false,
      error:
        "Scheduling conflict: this showroom is already booked during that time.",
    };
  }

  await updateShowtime(showId, {
    movieId: showtimeInput.movieId,
    showroomId: data.showroomId,
    startTime: showtimeInput.startTime,
    duration: showtimeInput.duration,
  });
  if (oldShowroomId !== data.showroomId) {
    await rebuildShowSeats(showId, data.showroomId);
  }
  return { ok: true };
}

export async function removeShowtime(
  showId: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const existing = await getShowtimeById(showId);
  if (!existing) return { ok: false, error: "Showtime not found." };
  await deleteShowtime(showId);
  return { ok: true };
}
