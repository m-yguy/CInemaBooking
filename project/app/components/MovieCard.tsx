"use client";

import type { movie } from "../types/movie";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

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
  const { status } = useSession();
  const router = useRouter();
  const [favorited, setFavorited] = useState(initialFavorited);
  const [loading, setLoading] = useState(false);

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
            {/* Favorite star button */}
            <button
              onClick={toggleFavorite}
              title={
                status !== "authenticated"
                  ? "Sign in to favorite"
                  : favorited
                    ? "Remove from favorites"
                    : "Add to favorites"
              }
              className={`absolute top-2 right-2 z-10 w-8 h-8 flex items-center justify-center rounded-full transition-all duration-200 cursor-pointer hover:scale-110
                ${favorited ? "bg-yellow-400/90" : "bg-black/40"}
              `}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill={favorited ? "white" : "none"}
                stroke="white"
                strokeWidth={1.8}
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
                />
              </svg>
            </button>
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
