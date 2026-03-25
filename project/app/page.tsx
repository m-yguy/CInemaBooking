"use client";
import Navbar from "./components/Navbar";
import Filter from "./components/Filter";
import { useEffect, useState } from "react";
import { movie } from "./types/movie";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();
  const [movies, setMovies] = useState<movie[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);

  useEffect(() => {
    fetch("/api/movieData")
      .then((res) => res.json())
      .then((data) => setMovies(data));
  }, []);

  useEffect(() => {
    if (!session) {
      setFavoriteIds([]);
      return;
    }
    fetch("/api/favorites")
      .then((res) => res.json())
      .then((data: number[]) => setFavoriteIds(data))
      .catch(() => setFavoriteIds([]));
  }, [session]);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col gap-6 max-w-6xl mx-auto px-6 w-full mb-8">
        <div className="bg-black text-white rounded-3xl min-h-80 mt-20 text-center items-center">
          hero
        </div>
        <Filter movieData={movies} favoriteIds={favoriteIds} />
      </main>
      <footer className="bg-black p-8 text-white text-center items-center">
        <span className="text-black">Footer</span>
      </footer>
    </div>
  );
}
