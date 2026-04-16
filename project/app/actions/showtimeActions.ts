"use server";

import * as showtimeService from "@/lib/services/showtimeService";
import { withAuthAdmin } from "@/lib/middleware/withAuthDecorator";

export const addShowtimeAction = withAuthAdmin(
  async (
    _session,
    data: {
      movieId: number;
      showroomId: number;
      datetime: string;
      duration: number;
    },
  ): Promise<{ error: string } | { success: true; show_id: string }> => {
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

    const result = await showtimeService.addShowtime({
      movieId: data.movieId,
      showroomId: data.showroomId,
      startTime,
      duration: data.duration,
    });
    if (!result.ok) return { error: result.error };
    return { success: true, show_id: result.show_id };
  },
);

export const editShowtimeAction = withAuthAdmin(
  async (
    _session,
    showId: string,
    data: {
      movieId: number;
      showroomId: number;
      datetime: string;
      duration: number;
    },
  ): Promise<{ error: string } | { success: true }> => {
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

    const result = await showtimeService.editShowtime(showId, {
      movieId: data.movieId,
      showroomId: data.showroomId,
      startTime,
      duration: data.duration,
    });
    if (!result.ok) return { error: result.error };
    return { success: true };
  },
);

export const deleteShowtimeAction = withAuthAdmin(
  async (
    _session,
    showId: string,
  ): Promise<{ error: string } | { success: true }> => {
    if (!showId) return { error: "Showtime ID is required." };

    const result = await showtimeService.removeShowtime(showId);
    if (!result.ok) return { error: result.error };
    return { success: true };
  },
);
