"use client";

import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import type { movie } from "../types/movie";
import { useSession } from "next-auth/react";
import MovieCardTicketDecorator from "../components/MovieCardTicketDecorator";
import MovieCardTicketSkeletonDecorator from "../components/MovieCardTicketSkeletonDecorator";

export default function RecommendationsPage() {
  const { data: session } = useSession();
  const role = session?.user?.role;
  const isCustomer = role === "CUSTOMER";
  const [movies, setMovies] = useState<movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isCustomer) {
      setMovies([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    fetch("/api/recommendations")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch recommendations");
        return res.json();
      })
      .then((data: movie[]) => setMovies(data))
      .catch(() =>
        setError("Failed to load recommendations. Please try again."),
      )
      .finally(() => setLoading(false));
  }, [isCustomer]);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-6xl mx-auto px-6 py-10 w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 tracking-tight">
            Recommendations
          </h1>
          <div className="mt-2 h-1 w-16 bg-linear-to-r from-red-600 to-red-400 rounded-full" />
        </div>

        {loading ? (
          <div className="grid gap-6 grid-cols-[repeat(auto-fit,minmax(250px,1fr))]">
            {Array.from({ length: 8 }).map((_, idx) => (
              <MovieCardTicketSkeletonDecorator key={idx} />
            ))}
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-20 text-red-500">
            {error}
          </div>
        ) : !isCustomer ? (
          <div className="text-center py-20 text-neutral-700">
            <p className="text-xl font-semibold text-neutral-900">
              Sign in as a customer to see Recommendations.
            </p>
            <p className="mt-3 text-sm text-neutral-600">
              Recommendations are generated from your favorite movies and top
              genres.
            </p>
          </div>
        ) : movies.length === 0 ? (
          <div className="text-center py-20 text-neutral-700">
            <p className="text-xl font-semibold text-neutral-900">
              No recommendations available yet.
            </p>
            <p className="mt-3 text-sm text-neutral-600">
              Favorite some movies first, and we&apos;ll show suggestions here.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 grid-cols-[repeat(auto-fit,minmax(250px,1fr))]">
            {movies.map((movie) => (
              <MovieCardTicketDecorator
                key={movie.movie_id}
                movieData={movie}
              />
            ))}
          </div>
        )}
      </main>
      <footer className="bg-black p-8 text-white text-center items-center">
        <span className="tracking-[0.35em] uppercase">REELHOUSE</span>
      </footer>
    </div>
  );
}
