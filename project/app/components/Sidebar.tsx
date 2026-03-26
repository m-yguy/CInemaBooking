"use client";

import { useState } from "react";
import type { NavLinks } from "../types/ui";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faGear,
  faRightFromBracket,
  faShield,
} from "@fortawesome/free-solid-svg-icons";

interface SidebarProps {
  navLinks: NavLinks[];
}

export default function Sidebar({ navLinks }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { status, data: session } = useSession();

  const toggleSidebar = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div
      className={`${
        isOpen
          ? "fixed z-50 min-w-1/2 top-0 left-0 p-10 flex flex-col h-dvh"
          : "flex"
      } bg-black md:hidden`}
    >
      {isOpen && (
        <div className="flex justify-between mb-8">
          <div className="border-white border-2">logo</div>
          <button onClick={toggleSidebar}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/close.svg"
              width={25}
              height={25}
              alt="close menu"
              className="hover:scale-110 transition-all duration-200 ease-in-out cursor-pointer"
            />
          </button>
        </div>
      )}
      <button
        className={`${isOpen ? "hidden" : "shrink-0 mr-10"}`}
        onClick={toggleSidebar}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/menu.svg"
          width={40}
          height={40}
          alt="Open Menu"
          className="transition-all hover:scale-90 duration-200 ease-in-out cursor-pointer"
        />
      </button>

      {isOpen && (
        <div className="flex flex-col gap-8 flex-1">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="transition-all duration-200 hover:underline hover:text-red-500"
            >
              {link.label}
            </Link>
          ))}

          <div className="mt-auto flex flex-col gap-3">
            {status === "authenticated" ? (
              <>
                {/* Profile icon + name */}
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-9 h-9 rounded-full bg-neutral-700 flex items-center justify-center shrink-0">
                    <FontAwesomeIcon
                      icon={faUser}
                      className="text-white text-sm"
                    />
                  </div>
                  <span className="text-sm text-neutral-300 truncate">
                    {session?.user?.name}
                  </span>
                </div>

                <Link
                  href="/account"
                  onClick={toggleSidebar}
                  className="flex items-center gap-3 text-sm text-neutral-200 hover:text-white transition-colors"
                >
                  <FontAwesomeIcon
                    icon={faUser}
                    className="w-4 text-neutral-400"
                  />
                  Profile
                </Link>

                <Link
                  href="/settings"
                  onClick={toggleSidebar}
                  className="flex items-center gap-3 text-sm text-neutral-200 hover:text-white transition-colors"
                >
                  <FontAwesomeIcon
                    icon={faGear}
                    className="w-4 text-neutral-400"
                  />
                  Settings
                </Link>

                {session?.user?.role === "ADMIN" && (
                  <Link
                    href="/admin"
                    onClick={toggleSidebar}
                    className="flex items-center gap-3 text-sm text-neutral-200 hover:text-white transition-colors"
                  >
                    <FontAwesomeIcon icon={faShield} className="w-4" />
                    Admin Portal
                  </Link>
                )}

                <div className="border-t border-neutral-700 my-1" />

                <button
                  type="button"
                  onClick={() => {
                    toggleSidebar();
                    signOut({ callbackUrl: "/" });
                  }}
                  className="flex items-center gap-3 text-sm text-red-400 hover:text-red-300 transition-colors"
                >
                  <FontAwesomeIcon icon={faRightFromBracket} className="w-4" />
                  Sign Out
                </button>
              </>
            ) : status === "unauthenticated" ? (
              <div className="flex flex-row gap-2">
                <Link href="/signin" onClick={toggleSidebar}>
                  Log In
                </Link>
                <span>|</span>
                <Link href="/signup" onClick={toggleSidebar}>
                  Sign Up
                </Link>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
