// app/components/Navbar.tsx
"use client";

import Link from "next/link";
import type { NavLinks } from "../types/ui";
import Sidebar from "./Sidebar";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFilm,
  faUser,
  faGear,
  faRightFromBracket,
  faShield,
  faHeart,
} from "@fortawesome/free-solid-svg-icons";

type MovieSearchResult = {
  title: string;
  poster_path: string | null;
  release_status: "Now Playing" | "Coming Soon";
};

export default function Navbar() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const links: NavLinks[] = [
    { label: "Find a theater", href: "#" },
    { label: "Movies", href: "http://localhost:3000/movies" },
    { label: "Promos & Rewards", href: "#" },
    { label: "Showtimes", href: "http://localhost:3000/movies/showtimes" },
  ];

  const [isSearching, setIsSearching] = useState(false);
  const [query, setQuery] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement | null>(null);

  const [results, setResults] = useState<MovieSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [showNoMovieFound, setShowNoMovieFound] = useState(false);

  const debounceRef = useRef<number | null>(null);
  const noFoundTimerRef = useRef<number | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const searchRef = useRef<HTMLDivElement | null>(null);

  const trimmed = useMemo(() => query.trim(), [query]);
  const shouldShowDropdown = isSearching && !!trimmed;

  // Close search dropdown when clicking outside the search area
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (!searchRef.current) return;
      if (!searchRef.current.contains(e.target as Node)) {
        setIsSearching(false);
      }
    }

    document.addEventListener("pointerdown", handleClickOutside, {
      passive: true,
    });
    return () =>
      document.removeEventListener("pointerdown", handleClickOutside);
  }, []);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (!profileRef.current) return;
      if (!profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("pointerdown", handleClickOutside, {
      passive: true,
    });
    return () =>
      document.removeEventListener("pointerdown", handleClickOutside);
  }, []);

  // Debounced search
  useEffect(() => {
    if (!trimmed) {
      setResults([]);
      setLoading(false);
      setShowNoMovieFound(false);

      if (debounceRef.current) window.clearTimeout(debounceRef.current);
      if (noFoundTimerRef.current) window.clearTimeout(noFoundTimerRef.current);
      if (abortRef.current) abortRef.current.abort();

      return;
    }

    setLoading(true);
    setShowNoMovieFound(false);

    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(async () => {
      if (abortRef.current) abortRef.current.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const res = await fetch(
          `/api/movieData?q=${encodeURIComponent(trimmed)}`,
          {
            signal: controller.signal,
          },
        );

        if (!res.ok) throw new Error("Search request failed");
        const data: MovieSearchResult[] = await res.json();
        setResults(data);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        if (err?.name !== "AbortError") setResults([]);
      } finally {
        setLoading(false);
      }
    }, 400);

    // Show "No movie found" after ~1 second if no results
    if (noFoundTimerRef.current) window.clearTimeout(noFoundTimerRef.current);
    noFoundTimerRef.current = window.setTimeout(() => {
      setShowNoMovieFound(true);
    }, 1000);

    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
      if (noFoundTimerRef.current) window.clearTimeout(noFoundTimerRef.current);
      if (abortRef.current) abortRef.current.abort();
    };
  }, [trimmed]);

  return (
    <div className="flex flex-col bg-black sticky top-0 z-20">
      <div className="bg-red-800 text-center text-white py-2 text-sm">
        Join us tonight for a never-before-seen R-rated movie at a majorly
        discounted price with Screen Unseen{" "}
        <span className="underline">Get Tickets</span>
      </div>

      <nav className="flex flex-row py-4 text-white items-center gap-4 max-w-6xl mx-auto px-6 w-full">
        <Sidebar navLinks={links} />
        <div className="border p-[0.9]">
          <Link
            href="/"
            className="flex items-center gap-2 border border-white rounded-none py-2 px-3 hover:bg-white/10 transition-all duration-200"
          >
            <FontAwesomeIcon icon={faFilm} className="text-red-400" />
            <span className="font-semibold uppercase tracking-[0.05em] text-sm">
              ReelHouse
            </span>
          </Link>
        </div>

        {/* Search */}
        <div
          ref={searchRef}
          className=" relative z-30 w-full md:w-md sm:max-w-md focus-within:max-w-full focus-within:w-full transition-all duration-300 ease-in-out"
        >
          <div className="rounded-lg bg-[#1d1d1d] flex p-2 px-4">
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setIsSearching(true);
              }}
              onFocus={() => setIsSearching(true)}
              placeholder="Search movies..."
              className=" bg-transparent outline-none w-full"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/search.svg"
              alt="search"
              width={20}
              height={20}
              className="shrink-0"
            />
          </div>

          {shouldShowDropdown && (
            <div className="absolute left-0 right-0 mt-2 bg-white text-black rounded-md overflow-hidden shadow-lg border border-gray-200">
              {loading ? (
                <div className="p-3 text-sm text-gray-600">Searching…</div>
              ) : results.length > 0 ? (
                <ul className="max-h-80 overflow-auto">
                  {results.slice(0, 8).map((m) => (
                    <li key={m.title}>
                      <button
                        type="button"
                        className="w-full text-left flex items-center gap-3 px-3 py-2 hover:bg-gray-100"
                        onMouseDown={() => {
                          router.push(`/movies/${encodeURIComponent(m.title)}`);
                          setIsSearching(false);
                          setQuery("");
                        }}
                      >
                        <div className="w-10 h-14 bg-gray-200 rounded overflow-hidden shrink-0">
                          {m.poster_path ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={m.poster_path}
                              alt={m.title}
                              className="w-full h-full object-cover"
                            />
                          ) : null}
                        </div>

                        <div className="flex flex-col">
                          <span className="font-semibold leading-tight">
                            {m.title}
                          </span>
                          <span className="text-xs text-gray-600">
                            {m.release_status}
                          </span>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : showNoMovieFound ? (
                <div className="p-3 text-sm text-gray-700">No movie found</div>
              ) : (
                <div className="p-3 text-sm text-gray-600">Keep typing…</div>
              )}
            </div>
          )}
        </div>

        {/* Links hide while searching */}
        <div className="hidden md:flex md:flex-row gap-4 items-center">
          {!isSearching &&
            links.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="hover:underline hover:text-red-500 transition-all duration-300 text-nowrap"
              >
                {link.label}
              </Link>
            ))}
        </div>

        <div className="sm:flex flex-row shrink-0 ml-auto capitalize gap-2 hidden items-center">
          {status === "authenticated" ? (
            <div ref={profileRef} className="relative">
              <button
                type="button"
                onClick={() => setProfileOpen((prev) => !prev)}
                className="w-9 h-9 rounded-full bg-neutral-700 flex items-center justify-center hover:bg-neutral-600 transition-colors"
                aria-label="Account menu"
              >
                <FontAwesomeIcon
                  icon={faUser}
                  className="text-neutral-300 text-sm"
                />
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-neutral-900 border border-neutral-700 rounded-xl shadow-xl overflow-hidden z-50">
                  <Link
                    href="/account"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-200 hover:bg-neutral-800 transition-colors"
                  >
                    <FontAwesomeIcon
                      icon={faUser}
                      className="w-4 text-neutral-400"
                    />
                    Profile
                  </Link>
                  {session?.user?.role === "CUSTOMER" && (
                    <Link
                      href="/account/favorites"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-200 hover:bg-neutral-800 transition-colors"
                    >
                      <FontAwesomeIcon
                        icon={faHeart}
                        className="w-4 text-neutral-400"
                      />
                      Favorites
                    </Link>
                  )}
                  <Link
                    href="/settings"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-200 hover:bg-neutral-800 transition-colors"
                  >
                    <FontAwesomeIcon
                      icon={faGear}
                      className="w-4 text-neutral-400"
                    />
                    Settings
                  </Link>
                  {session?.user?.role === "ADMIN" && (
                    <>
                      <div className="border-t border-neutral-700 my-1" />
                      <Link
                        href="/admin"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-200 hover:bg-neutral-800 transition-colors"
                      >
                        <FontAwesomeIcon icon={faShield} className="w-4" />
                        Admin Portal
                      </Link>
                    </>
                  )}
                  <div className="border-t border-neutral-700 my-1" />
                  <button
                    type="button"
                    onClick={() => {
                      setProfileOpen(false);
                      signOut({ callbackUrl: "/" });
                    }}
                    className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-400 hover:bg-neutral-800 transition-colors"
                  >
                    <FontAwesomeIcon
                      icon={faRightFromBracket}
                      className="w-4"
                    />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : status === "unauthenticated" ? (
            <>
              <Link
                href="/signin"
                className="hover:underline hover:text-red-500 transition-colors"
              >
                Log In
              </Link>
              <span>|</span>
              <Link
                href="/signup"
                className="hover:underline hover:text-red-500 transition-colors"
              >
                Sign Up
              </Link>
            </>
          ) : null}
        </div>
      </nav>
    </div>
  );
}
