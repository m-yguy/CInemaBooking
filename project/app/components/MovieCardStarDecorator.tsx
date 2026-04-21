"use client";

import { useEffect, useState } from "react";
import type { MouseEvent } from "react";
import { useSession } from "next-auth/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import type { movie } from "../types/movie";
import MovieCardTicketDecorator from "./MovieCardTicketDecorator";

interface MovieCardStarDecoratorProps {
  movieData: movie;
  initialFavorited?: boolean;
  showTitle?: boolean;
  showMovieInfo?: boolean;
  className?: string;
}

export default function MovieCardStarDecorator({
  movieData,
  initialFavorited = false,
  showTitle,
  showMovieInfo,
  className,
}: MovieCardStarDecoratorProps) {
  const { data: session, status } = useSession();
  const [favorited, setFavorited] = useState(initialFavorited);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFavorited(initialFavorited);
  }, [initialFavorited]);

  async function toggleFavorite(e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (loading || status !== "authenticated") {
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

  const isCustomer = session?.user?.role === "CUSTOMER";

  return (
    <MovieCardTicketDecorator
      movieData={movieData}
      showTitle={showTitle}
      showMovieInfo={showMovieInfo}
      className={className}
      posterOverlay={
        isCustomer ? (
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
              title={favorited ? "Remove from favorites" : "Add to favorites"}
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
        ) : null
      }
    />
  );
}
