import ChangePasswordSection from "../components/ChangePasswordSection";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Navbar from "../components/Navbar";
import SignOutButton from "../components/SignOutButton";
import UpdateProfileForm from "../components/UpdateProfileForm";
import FavoriteMovieCard from "@/app/components/FavoriteMovieCard";
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
                <div className="grid grid-cols-7 gap-x-4 gap-y-6">
                  {favoriteMovies.slice(0, 7).map((movie) => (
                    <FavoriteMovieCard
                      key={movie.movie_id}
                      movieId={movie.movie_id}
                      title={movie.title}
                      posterPath={movie.poster_path}
                      removeAction={removeFavoriteAction}
                    />
                  ))}
                </div>
              )}
            </section>
          )}

          {isCustomer && (
            <section className="border-b border-gray-200 pb-12">
              <h2 className="mb-2 text-2xl font-bold">Order History</h2>

              {!orderHistory || orderHistory.length === 0 ? (
                <p className="text-gray-500">No orders yet.</p>
              ) : (
                <div className="space-y-2 max-h-[14.5rem] overflow-y-auto pr-2">
                  {orderHistory.map((order) => (
                    <a
                      key={order.orderId}
                      href={`/account/orders/${order.orderId}`}
                      className="group flex h-28 gap-2 overflow-hidden rounded-2xl border border-gray-200 bg-white px-2 py-2 text-left shadow-sm transition hover:shadow-md"
                    >
                      <div className="relative h-full w-24 shrink-0 overflow-hidden rounded-xl bg-gray-200">
                        {order.posterUrl ? (
                          <img
                            src={order.posterUrl}
                            alt={order.movieTitle}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center px-3 text-center text-sm text-gray-500">
                            No Poster
                          </div>
                        )}
                      </div>

                      <div className="flex flex-1 flex-col justify-between">
                        <div>
                          <p className="text-base font-semibold text-slate-900">
                            {order.movieTitle}
                          </p>
                          <p className="mt-1 text-xs text-gray-500">
                            {new Date(order.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              },
                            )}{" "}
                            • {order.showTime}
                          </p>
                          <p className="mt-1 text-xs text-gray-500">
                            Seats: {order.seats.join(", ")}
                          </p>
                        </div>

                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span className="font-semibold text-slate-900">
                            ${order.finalTotal.toFixed(2)}
                          </span>
                          <div className="text-right">
                            <p>{order.status}</p>
                            <p className="text-[11px] text-gray-400">
                              Click for details
                            </p>
                          </div>
                        </div>
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
      <footer className="bg-black p-8 text-white text-center items-center">
        <span className="tracking-[0.35em] uppercase">REELHOUSE</span>
      </footer>
    </div>
  );
}
