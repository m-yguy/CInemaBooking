"use client";

import { useState } from "react";
import Navbar from "@/app/components/Navbar";
import Image from "next/image";
import Link from "next/link";
import type { movie } from "@/app/types/movie";
import { formatRuntime, formatDate } from "@/app/components/MovieCard";

interface MovieDetailsClientProps {
  movie: movie;
  decodedTitle: string;
  trailerEmbed: string | null;
  youtubeId: string | null;
}

const INVALID_POSTER_PATH = "/Movie_Posters/invalidposter.svg";

const getPosterPath = (posterPath: string | null | undefined) => {
  if (!posterPath || posterPath.trim() === "") {
    return INVALID_POSTER_PATH;
  }

  return posterPath;
};

export default function MovieDetailsClient({
  movie,
  decodedTitle,
  trailerEmbed,
  youtubeId,
}: MovieDetailsClientProps) {
  const [watchingTrailer, setWatchingTrailer] = useState(false);
  const [posterSrc, setPosterSrc] = useState(getPosterPath(movie.poster_path));

  const ratingDescriptions: Record<string, string> = {
    "PG-13":
      "Parents Strongly Cautioned - Some material may be inappropriate for children under 13.",
    R: "Restricted - Under 17 requires accompanying parent or adult guardian.",
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      {/* HERO SECTION */}
      <div className="relative w-full h-130 overflow-hidden">
        {/* Background image */}
        {youtubeId && (
          <Image
            src={`https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`}
            alt="Movie Trailer"
            fill
            loading="eager"
            sizes="100vw"
            className="object-cover object-[50%_30%] brightness-[0.65] transition-all duration-500"
          />
        )}

        <div className="absolute inset-0 bg-linear-to-t from-black via-black/40 to-transparent transition-all duration-500" />

        {/* TRAILER MODE */}
        <div
          className={`
            absolute inset-0 flex flex-col items-center justify-center px-0 pb-6 max-w-6xl mx-auto
            transition-all duration-500
            ${watchingTrailer ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}
          `}
        >
          <div className="w-full max-w-4xl aspect-video bg-black rounded-lg overflow-hidden shadow-xl transition-all duration-500 mt-6">
            {watchingTrailer && trailerEmbed && (
              <iframe
                src={trailerEmbed}
                className="w-full h-full"
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                allow="autoplay; encrypted-media"
                allowFullScreen
              />
            )}
          </div>

          <button
            onClick={() => setWatchingTrailer(false)}
            className="mt-4 text-white border border-white py-2 px-8 rounded-lg hover:bg-white hover:text-black transition-all duration-300"
          >
            Back
          </button>
        </div>

        {/* NORMAL MODE */}
        <div
          className={`
            absolute inset-0 flex items-end px-6 pb-10 max-w-6xl mx-auto
            transition-all duration-500
            ${!watchingTrailer ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}
          `}
        >
          <div className="flex flex-row gap-6 items-end">
            <div className="relative w-40 aspect-2/3 shrink-0 transition-all duration-500">
              <Image
                src={posterSrc}
                alt={`${movie.title} poster`}
                fill
                loading="eager"
                sizes="160px"
                className="object-cover rounded-md"
                onError={() => {
                  setPosterSrc(INVALID_POSTER_PATH);
                }}
              />
            </div>

            <div className="flex flex-col text-white transition-all duration-500">
              <span className="uppercase text-sm font-semibold tracking-wider">
                {movie.mpa_rating || "N/A"} |{" "}
                {movie.runtime != null
                  ? formatRuntime(movie.runtime)
                  : "Unavailable"}
              </span>
              <span className="text-sm font-semibold tracking-wider mt-1">
                {movie.genre || "Unavailable"} • ★ {movie.rating || "N/A"}
              </span>

              <h2 className="font-bold uppercase text-4xl mb-4">
                {decodedTitle}
              </h2>

              <div className="flex flex-col gap-4">
                <button
                  onClick={() => setWatchingTrailer(true)}
                  className="text-white border border-white py-2 px-8 rounded-lg hover:bg-white hover:text-black transition-all duration-300"
                >
                  Watch Trailer
                </button>

                <Link
                  href={`/movies/showtimes/${encodeURIComponent(movie.title)}`}
                  className="bg-red-700 rounded-2xl py-2.5 px-8 font-bold text-white uppercase hover:bg-white hover:text-black transition-all duration-300 text-center"
                >
                  Get Tickets
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* DETAILS SECTION */}
      <main className="flex flex-col gap-6 max-w-6xl mx-auto px-6 w-full mb-8 font-bold text-lg text-[#333333]">
        <div className="grid grid-cols-[30%_1fr] w-full mt-10">
          <div>
            <h2>Release Date</h2>
            <p className="font-semibold text-sm">
              {movie.showtime ? formatDate(movie.showtime) : "Unavailable"}
            </p>
          </div>
          <div>
            <h2>Running Time</h2>
            <p className="font-semibold text-sm">
              {movie.runtime != null
                ? formatRuntime(movie.runtime)
                : "Unavailable"}
            </p>
          </div>
        </div>

        <span className="bg-black border w-full"></span>

        <div>
          <h2>Synopsis</h2>
          <p className="font-semibold text-sm">
            {movie.movie_description || "Unavailable"}
          </p>
        </div>

        <span className="bg-black border w-full"></span>

        <div className="grid grid-cols-[30%_1fr] w-full">
          <div>
            <h2>Director</h2>
            <p className="font-semibold text-sm">{movie.director || "N/A"}</p>
          </div>
          <div>
            <h2>Cast</h2>
            <p className="font-semibold text-sm">{movie.movie_cast || "N/A"}</p>
          </div>
        </div>

        <span className="bg-black border w-full"></span>

        <div>
          <h2>Age Restrictions</h2>
          <p className="text-4xl border-3 w-fit px-2 mt-2">
            {movie.mpa_rating || "N/A"}
          </p>
          <p className="text-xs font-bold max-w-40 mt-2">
            {ratingDescriptions[movie.mpa_rating] || "Rating unavailable"}
          </p>
        </div>
      </main>

      <footer className="bg-black p-8 text-white text-center items-center">
        <span className="text-black">Footer</span>
      </footer>
    </div>
  );
}
