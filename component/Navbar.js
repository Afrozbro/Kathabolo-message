"use client";
import React, { useState } from "react";
import { Menu, X } from "lucide-react"; // hamburger icons
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();

  const openpage = (e) => {
    if (e === "Privacy") {
      router.push("/terms&conditions")
    }
    else{
      let page=e
      router.push(page)
    }
  };

  return (
    <nav className="w-full bg-black text-white shadow-md">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Logo Section */}
        <div
          onClick={() => {
            router.push("/");
          }}
          className="flex items-center gap-2 cursor-pointer"
        >
          <img
            src="kotha.png"
            alt="Kotha Logo"
            className="h-10 w-auto object-contain"
          />
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-wide">
            Kathabolo
          </h1>
        </div>

        {/* Desktop Links */}
        <ul className="hidden md:flex gap-8">
          {["Privacy", "Help", "About"].map((item) => (
            <li
              key={item}
              onClick={() => {
                openpage(item);
              }}
              className="text-lg font-medium px-3 py-1 rounded-xl hover:bg-gray-800 transition-all duration-300 cursor-pointer"
            >
              {item}
            </li>
          ))}
        </ul>

        {/* Buttons (Desktop) */}
        <div className="hidden md:flex gap-3">
          {!session ? (
            <button
              onClick={() => router.push("/signin")} // ✅ fixed spelling
              className="w-full sm:w-auto cursor-pointer px-6 py-2.5 rounded-lg text-white font-semibold text-base bg-gradient-to-r from-purple-600 to-blue-500 hover:opacity-90 transition-all duration-200"
            >
              Sign In
            </button>
          ) : (
            <button
              onClick={() => signOut()}
              className="w-full sm:w-auto cursor-pointer px-6 py-2.5 rounded-lg text-white font-semibold text-base bg-gradient-to-r from-purple-600 to-blue-500 hover:opacity-90 transition-all duration-200"
            >
              Sign Out
            </button>
          )}
        </div>

        {/* Hamburger Icon (Mobile) */}
        <div className="md:hidden flex items-center">
          <button onClick={() => setMenuOpen(!menuOpen)} className="p-2">
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden flex flex-col items-center bg-gray-900 text-white space-y-4 py-4 transition-all duration-300">
          {["Privacy", "Help", "About"].map((item) => (
            <button
              key={item}
              onClick={() => {
                openpage(item);
              }}
              className="w-full text-center py-2 text-lg font-medium hover:bg-gray-800 transition-all"
            >
              {item}
            </button>
          ))}

          <div className="flex flex-col w-full items-center gap-3 mt-3">
            {!session ? (
              <button
                onClick={() => router.push("/signin")} // ✅ fixed spelling
                className="w-4/5 py-2 text-sm font-semibold rounded-lg bg-gradient-to-r from-purple-600 to-blue-500 hover:opacity-90 transition-all"
              >
                Sign In
              </button>
            ) : (
              <button
                onClick={() => signOut()}
                className="w-4/5 py-2 text-sm font-semibold rounded-lg bg-gradient-to-r from-purple-600 to-blue-500 hover:opacity-90 transition-all"
              >
                Sign Out
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
