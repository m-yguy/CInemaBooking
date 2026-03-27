"use client";

import { useEffect, useState } from "react";
import type { movie } from "../types/movie";
import Navbar from "../components/Navbar";
import MovieCard from "../components/MovieCard";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();
  const userEmail = session?.user?.email;
  const [movies, setMovies] = useState<movie[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/movieData")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch movies");
        return res.json();
      })
      .then((data: movie[]) => setMovies(data))
      .catch(() => setError("Failed to load movies. Please try again."))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!userEmail) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFavoriteIds([]);
      return;
    }

    fetch("/api/favorites")
      .then((res) => res.json())
      .then((data: number[]) => setFavoriteIds(data))
      .catch(() => setFavoriteIds([]));
  }, [userEmail]);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-6xl mx-auto px-6 py-10 w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 tracking-tight">
            Movies
          </h1>
          <div className="mt-2 h-1 w-16 bg-linear-to-r from-red-600 to-red-400 rounded-full" />
        </div>

        {loading && (
          <div className="flex items-center justify-center py-20 text-neutral-500">
            Loading movies...
          </div>
        )}

        {!loading && error && (
          <div className="flex items-center justify-center py-20 text-red-500">
            {error}
          </div>
        )}

        {!loading && !error && movies.length === 0 && (
          <div className="flex items-center justify-center py-20 text-neutral-500">
            No movies found.
          </div>
        )}

        {!loading && !error && movies.length > 0 && (
          <div className="grid gap-6 grid-cols-[repeat(auto-fit,minmax(250px,1fr))]">
            {movies.map((m) => (
              <MovieCard
                key={m.movie_id}
                movieData={m}
                initialFavorited={favoriteIds.includes(m.movie_id)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
