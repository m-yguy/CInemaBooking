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

export type { ShowtimeSummary, ShowtimeAdminRow };

export async function getShowtimes(): Promise<ShowtimeSummary[]> {
  return listShowtimes();
}

export async function getShowtimesAdmin(): Promise<ShowtimeAdminRow[]> {
  return listShowtimesAdmin();
}

export async function verifyShowroomExists(showroomId: number): Promise<boolean> {
  return showroomExists(showroomId);
}

export interface AddShowtimeInput {
  movieId: number;
  showroomId: number;
  startTime: Date;
  duration: number;
}

/** Facade: conflict-check, insert showtime, provision seats. */
export async function addShowtime(
  data: AddShowtimeInput,
): Promise<{ ok: true; show_id: string } | { ok: false; error: string }> {
  const endTime = new Date(data.startTime.getTime() + data.duration * 60_000);
  const hasConflict = await checkShowtimeConflicts(
    data.showroomId,
    data.startTime,
    endTime,
  );
  if (hasConflict) {
    return {
      ok: false,
      error: "Scheduling conflict: this showroom is already booked during that time.",
    };
  }

  const show_id = await insertShowtime({
    showroomId: data.showroomId,
    movieId: data.movieId,
    startTime: data.startTime,
    duration: data.duration,
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

/** Facade: fetch existing, conflict-check, update, optionally rebuild seats. */
export async function editShowtime(
  showId: string,
  data: EditShowtimeInput,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const existing = await getShowtimeById(showId);
  if (!existing) return { ok: false, error: "Showtime not found." };

  const oldShowroomId = existing.showroom_id as number;
  const endTime = new Date(data.startTime.getTime() + data.duration * 60_000);
  const hasConflict = await checkShowtimeConflicts(
    data.showroomId,
    data.startTime,
    endTime,
    showId,
  );
  if (hasConflict) {
    return {
      ok: false,
      error: "Scheduling conflict: this showroom is already booked during that time.",
    };
  }

  await updateShowtime(showId, {
    movieId: data.movieId,
    showroomId: data.showroomId,
    startTime: data.startTime,
    duration: data.duration,
  });
  if (oldShowroomId !== data.showroomId) {
    await rebuildShowSeats(showId, data.showroomId);
  }
  return { ok: true };
}

/** Facade: verify showtime exists, then delete it with all dependent rows. */
export async function removeShowtime(
  showId: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const existing = await getShowtimeById(showId);
  if (!existing) return { ok: false, error: "Showtime not found." };
  await deleteShowtime(showId);
  return { ok: true };
}
