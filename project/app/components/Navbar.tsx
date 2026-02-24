import Link from "next/link";
import type { NavLinks } from "../types/ui";
import Sidebar from "./Sidebar";

export default function Navbar() {
  const links: NavLinks[] = [
    { label: "Find a theater", href: "#" },
    { label: "Movies", href: "#" },
    { label: "Promos & Rewards", href: "#" },
    { label: "Showtimes", href: "#" },
    { label: "Login", href: "#" },
  ];

  return (
    <nav className="flex flex-row bg-black h-16 text-white items-center gap-4 px-4">
      <Sidebar navLinks={links} />
      <p>Logo Placeholder</p>
      <input
        type="text"
        placeholder="Search for a movie"
        className="border border-white p-2"
      />
      <div className="hidden sm:(flex flex-row gap-4 items-center)">
        {links.map((link) => (
          <Link key={link.label} href={link.href}>
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
