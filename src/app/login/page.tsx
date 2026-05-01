"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [data, setData] = useState({ email: "", password: "" });

  const loginUser = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await signIn("credentials", {
      ...data,
      redirect: false,
    });

    if (result?.ok) {
      router.push("/");
    } else {
      console.error("Login failed");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="bg-white dark:bg-gray-800 p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-white">Log In</h2>
        <form onSubmit={loginUser} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={data.email}
            onChange={(e) => setData({ ...data, email: e.target.value })}
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={data.password}
            onChange={(e) => setData({ ...data, password: e.target.value })}
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition duration-200"
          >
            Log In
          </button>
        </form>

        <div className="mt-6 flex items-center justify-between">
          <span className="border-b w-1/5 lg:w-1/4"></span>
          <span className="text-xs text-center text-gray-500 uppercase">or login with</span>
          <span className="border-b w-1/5 lg:w-1/4"></span>
        </div>

        <div className="flex justify-between space-x-2 mt-4">
          <button
            onClick={() => signIn("google", { callbackUrl: "/" })}
            className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 transition duration-200"
          >
            Google
          </button>
          <button
            onClick={() => signIn("discord", { callbackUrl: "/" })}
            className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition duration-200"
          >
            Discord
          </button>
        </div>

        <div className="mt-4 text-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">Don't have an account? </span>
            <Link href="/register" className="text-sm text-blue-600 hover:underline">Sign up</Link>
        </div>
      </div>
    </div>
  );
}
