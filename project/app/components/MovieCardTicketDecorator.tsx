import Link from "next/link";
import type { ReactNode } from "react";
import type { movie } from "../types/movie";
import MovieCard from "./MovieCard";

interface MovieCardTicketDecoratorProps {
  movieData: movie;
  showTitle?: boolean;
  showMovieInfo?: boolean;
  posterOverlay?: ReactNode;
  className?: string;
  titleClassName?: string;
  imageClassName?: string;
  imageSizes?: string;
}

export default function MovieCardTicketDecorator({
  movieData,
  showTitle,
  showMovieInfo,
  posterOverlay,
  className,
  titleClassName,
  imageClassName,
  imageSizes,
}: MovieCardTicketDecoratorProps) {
  return (
    <MovieCard
      movieData={movieData}
      showTitle={showTitle}
      showMovieInfo={showMovieInfo}
      posterOverlay={posterOverlay}
      className={className}
      titleClassName={titleClassName}
      imageClassName={imageClassName}
      imageSizes={imageSizes}
      footer={
        <Link
          href={`/movies/showtimes/${encodeURIComponent(movieData.title)}`}
          className="bg-red-700 rounded-4xl mt-6 p-2.5 font-bold text-white uppercase w-full md:max-w-40 hover:bg-black transition-all duration-200 text-center"
        >
          Get Tickets
        </Link>
      }
    />
  );
}
