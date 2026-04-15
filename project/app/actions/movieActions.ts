"use server";

import * as movieService from "@/lib/services/movieService";
import { withAuthAdmin } from "@/lib/middleware/withAuthDecorator";

const MPAA_VALUES = ["G", "PG", "PG-13", "R", "NC-17"] as const;
const STATUS_VALUES = ["NOW_PLAYING", "COMING_SOON"] as const;

export const addMovieAction = withAuthAdmin(
  async (
    _session,
    formData: {
      title: string;
      genres: string;
      synopsis: string;
      trailer: string;
      trailerImage: string;
      mpaaRating: string;
      releaseStatus: string;
      runtime: number;
      cast: string;
      directors: string;
      producers: string;
    },
  ): Promise<{ error: string } | { success: true; movieId: number }> => {
    if (!formData.title.trim()) return { error: "Title is required." };
    if (formData.title.trim().length > 200)
      return { error: "Title must be 200 characters or fewer." };

    if (
      formData.mpaaRating !== "" &&
      !(MPAA_VALUES as readonly string[]).includes(formData.mpaaRating)
    ) {
      return { error: "Invalid MPAA rating." };
    }

    if (
      !(STATUS_VALUES as readonly string[]).includes(formData.releaseStatus)
    ) {
      return { error: "Invalid release status." };
    }

    if (!Number.isInteger(formData.runtime) || formData.runtime < 0) {
      return {
        error: "Runtime must be a non-negative whole number (minutes).",
      };
    }

    const parsePeople = (val: string): string[] =>
      val
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

    const movieId = await movieService.addMovie({
      title: formData.title.trim(),
      genres: parsePeople(formData.genres),
      synopsis: formData.synopsis.trim(),
      trailer: formData.trailer.trim(),
      trailerImage: formData.trailerImage.trim(),
      mpaaRating: formData.mpaaRating,
      releaseStatus: formData.releaseStatus,
      runtime: formData.runtime,
      cast: parsePeople(formData.cast),
      directors: parsePeople(formData.directors),
      producers: parsePeople(formData.producers),
    });
    return { success: true, movieId };
  },
);
