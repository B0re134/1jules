"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="bg-gray-800 text-white p-4 shadow-md relative z-50">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="text-xl font-bold">
          MangaVault
        </Link>
        <div className="flex items-center space-x-4">
          <Link href="/" className="hover:text-gray-300">
            Read
          </Link>
          <Link href="/community" className="hover:text-gray-300">
            Community
          </Link>
          {(session?.user as any)?.role === "ADMIN" && (
            <Link href="/admin" className="hover:text-gray-300">
              Admin
            </Link>
          )}

          <div className="pl-4 border-l border-gray-600">
            {session ? (
              <div className="group relative">
                <button className="flex items-center space-x-2 hover:text-gray-300 focus:outline-none">
                  <span>{session.user?.name || session.user?.email}</span>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                  <Link
                    href="/account"
                    className="block px-4 py-2 hover:bg-gray-100 rounded-t-md"
                  >
                    Account
                  </Link>
                  <button
                    onClick={() => signOut()}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 rounded-b-md text-red-600"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-x-4">
                <Link href="/login" className="hover:text-gray-300">
                  Login
                </Link>
                <Link
                  href="/register"
                  className="bg-blue-600 px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
