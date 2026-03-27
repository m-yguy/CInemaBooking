"use client";

import type { movie } from "../types/movie";
import MovieCard from "./MovieCard";
import { useMemo, useState } from "react";

interface FilterProps {
  movieData: movie[];
  favoriteIds?: number[];
}

type FilterMode = "Coming Soon" | "Now Playing";

const GENRES = [
  "All",
  "Action",
  "Comedy",
  "Crime",
  "Drama",
  "Horror",
  "Sci-fi",
  "Sport",
  "Suspense",
  "Thriller",
  "Western",
];

export default function Filter({ movieData, favoriteIds = [] }: FilterProps) {
  const [selected, setSelected] = useState<FilterMode>("Now Playing");
  const [genreFilter, setGenreFilter] = useState("All");
  const [showGenreDropdown, setShowGenreDropdown] = useState(false);

  const filteredMovies = useMemo(() => {
    return movieData.filter((m: movie) => {
      const statusMatch = m.release_status === selected;

      const movieGenres = m.genre.split("/").map((g) => g.trim().toLowerCase());

      const genreMatch =
        genreFilter === "All" ||
        movieGenres.includes(genreFilter.toLowerCase());

      return statusMatch && genreMatch;
    });
  }, [movieData, selected, genreFilter]);

  return (
    <div className="font-bold">
      <h2 className="text-4xl mb-8">Movies</h2>

      <div className="flex flex-col sm:flex-row justify-between">
        <h3 className="text-3xl">Featured Movies</h3>

        <div className="flex flex-row items-center">
          <button
            onClick={() => setSelected("Now Playing")}
            className={`flex flex-col transition-all text-lg py-2 hover:text-red-500 duration-300 ${
              selected === "Now Playing" ? "text-red-500" : "text-black"
            }`}
          >
            Now Playing
            <span
              className={`bg-red-500 h-0.5 origin-right transition-all duration-500 ${
                selected === "Now Playing" ? "scale-x-100" : "scale-x-0"
              }`}
            />
          </button>

          <span className="mx-2">|</span>

          <button
            onClick={() => setSelected("Coming Soon")}
            className={`flex flex-col transition-all text-lg py-2 hover:text-red-500 duration-300 ${
              selected === "Coming Soon" ? "text-red-500" : "text-black"
            }`}
          >
            Coming Soon
            <span
              className={`bg-red-500 h-0.5 transition-all duration-500 ${
                selected === "Coming Soon" ? "w-full" : "w-0"
              }`}
            />
          </button>
        </div>
      </div>

      <hr className="border-t-4" />

      {/* Filter By row */}
      <div className="flex items-center gap-3 py-2">
        <p className="uppercase font-normal">filter by</p>

        {/* Genre filter button + dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowGenreDropdown((prev) => !prev)}
            className="flex items-center gap-1.5 border border-gray-300 rounded-full px-4 py-1 text-sm font-semibold hover:border-red-500 hover:text-red-500 transition-all duration-200"
          >
            {genreFilter === "All" ? "Genre" : genreFilter}
            <svg
              className={`w-3.5 h-3.5 transition-transform duration-200 ${
                showGenreDropdown ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {showGenreDropdown && (
            <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-32 overflow-hidden">
              {GENRES.map((genre) => (
                <button
                  key={genre}
                  onClick={() => {
                    setGenreFilter(genre);
                    setShowGenreDropdown(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors ${
                    genreFilter === genre
                      ? "text-red-500 font-semibold"
                      : "font-normal"
                  }`}
                >
                  {genre}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Clear filter badge */}
        {genreFilter !== "All" && (
          <button
            onClick={() => setGenreFilter("All")}
            className="flex items-center gap-1 text-xs text-red-500 border border-red-300 rounded-full px-3 py-1 hover:bg-red-50 transition-all duration-200"
          >
            Clear
            <svg
              className="w-3 h-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>

      <div className="mt-4">
        {filteredMovies.length === 0 ? (
          <div className="flex min-h-100">
            <p className="font-normal opacity-70">
              No movies found for:{" "}
              <span className="font-semibold">{selected}</span>
              {genreFilter !== "All" && (
                <span>
                  {" "}
                  in <span className="font-semibold">{genreFilter}</span>
                </span>
              )}
            </p>
          </div>
        ) : (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {filteredMovies.map((m) => (
              <MovieCard
                key={m.title}
                movieData={m}
                initialFavorited={favoriteIds.includes(m.movie_id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
