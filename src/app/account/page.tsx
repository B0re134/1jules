"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AccountPage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [name, setName] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (session?.user?.name) {
      setName(session.user.name);
    }
  }, [status, session, router]);

  if (status === "loading") {
    return <div className="p-8 text-center">Loading...</div>;
  }

  if (!session) {
    return null;
  }

  const updateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    setMessage("");
    try {
      const res = await fetch("/api/user", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      if (res.ok) {
        setMessage("Profile updated successfully!");
        // Update the session state to reflect the new name immediately
        await update({ name });
      } else {
        setMessage("Failed to update profile.");
      }
    } catch (error) {
      setMessage("An error occurred.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="container mx-auto p-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">User Account</h1>

      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Profile Details</h2>
        <div className="mb-4">
          <span className="text-gray-600 dark:text-gray-400 font-medium">Email:</span>{" "}
          <span className="text-gray-900 dark:text-gray-200">{session.user?.email}</span>
        </div>
        <div className="mb-4">
          <span className="text-gray-600 dark:text-gray-400 font-medium">Role:</span>{" "}
          <span className="text-gray-900 dark:text-gray-200">{(session.user as any)?.role}</span>
        </div>

        <form onSubmit={updateProfile} className="mt-6 space-y-4 border-t pt-6 border-gray-200 dark:border-gray-700">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Update Username
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isUpdating}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {isUpdating ? "Updating..." : "Save Changes"}
          </button>
          {message && <p className="text-sm mt-2 text-green-600 dark:text-green-400">{message}</p>}
        </form>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Saved Reading History</h2>
        <div className="p-4 border border-dashed border-gray-300 dark:border-gray-600 rounded-md text-center text-gray-500 dark:text-gray-400">
          <p>No reading history saved yet.</p>
          <p className="text-sm mt-2">Start reading to see your progress here!</p>
        </div>
      </div>
    </div>
  );
}
