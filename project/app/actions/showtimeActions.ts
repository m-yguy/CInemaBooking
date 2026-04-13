"use server";

import { auth } from "@/auth";
import {
  checkShowtimeConflicts,
  getShowtimeById,
  insertShowtime,
  insertShowSeats,
  updateShowtime,
  rebuildShowSeats,
  deleteShowtime,
} from "@/lib/repositories/showtimeRepository";

export async function addShowtimeAction(data: {
  movieId: number;
  showroomId: number;
  datetime: string;
  duration: number;
}): Promise<{ error: string } | { success: true; show_id: string }> {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return { error: "Forbidden" };
  }

  if (!data.movieId || !data.showroomId || !data.datetime || !data.duration) {
    return { error: "All fields are required." };
  }

  if (!Number.isInteger(data.duration) || data.duration <= 0) {
    return { error: "Duration must be a positive whole number." };
  }

  const startTime = new Date(data.datetime);
  if (isNaN(startTime.getTime())) {
    return { error: "Invalid date/time." };
  }

  const endTime = new Date(startTime.getTime() + data.duration * 60_000);

  try {
    const hasConflict = await checkShowtimeConflicts(
      data.showroomId,
      startTime,
      endTime,
    );
    if (hasConflict) {
      return {
        error:
          "Scheduling conflict: this showroom is already booked during that time.",
      };
    }

    const show_id = await insertShowtime({
      showroomId: data.showroomId,
      movieId: data.movieId,
      startTime,
      duration: data.duration,
    });

    await insertShowSeats(show_id, data.showroomId);

    return { success: true, show_id };
  } catch {
    return { error: "Failed to add showtime. Please try again." };
  }
}

export async function editShowtimeAction(
  showId: string,
  data: {
    movieId: number;
    showroomId: number;
    datetime: string;
    duration: number;
  },
): Promise<{ error: string } | { success: true }> {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return { error: "Forbidden" };
  }

  if (
    !showId ||
    !data.movieId ||
    !data.showroomId ||
    !data.datetime ||
    !data.duration
  ) {
    return { error: "All fields are required." };
  }

  if (!Number.isInteger(data.duration) || data.duration <= 0) {
    return { error: "Duration must be a positive whole number." };
  }

  const startTime = new Date(data.datetime);
  if (isNaN(startTime.getTime())) {
    return { error: "Invalid date/time." };
  }

  const endTime = new Date(startTime.getTime() + data.duration * 60_000);

  try {
    const existing = await getShowtimeById(showId);
    if (!existing) {
      return { error: "Showtime not found." };
    }

    const oldShowroomId = existing.showroom_id as number;

    const hasConflict = await checkShowtimeConflicts(
      data.showroomId,
      startTime,
      endTime,
      showId,
    );
    if (hasConflict) {
      return {
        error:
          "Scheduling conflict: this showroom is already booked during that time.",
      };
    }

    await updateShowtime(showId, {
      movieId: data.movieId,
      showroomId: data.showroomId,
      startTime,
      duration: data.duration,
    });

    if (oldShowroomId !== data.showroomId) {
      await rebuildShowSeats(showId, data.showroomId);
    }

    return { success: true };
  } catch {
    return { error: "Failed to update showtime. Please try again." };
  }
}

export async function deleteShowtimeAction(
  showId: string,
): Promise<{ error: string } | { success: true }> {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return { error: "Forbidden" };
  }

  if (!showId) return { error: "Showtime ID is required." };

  try {
    const existing = await getShowtimeById(showId);
    if (!existing) return { error: "Showtime not found." };

    await deleteShowtime(showId);

    return { success: true };
  } catch {
    return { error: "Failed to delete showtime. Please try again." };
  }
}
