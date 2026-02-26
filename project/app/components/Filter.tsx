"use client";

import type { movie } from "../types/movie";
import MovieCard from "./MovieCard";
import { useMemo, useState } from "react";

interface FilterProps {
  movieData: movie[];
}

type FilterMode = "Coming Soon" | "Now Playing";

export default function Filter({ movieData }: FilterProps) {
  const [selected, setSelected] = useState<FilterMode>("Now Playing");

  const filteredMovies = useMemo(() => {
    return movieData.filter((m: movie) => m.release_status === selected);
  }, [movieData, selected]);

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
      <p className="uppercase font-normal">filter by</p>

      <div className="mt-4">
        {filteredMovies.length === 0 ? (
          <p className="font-normal opacity-70">
            No movies found for:{" "}
            <span className="font-semibold">{selected}</span>
          </p>
        ) : (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {filteredMovies.map((m) => (
              <MovieCard key={m.title} movieData={m} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
