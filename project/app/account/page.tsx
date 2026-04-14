import ChangePasswordSection from "../components/ChangePasswordSection";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Navbar from "../components/Navbar";
import SignOutButton from "../components/SignOutButton";
import UpdateProfileForm from "../components/UpdateProfileForm";
import FavoriteMovieCard from "../components/FavoriteMovieCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import {
  updateProfile,
  changePassword,
  notifyProfileChange,
  removeFavoriteAction,
  getAccountPageData,
} from "@/app/actions/accountActions";

export default async function AccountPage() {
  const session = await auth();

  if (!session) redirect("/signin");

  const userId = session.user.id;

  const { user, isCustomer, addressRow, savedCards, favoriteMovies } =
    await getAccountPageData(userId);

  return (
    <div className="min-h-screen bg-white text-black">
      <Navbar />

      <main className="mx-auto w-full max-w-4xl px-6 pt-28 pb-16">
        <h1 className="mb-10 text-4xl font-bold flex items-center gap-4">
          <span className="w-16 h-16 flex items-center justify-center rounded-full bg-black">
            <FontAwesomeIcon icon={faUser} className="text-white w-9 h-9" />
          </span>
          Account
        </h1>

        <div className="space-y-12">
          <section className="border-b border-gray-200 pb-12">
            <h2 className="mb-6 text-2xl font-bold">General Info</h2>

            <UpdateProfileForm
              firstName={user?.first_name ?? ""}
              lastName={user?.last_name ?? ""}
              email={user?.email ?? session.user.email ?? ""}
              phone={user?.phone_number ?? ""}
              addressLine1={addressRow?.address_line_1 ?? ""}
              addressLine2={addressRow?.address_line_2 ?? ""}
              city={addressRow?.city ?? ""}
              state={addressRow?.state ?? ""}
              postalCode={addressRow?.postal_code ?? ""}
              country={addressRow?.country?.trim() ?? ""}
              isCustomer={isCustomer}
              mailingAddressId={addressRow?.id ?? null}
              savedCards={savedCards}
              action={updateProfile}
              notifyAction={notifyProfileChange}
            />
          </section>

          {isCustomer && (
            <section className="border-b border-gray-200 pb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Favorites</h2>
                {favoriteMovies.length > 0 && (
                  <a
                    href="/account/favorites"
                    className="text-sm font-semibold text-red-800 hover:underline"
                  >
                    See all ({favoriteMovies.length})
                  </a>
                )}
              </div>
              {favoriteMovies.length === 0 ? (
                <p className="text-gray-500">No favorites yet.</p>
              ) : (
                <div className="grid grid-cols-7 gap-4">
                  {favoriteMovies.slice(0, 7).map((movie) => (
                    <div key={movie.movie_id}>
                      <FavoriteMovieCard
                        movieId={movie.movie_id}
                        title={movie.title}
                        posterPath={movie.poster_path}
                        removeAction={removeFavoriteAction}
                      />
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          <section>
            <ChangePasswordSection action={changePassword} />
          </section>

          <div className="pt-4">
            <SignOutButton />
          </div>
        </div>
      </main>
    </div>
  );
}
