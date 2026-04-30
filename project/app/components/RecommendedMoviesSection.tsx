"use client";

import Link from "next/link";
import type { movie } from "../types/movie";
import MovieCardTicketDecorator from "./MovieCardTicketDecorator";

interface RecommendedMoviesSectionProps {
  recommendedMovies: movie[];
  showViewAllLink?: boolean;
  sectionLabel?: string;
}

export default function RecommendedMoviesSection({
  recommendedMovies,
  showViewAllLink = true,
  sectionLabel = "Recommended movies",
}: RecommendedMoviesSectionProps) {
  const displayLimit = 5;
  const visibleMovies = recommendedMovies.slice(0, displayLimit);
  const hasMore = recommendedMovies.length > displayLimit;

  return (
    <section className="bg-white p-0 text-slate-900">
      <div className="py-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">
              {sectionLabel}
            </h2>
          </div>

          {hasMore && showViewAllLink && (
            <div className="mt-1">
              <Link
                href="/recommendations"
                className="text-xs font-bold text-red-500 hover:text-red-400 flex items-center gap-1"
              >
                View More
                <span aria-hidden="true" className="font-black text-sm">
                  →
                </span>
              </Link>
            </div>
          )}
        </div>

        <hr className="border-t-4 border-black mt-2" />

        {visibleMovies.length > 0 ? (
          <div className="mt-8 grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {visibleMovies.map((movie) => (
              <MovieCardTicketDecorator
                key={movie.movie_id}
                movieData={movie}
              />
            ))}
          </div>
        ) : (
          <div className="mt-8 text-slate-600">
            <p className="text-lg font-semibold text-slate-900">
              No recommendations yet.
            </p>
            <p className="mt-2 text-sm text-slate-600">
              Favorite a few movies first, and we&apos;ll suggest films that
              match your top genres.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
