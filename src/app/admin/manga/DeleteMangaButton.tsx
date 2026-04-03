"use client";

import { deleteManga } from "./actions";

export default function DeleteMangaButton({ mangaId }: { mangaId: string }) {
  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this?")) {
      try {
        await deleteManga(mangaId);
      } catch (e) {
        console.error(e);
        alert("Failed to delete manga.");
      }
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
    >
      Delete
    </button>
  );
}
