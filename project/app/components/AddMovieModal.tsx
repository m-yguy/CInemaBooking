"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { addMovieAction } from "@/app/actions/movieActions";

const MPAA_RATINGS = ["", "G", "PG", "PG-13", "R", "NC-17"];
const RELEASE_STATUSES = [
  { value: "COMING_SOON", label: "Coming Soon" },
  { value: "NOW_PLAYING", label: "Now Playing" },
];

export default function AddMovieModal({ onClose }: { onClose: () => void }) {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [genres, setGenres] = useState("");
  const [synopsis, setSynopsis] = useState("");
  const [trailer, setTrailer] = useState("");
  const [posterFile, setPosterFile] = useState<File | null>(null);
  const posterInputRef = useRef<HTMLInputElement>(null);
  const [mpaaRating, setMpaaRating] = useState("");
  const [releaseStatus, setReleaseStatus] = useState("COMING_SOON");
  const [runtime, setRuntime] = useState("");
  const [cast, setCast] = useState("");
  const [directors, setDirectors] = useState("");
  const [producers, setProducers] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function validate(): string | null {
    if (!title.trim()) return "Title is required.";
    if (title.trim().length > 200)
      return "Title must be 200 characters or fewer.";
    if (!releaseStatus) return "Release status is required.";
    const rt = Number(runtime);
    if (runtime.trim() === "" || !Number.isInteger(rt) || rt < 0)
      return "Runtime must be a non-negative whole number (minutes).";
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

    startTransition(async () => {
      let resolvedPosterPath = "";

      if (posterFile) {
        const upload = new FormData();
        upload.append("file", posterFile);
        upload.append("title", title.trim());
        const res = await fetch("/api/uploadPoster", {
          method: "POST",
          body: upload,
        });
        const data = (await res.json()) as { path?: string; error?: string };
        if (!res.ok) {
          setError(data.error ?? "Failed to upload poster.");
          return;
        }
        resolvedPosterPath = data.path ?? "";
      }

      const result = await addMovieAction({
        title: title.trim(),
        genres: genres.trim(),
        synopsis: synopsis.trim(),
        trailer: trailer.trim(),
        trailerImage: resolvedPosterPath,
        mpaaRating,
        releaseStatus,
        runtime: Number(runtime),
        cast: cast.trim(),
        directors: directors.trim(),
        producers: producers.trim(),
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
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Add Movie</h2>
            <button
              type="button"
              onClick={onClose}
              className="text-neutral-400 hover:text-white transition-colors text-2xl leading-none"
              aria-label="Close"
            >
              &times;
            </button>
          </div>

          {error && (
            <div className="mb-5 flex items-center gap-2 bg-red-950/60 border border-red-800/60 text-red-400 text-sm rounded-lg px-4 py-3">
              <svg
                className="w-4 h-4 shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            noValidate
            className="flex flex-col gap-5"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label className="text-sm font-medium text-neutral-300">
                  Title <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  maxLength={200}
                  placeholder="Movie title"
                  className="bg-neutral-800 border border-neutral-700 text-white rounded-lg px-4 py-2.5 text-sm placeholder-neutral-500 focus:outline-none focus:border-neutral-500"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-neutral-300">
                  Genres
                </label>
                <input
                  type="text"
                  value={genres}
                  onChange={(e) => setGenres(e.target.value)}
                  maxLength={200}
                  placeholder="e.g. Action, Drama"
                  className="bg-neutral-800 border border-neutral-700 text-white rounded-lg px-4 py-2.5 text-sm placeholder-neutral-500 focus:outline-none focus:border-neutral-500"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-neutral-300">
                  Runtime (minutes) <span className="text-red-400">*</span>
                </label>
                <input
                  type="number"
                  value={runtime}
                  onChange={(e) => setRuntime(e.target.value)}
                  min={0}
                  placeholder="e.g. 120"
                  className="bg-neutral-800 border border-neutral-700 text-white rounded-lg px-4 py-2.5 text-sm placeholder-neutral-500 focus:outline-none focus:border-neutral-500"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-neutral-300">
                  Release Status <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <select
                    value={releaseStatus}
                    onChange={(e) => setReleaseStatus(e.target.value)}
                    className="w-full appearance-none bg-neutral-800 border border-neutral-700 text-white rounded-lg px-4 py-2.5 pr-10 text-sm focus:outline-none focus:border-neutral-500"
                    required
                  >
                    {RELEASE_STATUSES.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                  <svg
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400"
                    fill="none"
                    viewBox="0 0 20 20"
                  >
                    <path
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 8l4 4 4-4"
                    />
                  </svg>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-neutral-300">
                  MPAA Rating
                </label>
                <div className="relative">
                  <select
                    value={mpaaRating}
                    onChange={(e) => setMpaaRating(e.target.value)}
                    className="w-full appearance-none bg-neutral-800 border border-neutral-700 text-white rounded-lg px-4 py-2.5 pr-10 text-sm focus:outline-none focus:border-neutral-500"
                  >
                    {MPAA_RATINGS.map((r) => (
                      <option key={r} value={r}>
                        {r === "" ? "— Select —" : r}
                      </option>
                    ))}
                  </select>
                  <svg
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400"
                    fill="none"
                    viewBox="0 0 20 20"
                  >
                    <path
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 8l4 4 4-4"
                    />
                  </svg>
                </div>
              </div>

              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label className="text-sm font-medium text-neutral-300">
                  Description
                </label>
                <textarea
                  value={synopsis}
                  onChange={(e) => setSynopsis(e.target.value)}
                  rows={3}
                  placeholder="Brief description of the movie"
                  className="bg-neutral-800 border border-neutral-700 text-white rounded-lg px-4 py-2.5 text-sm placeholder-neutral-500 focus:outline-none focus:border-neutral-500 resize-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-neutral-300">
                  Movie Poster
                </label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => posterInputRef.current?.click()}
                    className="flex-1 text-left text-sm text-neutral-400 hover:text-white border border-neutral-700 rounded-lg px-4 py-2.5 transition-colors bg-neutral-800 overflow-hidden"
                  >
                    <span className="block truncate">
                      {posterFile ? posterFile.name : "Choose image file"}
                    </span>
                  </button>
                  {posterFile && (
                    <button
                      type="button"
                      onClick={() => {
                        setPosterFile(null);
                        if (posterInputRef.current)
                          posterInputRef.current.value = "";
                      }}
                      className="text-xs text-neutral-500 hover:text-red-400 transition-colors shrink-0"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <span className="text-xs text-neutral-500">
                  JPEG, PNG, or WebP &mdash; max 5 MB
                </span>
                <input
                  ref={posterInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={(e) => setPosterFile(e.target.files?.[0] ?? null)}
                />
              </div>

              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label className="text-sm font-medium text-neutral-300">
                  Trailer URL
                </label>
                <input
                  type="url"
                  value={trailer}
                  onChange={(e) => setTrailer(e.target.value)}
                  maxLength={300}
                  placeholder="https://..."
                  className="bg-neutral-800 border border-neutral-700 text-white rounded-lg px-4 py-2.5 text-sm placeholder-neutral-500 focus:outline-none focus:border-neutral-500"
                />
              </div>

              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label className="text-sm font-medium text-neutral-300">
                  Cast
                </label>
                <input
                  type="text"
                  value={cast}
                  onChange={(e) => setCast(e.target.value)}
                  placeholder="Comma-separated, e.g. Tom Hanks, Meryl Streep"
                  className="bg-neutral-800 border border-neutral-700 text-white rounded-lg px-4 py-2.5 text-sm placeholder-neutral-500 focus:outline-none focus:border-neutral-500"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-neutral-300">
                  Director(s)
                </label>
                <input
                  type="text"
                  value={directors}
                  onChange={(e) => setDirectors(e.target.value)}
                  placeholder="Comma-separated"
                  className="bg-neutral-800 border border-neutral-700 text-white rounded-lg px-4 py-2.5 text-sm placeholder-neutral-500 focus:outline-none focus:border-neutral-500"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-neutral-300">
                  Producer(s)
                </label>
                <input
                  type="text"
                  value={producers}
                  onChange={(e) => setProducers(e.target.value)}
                  placeholder="Comma-separated"
                  className="bg-neutral-800 border border-neutral-700 text-white rounded-lg px-4 py-2.5 text-sm placeholder-neutral-500 focus:outline-none focus:border-neutral-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-lg text-sm font-medium text-neutral-300 bg-neutral-800 hover:bg-neutral-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="px-5 py-2.5 rounded-lg text-sm font-medium text-white bg-white/10 hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPending ? "Adding..." : "Add Movie"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
