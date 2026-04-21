import FavoriteListDecorator from "./FavoriteListDecorator";

interface FavoriteMovieCardProps {
  movieId: number | string;
  title: string;
  posterPath: string | null;
  removeAction?: (formData: FormData) => Promise<void> | void;
}

export default function FavoriteMovieCard({
  movieId,
  title,
  posterPath,
  removeAction,
}: FavoriteMovieCardProps) {
  return (
    <FavoriteListDecorator
      movieData={{
        movie_id: Number(movieId),
        title,
        poster_path: posterPath ?? "",
      }}
      removeAction={removeAction}
    />
  );
}
