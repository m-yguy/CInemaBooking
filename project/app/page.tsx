"use client";
import Navbar from "./components/Navbar";
import Filter from "./components/Filter";
import Image from "next/image";
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
        <div className="relative rounded-3xl min-h-100 mt-20 overflow-hidden">
          <Image
            src="/herosection.jpg"
            alt="Homepage hero"
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-r from-black via-black/70 to-transparent" />
          <div className="absolute inset-y-0 left-0 flex flex-col justify-center px-8 md:px-16 lg:px-20 text-white max-w-xl">
            <span className="text-sm uppercase tracking-[0.3em] text-red-400 mb-3">
              Now showing
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Project Hail Mary
            </h1>
            <p className="mt-4 text-sm md:text-base text-white/90 max-w-xl">
              An epic adaptation of the bestselling novel, bringing the book's
              space rescue adventure to life on the big screen.
            </p>
          </div>
        </div>
        <Filter
          movieData={movies}
          favoriteIds={favoriteIds}
          isCustomer={isCustomer}
          isLoading={isLoadingMovies}
        />
      </main>
      <footer className="bg-black p-8 text-white text-center items-center">
        <span className="tracking-[0.35em] uppercase">REELHOUSE</span>
      </footer>
    </div>
  );
}
