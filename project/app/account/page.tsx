import ChangePasswordSection from "../components/ChangePasswordSection";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Navbar from "../components/Navbar";
import SignOutButton from "../components/SignOutButton";
import UpdateProfileForm from "../components/UpdateProfileForm";
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

  const {
    user,
    isCustomer,
    addressRow,
    savedCards,
    favoriteMovies,
    orderHistory,
  } = await getAccountPageData(userId);

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
                <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4">
                  {favoriteMovies.slice(0, 4).map((movie) => (
                    <a
                      key={movie.movie_id}
                      href={`/movies/${encodeURIComponent(movie.title)}`}
                      className="group"
                    >
                      <div className="relative aspect-2/3 overflow-hidden rounded-lg bg-gray-200 shadow-sm transition-transform group-hover:scale-105">
                        {movie.poster_path ? (
                          <img
                            src={movie.poster_path}
                            alt={movie.title}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center px-4 text-center text-sm text-gray-500">
                            No Poster
                          </div>
                        )}
                      </div>

                      <div className="mt-3">
                        <p className="line-clamp-1 font-semibold">{movie.title}</p>
                      </div>
                    </a>
                  ))}
                </div>
              )}
            </section>
          )}

          {isCustomer && (
            <section className="border-b border-gray-200 pb-12">
              <h2 className="mb-6 text-2xl font-bold">Order History</h2>

              {!orderHistory || orderHistory.length === 0 ? (
                <p className="text-gray-500">No orders yet.</p>
              ) : (
                <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4">
                  {orderHistory.map((order) => (
                    <a
                      key={order.orderId}
                      href={`/account/orders/${order.orderId}`}
                      className="group"
                    >
                      <div className="relative aspect-2/3 overflow-hidden rounded-lg bg-gray-200 shadow-sm transition-transform group-hover:scale-105">
                        {order.posterUrl ? (
                          <img
                            src={order.posterUrl}
                            alt={order.movieTitle}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center px-4 text-center text-sm text-gray-500">
                            No Poster
                          </div>
                        )}
                      </div>

                      <div className="mt-3">
                        <p className="line-clamp-1 font-semibold">
                          {order.movieTitle}
                        </p>
                        <p className="text-sm text-gray-500">
                          ${order.finalTotal.toFixed(2)}
                        </p>
                      </div>
                    </a>
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
