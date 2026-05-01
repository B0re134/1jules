"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";

export default function ProgressTracker({ chapterId }: { chapterId: string }) {
  const { data: session, update } = useSession();

  useEffect(() => {
    // Only track progress if user is logged in
    if (session?.user) {
      fetch("/api/progress", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ chapterId }),
      }).then((res) => {
        if (res.ok) {
           update({ readingProgress: chapterId });
        }
      }).catch(err => console.error("Failed to track progress", err));
    }
  }, [session, chapterId, update]);

  return null;
}
