"use client";

import type { movie } from "../types/movie";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

interface MovieCardProps {
  movieData: movie;
  initialFavorited?: boolean;
}

export const formatRuntime = (min: number) =>
  `${Math.floor(min / 60)}h ${min % 60}m`;

export const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

export default function MovieCard({
  movieData,
  initialFavorited = false,
}: MovieCardProps) {
  const { data: session, status } = useSession();
  const isAdmin = session?.user?.role === "ADMIN";
  const router = useRouter();
  const [favorited, setFavorited] = useState(initialFavorited);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFavorited(initialFavorited);
  }, [initialFavorited]);

  async function toggleFavorite(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (loading) return;
    if (status !== "authenticated") {
      router.push("/signin");
      return;
    }
    setLoading(true);
    const next = !favorited;
    setFavorited(next);
    try {
      await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ movieId: movieData.movie_id, favorited: next }),
      });
    } catch {
      setFavorited(!next);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col justify-between mb-6 w-50 hover:scale-101 transition-all duration-200 ease-in-out">
      <div>
        <Link
          href={`/movies/${encodeURIComponent(movieData.title)}`}
          className="block"
        >
          <div className="relative w-full aspect-2/3 overflow-hidden rounded-lg bg-gray-200">
            <Image
              src={movieData.poster_path}
              alt={`${movieData.title} Poster`}
              fill
              loading="eager"
              sizes="220px"
              className="object-cover"
            />

            {!isAdmin && (
              <div className="absolute top-0 right-0 z-10 w-14 h-14">
                <svg
                  className="absolute inset-0 w-full h-full"
                  viewBox="0 0 56 56"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <polygon points="0,0 56,0 56,56" fill="black" />
                </svg>

                <button
                  onClick={toggleFavorite}
                  title={
                    status !== "authenticated"
                      ? "Sign in to favorite"
                      : favorited
                        ? "Remove from favorites"
                        : "Add to favorites"
                  }
                  className="absolute top-1 right-1 z-10 w-6 h-6 flex items-center justify-center cursor-pointer"
                >
                  <FontAwesomeIcon
                    icon={faStar}
                    className={`w-2.5 h-2.5 transition-all duration-300 ease-in-out ${
                      favorited
                        ? "text-yellow-300 scale-110"
                        : "text-white/50 scale-100"
                    }`}
                  />
                </button>
              </div>
            )}
          </div>

          <h2 className="font-bold leading-tight line-clamp-2 text-[clamp(0.5rem,4vw,1.5rem)] transition-all duration-200 hover:text-[#c8997c]">
            {movieData.title}
          </h2>
        </Link>

        <span className="uppercase text-sm font-semibold tracking-wide">
          {formatRuntime(movieData.runtime)} | {movieData.mpa_rating}
        </span>

        <p className="font-semibold text-sm">
          {movieData.release_status === "Coming Soon"
            ? `Opening ${formatDate(movieData.showtime)}`
            : `Released ${formatDate(movieData.showtime)}`}
        </p>
      </div>

      <Link
        href={`/movies/showtimes/${encodeURIComponent(movieData.title)}`}
        className="bg-red-700 rounded-4xl mt-6 p-2.5 font-bold text-white uppercase w-full md:max-w-40 hover:bg-black transition-all duration-200 text-center"
      >
        Get Tickets
      </Link>
    </div>
  );
}
