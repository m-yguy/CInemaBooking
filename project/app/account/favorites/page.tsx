import { redirect } from "next/navigation";
import { auth } from "@/auth";
import Navbar from "@/app/components/Navbar";
import FavoriteMovieCard from "@/app/components/FavoriteMovieCard";
import { getFavoriteMovieList } from "@/lib/services/favoriteService";
import { removeFavoriteAction } from "@/app/actions/accountActions";

export default async function FavoritesPage() {
  const session = await auth();
  if (!session?.user) redirect("/signin");

  const userId = session.user.id;
  const role = session.user.role;
  const isCustomer = role === "CUSTOMER";

  if (!isCustomer) redirect("/account");

  const favoriteMovies = await getFavoriteMovieList(userId);

  async function removeFromFavoritesPage(formData: FormData) {
    "use server";
    await removeFavoriteAction(formData, "/account/favorites");
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <main className="flex-1 mx-auto max-w-5xl px-6 py-12">
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
                removeAction={removeFromFavoritesPage}
              />
            ))}
          </div>
        )}
      </main>
      <footer className="bg-black p-8 text-white text-center items-center">
        <span className="tracking-[0.35em] uppercase">REELHOUSE</span>
      </footer>
    </div>
  );
}
