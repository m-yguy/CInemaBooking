import ChangePasswordSection from "../components/ChangePasswordSection";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Navbar from "../components/Navbar";
import SignOutButton from "../components/SignOutButton";
import UpdateProfileForm from "../components/UpdateProfileForm";
import FavoriteMovieCard from "../components/FavoriteMovieCard";
import { sql } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { hashPassword, comparePassword } from "@/lib/security";
import { sendPasswordChangedEmail, sendProfileUpdatedEmail } from "@/lib/mail";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

export default async function AccountPage() {
  const session = await auth();

  if (!session) redirect("/signin");

  const userId = session.user.id;

  const users = await sql`
    SELECT first_name, last_name, email, phone_number, user_type
    FROM users
    WHERE user_id = ${userId}
    LIMIT 1
  `;

  const user = users[0];
  const isCustomer = user?.user_type === "CUSTOMER";

  const addressRows = isCustomer
    ? await sql`
        SELECT address_line_1, address_line_2, city, state, postal_code, country
        FROM public.mailing_address
        WHERE customer_id = ${userId}
        LIMIT 1
      `
    : [];

  const addressRow = addressRows[0] ?? null;

  const favoriteMovies = isCustomer
    ? await sql`
        SELECT
          m.movie_id,
          m.movie_name AS title,
          m.category AS genre,
          m.average_rating AS rating,
          m.synopsis AS movie_description,
          m.trailer_image AS poster_path,
          COALESCE(MIN(s.date), NOW()) AS showtime,
          m.trailer AS trailer_link,
          CASE
            WHEN m.release_status = 'NOW_PLAYING' THEN 'Now Playing'
            WHEN m.release_status = 'COMING_SOON' THEN 'Coming Soon'
            ELSE 'Now Playing'
          END AS release_status,
          m.mpaa_us::text AS mpa_rating,
          COALESCE(string_agg(DISTINCT a.actor_name, ', '), '') AS movie_cast,
          COALESCE(string_agg(DISTINCT d.director_name, ', '), '') AS director,
          COALESCE(string_agg(DISTINCT p.producer_name, ', '), '') AS producer,
          m.runtime
        FROM movies m
        JOIN customer_favorite_movies f ON f.movie_id = m.movie_id
        LEFT JOIN showtimes s ON s.movie_id = m.movie_id
        LEFT JOIN movie_casts mc ON mc.movie_id = m.movie_id
        LEFT JOIN actors a ON a.actor_id = mc.actor_id
        LEFT JOIN movie_directors md ON md.movie_id = m.movie_id
        LEFT JOIN directors d ON d.director_id = md.director_id
        LEFT JOIN movie_producers mp ON mp.movie_id = m.movie_id
        LEFT JOIN producers p ON p.producer_id = mp.producer_id
        WHERE f.customer_id = ${userId}
        GROUP BY m.movie_id
        ORDER BY m.movie_name ASC
      `
    : [];

  async function updateProfile(formData: FormData) {
    "use server";

    const firstName = (formData.get("firstName") as string)?.trim();
    const lastName = (formData.get("lastName") as string)?.trim();
    const phone = (formData.get("phone") as string)?.trim();

    try {
      await sql`
        UPDATE users
        SET first_name = ${firstName},
            last_name = ${lastName},
            phone_number = ${phone}
        WHERE user_id = ${userId}
      `;
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      if (msg.includes("phone_number")) {
        return { error: "That phone number is already in use" };
      }
      throw e;
    }

    if (isCustomer) {
      const addressLine1 =
        (formData.get("addressLine1") as string)?.trim() ?? "";
      const addressLine2 =
        (formData.get("addressLine2") as string)?.trim() || null;
      const city = (formData.get("city") as string)?.trim() ?? "";
      const state = (formData.get("state") as string)?.trim() ?? "";
      const postalCode = (formData.get("postalCode") as string)?.trim() ?? "";
      const country =
        (formData.get("country") as string)?.trim().toUpperCase() || "US";
      if (addressLine1 || city) {
        const updated = await sql`
          UPDATE public.mailing_address
          SET address_line_1 = ${addressLine1},
              address_line_2 = ${addressLine2},
              city = ${city},
              state = ${state},
              postal_code = ${postalCode},
              country = ${country},
              updated_at = now()
          WHERE customer_id = ${userId}
          RETURNING id
        `;
        if (updated.length === 0) {
          await sql`
            INSERT INTO public.mailing_address (customer_id, address_line_1, address_line_2, city, state, postal_code, country)
            VALUES (${userId}, ${addressLine1}, ${addressLine2}, ${city}, ${state}, ${postalCode}, ${country})
          `;
        }
      }
    }

    revalidatePath("/account");
  }

  async function changePassword(formData: FormData) {
    "use server";

    const currentPassword = formData.get("currentPassword") as string;
    const newPassword = formData.get("newPassword") as string;

    if (!currentPassword) return { error: "Enter current password" };
    if (!newPassword) return { error: "New password cannot be empty" };

    if (newPassword.length < 8)
      return { error: "New password must be at least 8 characters" };

    const rows =
      await sql`SELECT password FROM users WHERE user_id = ${userId} LIMIT 1`;
    const stored = rows[0];

    if (!stored?.password) return { error: "No password set on this account" };

    const isValid = await comparePassword(currentPassword, stored.password);
    if (!isValid) return { error: "Password is incorrect" };

    const hashed = await hashPassword(newPassword);
    await sql`UPDATE users SET password = ${hashed} WHERE user_id = ${userId}`;

    await sendPasswordChangedEmail(
      user.email ?? "",
      user.first_name ?? "there",
    );

    return {};
  }

  async function notifyProfileChange(changes: string[]) {
    "use server";
    await sendProfileUpdatedEmail(
      user.email ?? "",
      user.first_name ?? "there",
      changes,
    );
  }

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
