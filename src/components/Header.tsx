"use client";

import React, { useState } from "react";
import { removeItem } from "@/utils/storage";
import { deleteCookie } from "cookies-next";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    removeItem("user");
    deleteCookie("user");
    router.push("/");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-gradient-to-br text-white from-black via-[#060C21] to-black animate-gradient-x shadow-sm border-b border-b-gray-50">
      <div className="py-4 md:py-5 max-w-[85%] mx-auto">
        <div className="flex justify-between items-center">
          <Link
            href="/companies"
            className="text-lg md:text-xl lg:text-2xl font-bold truncate pr-4 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent"
          >
            FE-2024-12-i - Companies App
          </Link>

          <button
            onClick={toggleMenu}
            className="md:hidden p-2 hover:bg-gray-800 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex gap-4">
            <Link
              href="/company"
              className="bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 px-6 py-2.5 rounded-lg transition-colors duration-200 font-medium flex items-center gap-2"
            >
              Create Company
            </Link>
            <button
              onClick={handleLogout}
              className="bg-red-500/10 hover:bg-red-500/20 text-red-400 px-6 py-2.5 rounded-lg transition-colors duration-200 font-medium flex items-center gap-2"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-2 space-y-3">
            <Link
              href="/company"
              className="block bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors text-center"
              onClick={() => setIsMenuOpen(false)}
            >
              Create Company
            </Link>
            <button
              onClick={() => {
                handleLogout();
                setIsMenuOpen(false);
              }}
              className="w-full bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
