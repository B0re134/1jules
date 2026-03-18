import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-gray-800 text-white p-4 shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="text-xl font-bold">
          MangaVault
        </Link>
        <div className="space-x-4">
          <Link href="/" className="hover:text-gray-300">
            Read
          </Link>
          <Link href="/community" className="hover:text-gray-300">
            Community
          </Link>
          <Link href="/admin" className="hover:text-gray-300">
            Admin
          </Link>
        </div>
      </div>
    </nav>
  );
}
