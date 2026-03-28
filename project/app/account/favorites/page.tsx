import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { sql } from "@/lib/db";
import Navbar from "@/app/components/Navbar";
import FavoriteMovieCard from "@/app/components/FavoriteMovieCard";

export default async function FavoritesPage() {
  const session = await auth();
  if (!session?.user) redirect("/signin");

  const userId = session.user.id;
  const role = session.user.role;
  const isCustomer = role === "CUSTOMER";

  if (!isCustomer) redirect("/account");

  async function removeFavorite(formData: FormData) {
    "use server";
    const movieId = formData.get("movieId") as string;
    if (!movieId) return;
    await sql`
      DELETE FROM customer_favorite_movies
      WHERE customer_id = ${userId} AND movie_id = ${parseInt(movieId)}
    `;
    const { revalidatePath } = await import("next/cache");
    revalidatePath("/account/favorites");
  }

  const favoriteMovies = await sql`
    SELECT
      m.movie_id,
      m.movie_name AS title,
      m.trailer_image AS poster_path
    FROM movies m
    JOIN customer_favorite_movies f ON f.movie_id = m.movie_id
    WHERE f.customer_id = ${userId}
    ORDER BY m.movie_name ASC
  `;

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="mx-auto max-w-5xl px-6 py-12">
        <div className="mb-8 flex items-center gap-4">
          <a
            href="/account"
            className="text-sm font-semibold text-red-800 hover:underline"
          >
            ← Back to Account
          </a>
        </div>
        <h1 className="mb-8 text-3xl font-bold">My Favorites</h1>
        {favoriteMovies.length === 0 ? (
          <p className="text-gray-500">No favorites yet.</p>
        ) : (
          <div className="grid grid-cols-7 gap-x-4 gap-y-6">
            {favoriteMovies.map((movie) => (
              <FavoriteMovieCard
                key={movie.movie_id}
                movieId={movie.movie_id}
                title={movie.title}
                posterPath={movie.poster_path}
                removeAction={removeFavorite}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
