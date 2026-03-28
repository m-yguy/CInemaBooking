import Image from "next/image";

interface FavoriteMovieCardProps {
  movieId: number | string;
  title: string;
  posterPath: string;
}

export default function FavoriteMovieCard({
  movieId,
  title,
  posterPath,
}: FavoriteMovieCardProps) {
  return (
    <a
      key={movieId}
      href={`/movies/${encodeURIComponent(title)}`}
      className="group flex flex-col gap-2"
    >
      <div className="relative aspect-2/3 w-full overflow-hidden rounded-lg bg-gray-200">
        <Image
          src={posterPath}
          alt={`${title} poster`}
          fill
          sizes="(max-width: 640px) 96px, 112px"
          className="object-cover transition-transform duration-200 group-hover:scale-105"
        />
      </div>
      <p className="text-xs font-semibold leading-tight line-clamp-2 group-hover:text-red-800">
        {title}
      </p>
    </a>
  );
}
