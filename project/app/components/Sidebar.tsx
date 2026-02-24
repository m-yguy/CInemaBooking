"use client";

import { useState } from "react";
import type { NavLinks } from "../types/ui";
import Link from "next/link";

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
      className={`${isOpen ? "fixed z-20 min-w-1/2 top-0 left-0 p-10" : "flex"} bg-black md:hidden h-full`}
    >
      {isOpen && (
        <div className="flex justify-between mb-8">
          <div className="border-white border-2">logo</div>
          <button className="border-2 border-white" onClick={toggleSidebar}>
            close
          </button>
        </div>
      )}
      <button
        className={`${isOpen ? "hidden" : "border-2 border-white"}`}
        onClick={toggleSidebar}
      >
        open
      </button>

      {isOpen && (
        <nav className="flex flex-col gap-8">
          {navLinks.map((link) => (
            <Link key={link.label} href={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </div>
  );
}
