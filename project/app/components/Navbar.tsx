import Link from "next/link";
import type { NavLinks } from "../types/ui";
import Sidebar from "./Sidebar";
import { useState } from "react";

export default function Navbar() {
  const links: NavLinks[] = [
    { label: "Find a theater", href: "#" },
    { label: "Movies", href: "#" },
    { label: "Promos & Rewards", href: "#" },
    { label: "Showtimes", href: "#" },
  ];

  const [isSearching, setIsSearching] = useState(false);
  const [query, setQuery] = useState("");

  return (
    <div className="flex flex-col bg-black sticky top-0 z-20">
      <div className="bg-red-800 text-center text-white py-2 text-sm">
        Join us tonight for a never-before-seen R-rated movie at a majorly
        discounted price with Screen Unseen{" "}
        <span className="underline">Get Tickets</span>
      </div>
      <nav className="flex flex-row py-4 text-white items-center gap-4 max-w-6xl mx-auto px-6 w-full">
        <Sidebar navLinks={links} />
        <p className="border-2">Logo</p>
        <div
          className="rounded-sm border-white border-2 bg-black focus-within:w-full"
          onBlur={() => setIsSearching(false)}
        >
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsSearching(true)}
            placeholder="Search"
            className="px-2 py-1 bg-transparent outline-none w-full"
          />
        </div>
        <div className="hidden md:flex md:flex-row gap-4 items-center">
          {!isSearching &&
            links.map((link) => (
              <Link key={link.label} href={link.href}>
                {link.label}
              </Link>
            ))}
        </div>
        <div className="flex flex-row shrink-0 ml-auto capitalize gap-2">
          <button>Log In</button>
          <span>|</span>
          <button>Sign Up</button>
        </div>
      </nav>
    </div>
  );
}
