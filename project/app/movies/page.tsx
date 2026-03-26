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
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-6xl mx-auto px-6 py-10 w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 tracking-tight">
            Movies
          </h1>
          <div className="mt-2 h-1 w-16 bg-linear-to-r from-red-600 to-red-400 rounded-full" />
        </div>
        <div className="grid gap-6 grid-cols-[repeat(auto-fit,minmax(250px,1fr))]">
          {movies.map((m) => (
            <MovieCard key={m.title} movieData={m} />
          ))}
        </div>
      </main>
    </div>
  );
}
