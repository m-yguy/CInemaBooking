import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Navbar from "../components/Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers, faFilm } from "@fortawesome/free-solid-svg-icons";
import AdminMoviesCard from "@/app/components/AdminMoviesCard";
import AdminShowtimesCard from "@/app/components/AdminShowtimesCard";
import AdminPromotionsCard from "@/app/components/AdminPromotionsCard";

export default async function AdminPortalPage() {
  const session = await auth();

  if (!session || session.user.role !== "ADMIN") {
    redirect("/");
  }

  const staticSections = [
    {
      label: "Manage Users",
      description: "View and manage user accounts",
      icon: faUsers,
      href: "#",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 max-w-2xl mx-auto w-full px-6 mt-24">
        <h1 className="text-3xl font-bold mb-8">Admin Portal</h1>

        <div className="grid grid-cols-2 gap-4">
          <AdminMoviesCard icon={faFilm} />
          <AdminShowtimesCard />
          <AdminPromotionsCard />

          {staticSections.map((s) => (
            <a
              key={s.label}
              href={s.href}
              className="bg-neutral-900 text-white rounded-xl p-6 flex flex-col gap-3 hover:bg-neutral-800 transition-colors"
            >
              <FontAwesomeIcon icon={s.icon} className="text-2xl w-6 h-6" />
              <span className="font-semibold text-lg">{s.label}</span>
              <span className="text-neutral-400 text-sm">{s.description}</span>
            </a>
          ))}
        </div>
      </main>
    </div>
  );
}
