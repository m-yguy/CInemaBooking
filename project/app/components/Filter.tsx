import type { movie } from "../types/movie";
import MovieCard from "./MovieCard";
import { useState } from "react";

interface FilterProps {
  movieData: movie[];
}

export default function Filter({ movieData }: FilterProps) {
  const [selected, setSelected] = useState<"Coming Soon" | "Now Playing">(
    "Now Playing",
  );

  const filterComing = () => {
    setSelected("Coming Soon");
  };
  const filterPlaying = () => {
    setSelected("Now Playing");
  };

  return (
    <div className="font-bold">
      <h2 className="text-4xl mb-8">Movies</h2>
      <div className="flex flex-col sm:flex-row justify-between">
        <h3 className="text-3xl">Featured Movies</h3>
        <div className="flex flex-row items-center">
          <button
            onClick={filterPlaying}
            className={`transition-colors text-lg duration-300 py-2 ${selected === "Now Playing" ? "text-red-500 underline" : "text-black"}`}
          >
            Now Playing
          </button>
          <span className="mx-2">|</span>
          <button
            onClick={filterComing}
            className={`transition-colors text-lg duration-300 py-2 ${selected === "Coming Soon" ? "text-red-500 underline" : "text-black"}`}
          >
            Coming Soon
          </button>
        </div>
      </div>
      <hr className="border-t-4" />
      <p className="uppercase font-normal">filter by</p>
      <div className="grid mt-4 gap-6 grid-cols-[repeat(auto-fit,minmax(200px,1fr))]">
        {movieData.map((movie) => (
          <MovieCard key={movie.title} movieData={movie} />
        ))}
      </div>
    </div>
  );
}
