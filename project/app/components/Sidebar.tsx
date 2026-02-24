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
    <div className={`${isOpen ? "absolute" : "flex"} bg-black left-0 top-0`}>
      <button className="border-2 border-white" onClick={toggleSidebar}>
        {isOpen ? "close" : "open"}
      </button>

      {isOpen && (
        <nav className="flex flex-col">
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
