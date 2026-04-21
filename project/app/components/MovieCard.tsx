"use client";

import type { movie } from "../types/movie";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { useState } from "react";

export type MovieCardData = Pick<
  movie,
  "movie_id" | "title" | "poster_path"
> & {
  runtime?: number;
  mpa_rating?: string;
  showtime?: string;
  release_status?: string;
};

interface MovieCardProps {
  movieData: MovieCardData;
  showTitle?: boolean;
  showMovieInfo?: boolean;
  posterOverlay?: ReactNode;
  footer?: ReactNode;
  className?: string;
  titleClassName?: string;
  imageClassName?: string;
  imageSizes?: string;
}

interface MovieCardSkeletonProps {
  showTitle?: boolean;
  showMovieInfo?: boolean;
  footer?: ReactNode;
  className?: string;
  titleClassName?: string;
}

const INVALID_POSTER_PATH = "/Movie_Posters/invalidposter.svg";

const getPosterPath = (posterPath: string | null | undefined) => {
  if (!posterPath || posterPath.trim() === "") {
    return INVALID_POSTER_PATH;
  }

  return posterPath;
};

function MoviePoster({
  posterPath,
  title,
  imageClassName,
  imageSizes,
}: {
  posterPath: string | null | undefined;
  title: string;
  imageClassName: string;
  imageSizes: string;
}) {
  const [posterSrc, setPosterSrc] = useState(getPosterPath(posterPath));

  return (
    <Image
      src={posterSrc}
      alt={`${title} Poster`}
      fill
      loading="eager"
      sizes={imageSizes}
      className={`object-cover ${imageClassName}`}
      onError={() => {
        setPosterSrc(INVALID_POSTER_PATH);
      }}
    />
  );
}

export const formatRuntime = (min: number) =>
  `${Math.floor(min / 60)}h ${min % 60}m`;

export const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

export function MovieCardSkeleton({
  showTitle = true,
  showMovieInfo = true,
  footer,
  className = "",
  titleClassName = "",
}: MovieCardSkeletonProps) {
  return (
    <div
      className={`flex flex-col justify-between mb-6 w-50 animate-pulse ${className}`}
      aria-hidden="true"
    >
      <div>
        <div className="relative w-full aspect-2/3 overflow-hidden rounded-lg bg-gray-200" />

        {showTitle && (
          <div className={`mt-3 h-6 rounded bg-gray-200 ${titleClassName}`} />
        )}

        {showMovieInfo && (
          <>
            <div className="mt-2 h-4 w-3/5 rounded bg-gray-200" />
            <div className="mt-2 h-4 w-2/3 rounded bg-gray-200" />
          </>
        )}
      </div>

      {footer}
    </div>
  );
}

export default function MovieCard({
  movieData,
  showTitle = true,
  showMovieInfo = true,
  posterOverlay,
  footer,
  className = "",
  titleClassName = "",
  imageClassName = "",
  imageSizes = "220px",
}: MovieCardProps) {
  return (
    <div
      className={`flex flex-col justify-between mb-6 w-50 hover:scale-101 transition-all duration-200 ease-in-out ${className}`}
    >
      <div>
        <div className="relative w-full aspect-2/3 overflow-hidden rounded-lg bg-gray-200">
          <Link
            href={`/movies/${encodeURIComponent(movieData.title)}`}
            className="block w-full h-full"
          >
            <MoviePoster
              key={movieData.poster_path ?? ""}
              posterPath={movieData.poster_path}
              title={movieData.title}
              imageClassName={imageClassName}
              imageSizes={imageSizes}
            />
          </Link>

          {posterOverlay}
        </div>

        {showTitle && (
          <Link href={`/movies/${encodeURIComponent(movieData.title)}`}>
            <h2
              className={`font-bold leading-tight line-clamp-2 text-[clamp(0.5rem,4vw,1.5rem)] transition-all duration-200 hover:text-[#c8997c] ${titleClassName}`}
            >
              {movieData.title}
            </h2>
          </Link>
        )}

        {showMovieInfo && (
          <>
            <span className="uppercase text-sm font-semibold tracking-wide">
              {movieData.runtime != null
                ? formatRuntime(movieData.runtime)
                : "Unavailable"}{" "}
              | {movieData.mpa_rating ?? "N/A"}
            </span>

            <p className="font-semibold text-sm">
              {movieData.showtime
                ? movieData.release_status === "Coming Soon"
                  ? `Opening ${formatDate(movieData.showtime)}`
                  : `Released ${formatDate(movieData.showtime)}`
                : "Date Unavailable"}
            </p>
          </>
        )}
      </div>

      {footer}
    </div>
  );
}
