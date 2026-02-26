"use client";
import Navbar from "./components/Navbar";
import Filter from "./components/Filter";
import { useEffect, useState } from "react";
import { movie } from "./types/movie";

export default function Home() {
  const [movies, setMovies] = useState<movie[]>([]);
  useEffect(() => {
    fetch("/api/movieData")
      .then((res) => res.json())
      .then((data) => setMovies(data));
  }, []);

  return (
    <div className="flex flex-col">
      <Navbar />
      <main className="flex flex-col gap-6 max-w-6xl mx-auto px-6 w-full mb-8">
        <div className="bg-black text-white rounded-3xl min-h-80 mt-20 text-center items-center">
          hero
        </div>
        <Filter movieData={movies} />
      </main>
      <footer className="bg-black p-8 text-white text-center items-center">
        <span>Footer</span>
      </footer>
    </div>
  );
}
