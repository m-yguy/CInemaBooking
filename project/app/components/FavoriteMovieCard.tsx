import Image from "next/image";

interface FavoriteMovieCardProps {
  movieId: number | string;
  title: string;
  posterPath: string | null;
  removeAction?: (formData: FormData) => Promise<void>;
}

export default function FavoriteMovieCard({
  movieId,
  title,
  posterPath,
  removeAction,
}: FavoriteMovieCardProps) {
  return (
    <div className="group flex flex-col gap-2">
      <div className="relative aspect-2/3 w-full overflow-hidden rounded-lg bg-gray-200">
        <a
          href={`/movies/${encodeURIComponent(title)}`}
          className="block w-full h-full"
        >
          <Image
            src={posterPath ?? ""}
            alt={`${title} poster`}
            fill
            sizes="(max-width: 640px) 96px, 112px"
            className="object-cover transition-transform duration-200 group-hover:scale-105"
          />
        </a>
        {removeAction && (
          <form
            action={removeAction}
            className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-10"
          >
            <input type="hidden" name="movieId" value={String(movieId)} />
            <button
              type="submit"
              className="flex items-center justify-center w-6 h-6 rounded-full bg-black/70 text-white hover:bg-red-700 text-sm leading-none"
              title="Remove from favorites"
            >
              ✕
            </button>
          </form>
        )}
      </div>
      <a href={`/movies/${encodeURIComponent(title)}`}>
        <p className="text-xs font-semibold leading-tight line-clamp-2 hover:text-red-800">
          {title}
        </p>
      </a>
    </div>
  );
}
