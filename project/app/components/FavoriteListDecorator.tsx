import MovieCard, { type MovieCardData } from "./MovieCard";

interface FavoriteListDecoratorProps {
  movieData: MovieCardData;
  removeAction?: (formData: FormData) => Promise<void> | void;
}

export default function FavoriteListDecorator({
  movieData,
  removeAction,
}: FavoriteListDecoratorProps) {
  return (
    <MovieCard
      movieData={movieData}
      showMovieInfo={false}
      className="group w-full mb-0 hover:scale-100"
      titleClassName="!text-[1rem] !leading-tight tracking-tight hover:text-red-800"
      imageClassName="transition-transform duration-200 group-hover:scale-100"
      imageSizes="(max-width: 640px) 96px, 112px"
      posterOverlay={
        removeAction ? (
          <form
            action={removeAction}
            className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-10"
          >
            <input
              type="hidden"
              name="movieId"
              value={String(movieData.movie_id)}
            />
            <button
              type="submit"
              className="flex items-center justify-center w-6 h-6 rounded-full bg-black/70 text-white hover:bg-red-700 text-sm leading-none"
              title="Remove from favorites"
            >
              x
            </button>
          </form>
        ) : null
      }
    />
  );
}
