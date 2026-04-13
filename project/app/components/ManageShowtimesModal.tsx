"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faArrowLeft,
  faPencil,
  faTrash,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";
import {
  addShowtimeAction,
  editShowtimeAction,
  deleteShowtimeAction,
} from "@/app/actions/showtimeActions";

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

interface ShowtimeRow {
  show_id: string;
  movie_id: number;
  movie_name: string;
  showroom_id: number;
  showroom_num: number;
  time: string;
  duration: number;
}

type View = "showrooms" | "list" | "add" | "edit";

function toDatetimeLocal(isoString: string): { date: string; time: string } {
  const d = new Date(isoString);
  const pad = (n: number) => String(n).padStart(2, "0");
  const date = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const time = `${pad(d.getHours())}:${pad(d.getMinutes())}`;
  return { date, time };
}

export default function ManageShowtimesModal({
  onClose,
}: {
  onClose: () => void;
}) {
  const router = useRouter();

  const [view, setView] = useState<View>("showrooms");
  const [editTarget, setEditTarget] = useState<ShowtimeRow | null>(null);
  const [selectedShowroom, setSelectedShowroom] = useState<Showroom | null>(
    null,
  );

  // Shared data
  const [movies, setMovies] = useState<Movie[]>([]);
  const [showrooms, setShowrooms] = useState<Showroom[]>([]);
  const [showtimes, setShowtimes] = useState<ShowtimeRow[]>([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [movieId, setMovieId] = useState("");
  const [showroomId, setShowroomId] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const [refreshKey, setRefreshKey] = useState(0);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [isDeleting, startDeleteTransition] = useTransition();
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const [moviesRes, showroomsRes, showtimesRes] = await Promise.all([
        fetch("/api/movieData"),
        fetch("/api/showrooms"),
        fetch("/api/showtimes?admin=true"),
      ]);
      const [moviesData, showroomsData, showtimesData] = await Promise.all([
        moviesRes.json() as Promise<Movie[]>,
        showroomsRes.json() as Promise<Showroom[]>,
        showtimesRes.json() as Promise<ShowtimeRow[]>,
      ]);
      setMovies(moviesData);
      setShowrooms(showroomsData);
      setShowtimes(showtimesData);
      setLoading(false);
    }
    load();
  }, [refreshKey]);

  function resetForm() {
    setMovieId("");
    setShowroomId("");
    setDate("");
    setTime("");
    setDuration("");
    setError(null);
  }

  function handleDelete(showId: string) {
    setDeleteError(null);
    startDeleteTransition(async () => {
      const result = await deleteShowtimeAction(showId);
      if ("error" in result) {
        setDeleteError(result.error);
        return;
      }
      setConfirmDeleteId(null);
      router.refresh();
      setRefreshKey((k) => k + 1);
    });
  }

  function openAdd(presetShowroomId?: string) {
    resetForm();
    if (presetShowroomId) setShowroomId(presetShowroomId);
    setEditTarget(null);
    setView("add");
  }

  function openEdit(row: ShowtimeRow) {
    const { date: d, time: t } = toDatetimeLocal(row.time);
    setMovieId(String(row.movie_id));
    setShowroomId(String(row.showroom_id));
    setDate(d);
    setTime(t);
    setDuration(String(row.duration));
    setError(null);
    setEditTarget(row);
    setView("edit");
  }

  function handleMovieChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const id = e.target.value;
    setMovieId(id);
    // Only auto-fill duration when adding (not editing)
    if (view === "add") {
      const selected = movies.find((m) => String(m.movie_id) === id);
      if (selected) setDuration(String(selected.runtime));
    }
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
      const result =
        view === "edit" && editTarget
          ? await editShowtimeAction(editTarget.show_id, {
              movieId: Number(movieId),
              showroomId: Number(showroomId),
              datetime,
              duration: Number(duration),
            })
          : await addShowtimeAction({
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
      setRefreshKey((k) => k + 1);
      setView("list");
    });
  }

  const title =
    view === "showrooms"
      ? "Manage Showtimes"
      : view === "list"
        ? `Showroom ${selectedShowroom?.showroom_num ?? ""}`
        : view === "add"
          ? "Add Showtime"
          : "Edit Showtime";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-neutral-900 rounded-2xl p-8 w-full max-w-2xl shadow-xl flex flex-col gap-5 max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {view !== "showrooms" && (
              <button
                type="button"
                onClick={() => {
                  if (view === "list") {
                    setView("showrooms");
                    setError(null);
                  } else {
                    setView("list");
                    setError(null);
                  }
                }}
                className="text-neutral-400 hover:text-white transition-colors"
              >
                <FontAwesomeIcon icon={faArrowLeft} />
              </button>
            )}
            <h2 className="text-2xl font-bold text-white">{title}</h2>
          </div>
          {view === "list" && (
            <button
              type="button"
              onClick={() =>
                openAdd(
                  selectedShowroom
                    ? String(selectedShowroom.showroom_id)
                    : undefined,
                )
              }
              className="flex items-center gap-2 bg-white text-black text-sm font-medium px-4 py-2 rounded-lg hover:bg-neutral-200 transition-colors"
            >
              <FontAwesomeIcon icon={faPlus} />
              Add New
            </button>
          )}
        </div>

        {/* Showrooms view */}
        {view === "showrooms" &&
          (loading ? (
            <p className="text-neutral-400 text-center py-10">Loading…</p>
          ) : showrooms.length === 0 ? (
            <p className="text-neutral-400 text-center py-10">
              No showrooms found.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {showrooms.map((room) => {
                const count = showtimes.filter(
                  (s) => s.showroom_id === room.showroom_id,
                ).length;
                return (
                  <button
                    key={room.showroom_id}
                    type="button"
                    onClick={() => {
                      setSelectedShowroom(room);
                      setView("list");
                    }}
                    className="bg-neutral-800 hover:bg-neutral-700 transition-colors rounded-xl px-5 py-4 flex flex-col gap-1 text-left"
                  >
                    <span className="text-white font-semibold text-lg">
                      Showroom {room.showroom_num}
                    </span>
                    <span className="text-neutral-400 text-sm">
                      {room.number_seats} seats
                    </span>
                    <span className="text-neutral-500 text-sm">
                      {count} showtime{count !== 1 ? "s" : ""}
                    </span>
                  </button>
                );
              })}
            </div>
          ))}

        {/* List view */}
        {view === "list" &&
          (loading ? (
            <p className="text-neutral-400 text-center py-10">Loading…</p>
          ) : showtimes.filter(
              (s) => s.showroom_id === selectedShowroom?.showroom_id,
            ).length === 0 ? (
            <p className="text-neutral-400 text-center py-10">
              No showtimes scheduled for this showroom.
            </p>
          ) : (
            <>
              {deleteError && (
                <p className="text-red-400 text-sm bg-red-950/40 rounded-lg px-3 py-2">
                  {deleteError}
                </p>
              )}
              <div className="overflow-y-auto flex flex-col gap-2 pr-1">
                {showtimes
                  .filter(
                    (s) => s.showroom_id === selectedShowroom?.showroom_id,
                  )
                  .map((row) => {
                    const dt = new Date(row.time);
                    const dateStr = dt.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    });
                    const timeStr = dt.toLocaleTimeString("en-US", {
                      hour: "numeric",
                      minute: "2-digit",
                    });
                    return (
                      <div
                        key={row.show_id}
                        className="flex items-center justify-between bg-neutral-800 rounded-xl px-4 py-3 gap-4"
                      >
                        <div className="flex flex-col gap-0.5 min-w-0">
                          <span className="text-white font-medium truncate">
                            {row.movie_name}
                          </span>
                          <span className="text-neutral-400 text-sm">
                            {dateStr} · {timeStr} · Showroom {row.showroom_num}{" "}
                            · {row.duration} min
                          </span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {confirmDeleteId === row.show_id ? (
                            <>
                              <span className="text-neutral-300 text-sm">
                                Delete?
                              </span>
                              <button
                                type="button"
                                disabled={isDeleting}
                                onClick={() => handleDelete(row.show_id)}
                                className="text-sm text-white bg-red-600 hover:bg-red-500 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
                              >
                                {isDeleting ? "…" : "Yes"}
                              </button>
                              <button
                                type="button"
                                onClick={() => setConfirmDeleteId(null)}
                                className="text-sm text-neutral-300 hover:text-white bg-neutral-700 hover:bg-neutral-600 px-3 py-1.5 rounded-lg transition-colors"
                              >
                                Cancel
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                type="button"
                                onClick={() => openEdit(row)}
                                className="flex items-center gap-2 text-sm text-neutral-300 hover:text-white bg-neutral-700 hover:bg-neutral-600 px-3 py-1.5 rounded-lg transition-colors"
                              >
                                <FontAwesomeIcon
                                  icon={faPencil}
                                  className="text-xs"
                                />
                                Edit
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setConfirmDeleteId(row.show_id);
                                  setDeleteError(null);
                                }}
                                className="flex items-center gap-2 text-sm text-red-400 hover:text-white bg-neutral-700 hover:bg-red-600 px-3 py-1.5 rounded-lg transition-colors"
                              >
                                <FontAwesomeIcon
                                  icon={faTrash}
                                  className="text-xs"
                                />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </>
          ))}

        {/* Add / Edit form */}
        {(view === "add" || view === "edit") &&
          (loading ? (
            <p className="text-neutral-400 text-center py-10">Loading…</p>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm text-neutral-300 font-medium">
                  Movie
                </label>
                <div className="relative">
                  <select
                    value={movieId}
                    onChange={handleMovieChange}
                    required
                    className="w-full appearance-none bg-neutral-800 text-white rounded-lg px-3 py-2 pr-8 border border-neutral-700 focus:outline-none focus:border-neutral-500"
                  >
                    <option value="">— Select a movie —</option>
                    {movies.map((m) => (
                      <option key={m.movie_id} value={m.movie_id}>
                        {m.title}
                      </option>
                    ))}
                  </select>
                  <FontAwesomeIcon
                    icon={faChevronDown}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 text-xs"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm text-neutral-300 font-medium">
                  Showroom
                </label>
                <div className="relative">
                  <select
                    value={showroomId}
                    onChange={(e) => setShowroomId(e.target.value)}
                    required
                    className="w-full appearance-none bg-neutral-800 text-white rounded-lg px-3 py-2 pr-8 border border-neutral-700 focus:outline-none focus:border-neutral-500"
                  >
                    <option value="">— Select a showroom —</option>
                    {showrooms.map((r) => (
                      <option key={r.showroom_id} value={r.showroom_id}>
                        Showroom {r.showroom_num} ({r.number_seats} seats)
                      </option>
                    ))}
                  </select>
                  <FontAwesomeIcon
                    icon={faChevronDown}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
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
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm text-neutral-300 font-medium">
                  Duration (minutes)
                </label>
                <input
                  type="number"
                  min={1}
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder={
                    view === "add" ? "Auto-filled from movie runtime" : ""
                  }
                  className="bg-neutral-800 text-white rounded-lg px-3 py-2 border border-neutral-700 focus:outline-none focus:border-neutral-500"
                />
              </div>

              {error && (
                <p className="text-red-400 text-sm bg-red-950/40 rounded-lg px-3 py-2">
                  {error}
                </p>
              )}

              <div className="flex gap-3 mt-1">
                <button
                  type="button"
                  onClick={() => {
                    setView("list");
                    setError(null);
                  }}
                  className="flex-1 bg-neutral-700 hover:bg-neutral-600 text-white rounded-lg py-2 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="flex-1 bg-white hover:bg-neutral-200 text-black rounded-lg py-2 font-medium transition-colors disabled:opacity-50"
                >
                  {isPending
                    ? "Saving…"
                    : view === "edit"
                      ? "Save Changes"
                      : "Add Showtime"}
                </button>
              </div>
            </form>
          ))}
      </div>
    </div>
  );
}
