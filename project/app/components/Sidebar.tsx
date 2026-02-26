"use client";

import { useState } from "react";
import type { NavLinks } from "../types/ui";
import Link from "next/link";
import Image from "next/image";

interface SidebarProps {
  navLinks: NavLinks[];
}

export default function Sidebar({ navLinks }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

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
            <Image
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
        <Image
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
          <div className="mt-auto flex flex-row gap-2">
            <button>Log In</button>
            <span>|</span>
            <button>Sign Up</button>
          </div>
        </div>
      )}
    </div>
  );
}
