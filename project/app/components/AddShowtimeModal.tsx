"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { addShowtimeAction } from "@/app/actions/showtimeActions";

interface Movie {
  movie_id: number;
  title: string;
  runtime: number;
}

interface Showroom {
  showroom_id: number;
  showroom_num: number;
  number_seats: number;
}

export default function AddShowtimeModal({ onClose }: { onClose: () => void }) {
  const router = useRouter();

  const [movies, setMovies] = useState<Movie[]>([]);
  const [showrooms, setShowrooms] = useState<Showroom[]>([]);
  const [loading, setLoading] = useState(true);

  const [movieId, setMovieId] = useState("");
  const [showroomId, setShowroomId] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    async function load() {
      try {
        const [moviesRes, showroomsRes] = await Promise.all([
          fetch("/api/movieData"),
          fetch("/api/showrooms"),
        ]);
        const moviesData = (await moviesRes.json()) as Movie[];
        const showroomsData = (await showroomsRes.json()) as Showroom[];
        setMovies(moviesData);
        setShowrooms(showroomsData);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  function handleMovieChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const id = e.target.value;
    setMovieId(id);
    const selected = movies.find((m) => String(m.movie_id) === id);
    if (selected) setDuration(String(selected.runtime));
  }

  function validate(): string | null {
    if (!movieId) return "Please select a movie.";
    if (!showroomId) return "Please select a showroom.";
    if (!date) return "Please select a date.";
    if (!time) return "Please select a time.";
    const d = Number(duration);
    if (!duration || isNaN(d) || d <= 0 || !Number.isInteger(d))
      return "Duration must be a positive whole number (minutes).";
    return null;
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    const datetime = `${date}T${time}:00`;

    startTransition(async () => {
      const result = await addShowtimeAction({
        movieId: Number(movieId),
        showroomId: Number(showroomId),
        datetime,
        duration: Number(duration),
      });

      if ("error" in result) {
        setError(result.error);
        return;
      }

      router.refresh();
      onClose();
    });
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-neutral-900 rounded-2xl p-8 w-full max-w-md shadow-xl">
        <h2 className="text-2xl font-bold mb-6 text-white">Add Showtime</h2>

        {loading ? (
          <p className="text-neutral-400 text-center py-8">Loading…</p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Movie */}
            <div className="flex flex-col gap-1">
              <label className="text-sm text-neutral-300 font-medium">
                Movie
              </label>
              <select
                value={movieId}
                onChange={handleMovieChange}
                required
                className="bg-neutral-800 text-white rounded-lg px-3 py-2 border border-neutral-700 focus:outline-none focus:border-neutral-500"
              >
                <option value="">— Select a movie —</option>
                {movies.map((m) => (
                  <option key={m.movie_id} value={m.movie_id}>
                    {m.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Showroom */}
            <div className="flex flex-col gap-1">
              <label className="text-sm text-neutral-300 font-medium">
                Showroom
              </label>
              <select
                value={showroomId}
                onChange={(e) => setShowroomId(e.target.value)}
                required
                className="bg-neutral-800 text-white rounded-lg px-3 py-2 border border-neutral-700 focus:outline-none focus:border-neutral-500"
              >
                <option value="">— Select a showroom —</option>
                {showrooms.map((r) => (
                  <option key={r.showroom_id} value={r.showroom_id}>
                    Showroom {r.showroom_num} ({r.number_seats} seats)
                  </option>
                ))}
              </select>
            </div>

            {/* Date */}
            <div className="flex flex-col gap-1">
              <label className="text-sm text-neutral-300 font-medium">
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="bg-neutral-800 text-white rounded-lg px-3 py-2 border border-neutral-700 focus:outline-none focus:border-neutral-500"
              />
            </div>

            {/* Time */}
            <div className="flex flex-col gap-1">
              <label className="text-sm text-neutral-300 font-medium">
                Start Time
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
                className="bg-neutral-800 text-white rounded-lg px-3 py-2 border border-neutral-700 focus:outline-none focus:border-neutral-500"
              />
            </div>

            {/* Duration */}
            <div className="flex flex-col gap-1">
              <label className="text-sm text-neutral-300 font-medium">
                Duration (minutes)
              </label>
              <input
                type="number"
                min={1}
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="Auto-filled from movie runtime"
                className="bg-neutral-800 text-white rounded-lg px-3 py-2 border border-neutral-700 focus:outline-none focus:border-neutral-500"
              />
            </div>

            {error && (
              <p className="text-red-400 text-sm bg-red-950/40 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <div className="flex gap-3 mt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-neutral-700 hover:bg-neutral-600 text-white rounded-lg py-2 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="flex-1 bg-white hover:bg-neutral-200 text-black rounded-lg py-2 font-medium transition-colors disabled:opacity-50"
              >
                {isPending ? "Saving…" : "Add Showtime"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
