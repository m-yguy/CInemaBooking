"use client";

import { useEffect, useState } from "react";
import type { movie } from "../types/movie";
import Navbar from "../components/Navbar";
import MovieCard from "../components/MovieCard";

export default function Home() {
  const [movies, setMovies] = useState<movie[]>([]);

  useEffect(() => {
    fetch("/api/movieData")
      .then((res) => res.json())
      .then((data: movie[]) => setMovies(data));
  }, []);

  return (
    <div className="flex flex-col">
      <Navbar />
      <main className="flex flex-col gap-6 max-w-6xl mx-auto px-6 w-full mb-8 mt-20">
        <h2 className="text-4xl  font-bold">Movies</h2>
        <span className="bg-black border-2"></span>
        <div className="grid gap-6 grid-cols-[repeat(auto-fit,minmax(250px,1fr))]">
          {movies.map((m) => (
            <MovieCard key={m.title} movieData={m} />
          ))}
        </div>
      </main>

      <footer className="bg-black p-8 text-white text-center items-center">
        <span className="text-black">Footer</span>
      </footer>
    </div>
  );
}
