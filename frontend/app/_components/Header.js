"use client";

import Link from "next/link";
import { useAuth } from "../_context/AuthContext";
import { useLang } from "../_context/LanguageContext";

export default function Header() {
  const { user } = useAuth();
  const { lang, toggle } = useLang();

  return (
    <header className="bg-gray-800 text-white">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-lg font-semibold">
          EventBookingSystem
        </Link>

        <div className="flex items-center gap-4">
          <button
            onClick={toggle}
            className="px-2 py-1 border rounded text-xs hover:bg-gray-700"
          >
            {lang.toUpperCase()}
          </button>

          {user ? (
            <>
              <Link
                href="/profile"
                className="flex items-center gap-2 hover:opacity-80"
              >
                {user.avatarUrl && (
                  <img
                    src={user.avatarUrl}
                    alt={user.username}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                )}
                <span>{user.username}</span>
              </Link>

              {user.role === "admin" && (
                <Link
                  href="/admin"
                  className="px-2 py-1 bg-yellow-500 text-xs rounded hover:bg-yellow-600"
                >
                  Admin
                </Link>
              )}
            </>
          ) : (
            <div className="flex gap-3">
              <Link
                href="/login"
                className="bg-indigo-600 hover:bg-indigo-700 px-3 py-1 rounded text-sm"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="border border-white/50 px-3 py-1 rounded text-sm"
              >
                Signup
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
