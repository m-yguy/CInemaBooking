"use client";
import Navbar from "./components/Navbar";
import Filter from "./components/Filter";
import RecommendedMoviesSection from "./components/RecommendedMoviesSection";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
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

  const favoriteMovies = useMemo(
    () => movies.filter((movie) => favoriteIds.includes(movie.movie_id)),
    [movies, favoriteIds],
  );

  const favoriteGenres = useMemo(() => {
    const counts = new Map<string, number>();

    favoriteMovies.forEach((movie) => {
      movie.genre
        .split(/[\/,:]/)
        .map((value) => value.trim())
        .filter(Boolean)
        .forEach((genre) => {
          counts.set(genre, (counts.get(genre) ?? 0) + 1);
        });
    });

    return Array.from(counts.entries())
      .sort(([, aCount], [, bCount]) => bCount - aCount)
      .map(([genre]) => genre);
  }, [favoriteMovies]);

  const recommendedMovies = useMemo(() => {
    const topGenres = new Set(favoriteGenres.slice(0, 3));
    if (topGenres.size === 0) return [];

    return movies
      .filter((movie) => !favoriteIds.includes(movie.movie_id))
      .map((movie) => {
        const matchCount = new Set(
          movie.genre
            .split(/[\/,:]/)
            .map((value) => value.trim())
            .filter(Boolean)
            .filter((genre) => topGenres.has(genre)),
        ).size;
        return { movie, matchCount };
      })
      .filter(({ matchCount }) => matchCount > 0)
      .sort(
        (a, b) =>
          b.matchCount - a.matchCount ||
          b.movie.rating - a.movie.rating ||
          a.movie.movie_id - b.movie.movie_id,
      )
      .map(({ movie }) => movie);
  }, [movies, favoriteIds, favoriteGenres]);

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
              An epic adaptation of the bestselling novel, bringing the
              book&apos;s space rescue adventure to life on the big screen.
            </p>
          </div>
        </div>
        {favoriteGenres.length > 0 && (
          <section className="rounded-3xl border border-gray-200 bg-black p-8 text-white">
            <div className="flex flex-col gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-red-500 mb-2">
                  Your favorite genres
                </p>
                <h2 className="text-3xl font-bold">Your favorite genres</h2>
                <p className="mt-2 text-gray-300 max-w-2xl">
                  Based on the movies you’ve favorited, these are the genres you
                  watch most often.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                {favoriteGenres.slice(0, 4).map((genre) => (
                  <span
                    key={genre}
                    className="rounded-full border border-red-700 bg-red-700 px-4 py-2 text-sm font-medium text-white"
                  >
                    {genre}
                  </span>
                ))}
              </div>
              {favoriteGenres.length > 4 ? (
                <p className="text-sm text-gray-400">
                  Showing your top {Math.min(favoriteGenres.length, 4)} favorite
                  genres.
                </p>
              ) : (
                <p className="text-sm text-gray-400">
                  Showing your favorite genres sorted by how often they appear.
                </p>
              )}
            </div>
          </section>
        )}
        {isCustomer && recommendedMovies.length > 0 && (
          <RecommendedMoviesSection
            recommendedMovies={recommendedMovies}
            showViewAllLink={true}
            sectionLabel="Recommended for you"
          />
        )}
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
