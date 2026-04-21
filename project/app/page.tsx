"use client";
import Navbar from "./components/Navbar";
import Filter from "./components/Filter";
import { useEffect, useRef, useState } from "react";
import { movie } from "./types/movie";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();
  const role = session?.user?.role;
  const isCustomer = role === "CUSTOMER";
  const [movies, setMovies] = useState<movie[]>([]);
  const [isLoadingMovies, setIsLoadingMovies] = useState(true);
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
  const prevFavoriteIds = useRef<number[]>([]);

  useEffect(() => {
    fetch("/api/movieData")
      .then((res) => res.json())
      .then((data) => setMovies(data))
      .catch(() => setMovies([]))
      .finally(() => setIsLoadingMovies(false));
  }, []);

  useEffect(() => {
    let isMounted = true;
    const fetchFavorites = async () => {
      if (!session || role !== "CUSTOMER") {
        if (prevFavoriteIds.current.length !== 0) {
          prevFavoriteIds.current = [];
          setFavoriteIds([]);
        }
        return;
      }
      try {
        const res = await fetch("/api/favorites");
        const data: number[] = await res.json();
        const prev = prevFavoriteIds.current;
        if (
          isMounted &&
          (data.length !== prev.length ||
            !data.every((id, i) => id === prev[i]))
        ) {
          prevFavoriteIds.current = data;
          setFavoriteIds(data);
        }
      } catch {
        if (isMounted && prevFavoriteIds.current.length !== 0) {
          prevFavoriteIds.current = [];
          setFavoriteIds([]);
        }
      }
    };
    fetchFavorites();
    return () => {
      isMounted = false;
    };
  }, [role, session]);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col gap-6 max-w-6xl mx-auto px-6 w-full mb-8">
        <div className="flex bg-black text-white rounded-3xl min-h-80 mt-20 text-center items-center justify-center">
          hero
        </div>
        <Filter
          movieData={movies}
          favoriteIds={favoriteIds}
          isCustomer={isCustomer}
          isLoading={isLoadingMovies}
        />
      </main>
      <footer className="bg-black p-8 text-white text-center items-center">
        <span>Footer</span>
      </footer>
    </div>
  );
}
