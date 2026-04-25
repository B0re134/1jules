"use client";

import { useState, useEffect } from "react";
import { useReaderSettings } from "@/hooks/useReaderSettings";
import { incrementViewCount } from "./actions";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ReaderUI({
  chapterId,
  contentId,
  contentTitle,
  chapterNumber,
  chapterTitle,
  pages,
  prevChapterId,
  nextChapterId,
}: {
  chapterId: string;
  contentId: string;
  contentTitle: string;
  chapterNumber: number;
  chapterTitle: string | null;
  pages: string[];
  prevChapterId: string | null;
  nextChapterId: string | null;
}) {
  const { settings, updateSettings, isLoaded } = useReaderSettings();
  const [showSettings, setShowSettings] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const router = useRouter();

  useEffect(() => {
    // Increment view count exactly once when the component mounts
    const hasViewed = sessionStorage.getItem(`viewed_${chapterId}`);
    if (!hasViewed) {
      incrementViewCount(contentId).then(() => {
        sessionStorage.setItem(`viewed_${chapterId}`, "true");
      });
    }
  }, [chapterId, contentId]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in an input (though unlikely here)
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (e.key === "ArrowRight") {
        if (settings.readingDirection === "Single" && currentPage < pages.length - 1) {
          setCurrentPage((prev) => prev + 1);
        } else if (nextChapterId) {
          router.push(`/read/${nextChapterId}`);
        }
      } else if (e.key === "ArrowLeft") {
        if (settings.readingDirection === "Single" && currentPage > 0) {
          setCurrentPage((prev) => prev - 1);
        } else if (prevChapterId) {
          router.push(`/read/${prevChapterId}`);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [settings.readingDirection, currentPage, pages.length, nextChapterId, prevChapterId, router]);

  if (!isLoaded) return null; // Avoid hydration mismatch

  return (
    <div className="min-h-screen pb-12 bg-gray-100 dark:bg-gray-900">
      {/* Top Navigation Bar */}
      <div className="sticky top-0 z-40 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-b dark:border-gray-700 shadow-sm">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link
            href={`/content/${contentId}`}
            className="text-blue-600 dark:text-blue-400 hover:underline flex items-center space-x-1"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="hidden sm:inline">Back to {contentTitle}</span>
            <span className="sm:hidden">Back</span>
          </Link>
          <div className="text-center flex-1 mx-4 truncate">
            <h1 className="font-semibold text-lg dark:text-white truncate">
              Chapter {chapterNumber} {chapterTitle ? `- ${chapterTitle}` : ""}
            </h1>
          </div>
          <div className="flex space-x-2 items-center">
            {/* Settings Toggle */}
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition"
              aria-label="Settings"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>

            {prevChapterId ? (
              <Link
                href={`/read/${prevChapterId}`}
                className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition"
              >
                Prev
              </Link>
            ) : (
              <span className="px-3 py-1 text-gray-400 dark:text-gray-500 cursor-not-allowed">Prev</span>
            )}
            {nextChapterId ? (
              <Link
                href={`/read/${nextChapterId}`}
                className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                Next
              </Link>
            ) : (
              <span className="px-3 py-1 text-gray-400 dark:text-gray-500 cursor-not-allowed">Next</span>
            )}
          </div>
        </div>
      </div>

      {/* Settings Modal/Drawer */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowSettings(false)}>
          <div
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-80"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
          >
            <h3 className="text-xl font-bold mb-4 dark:text-white border-b dark:border-gray-700 pb-2">Reader Settings</h3>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Reading Direction</label>
              <div className="flex space-x-2">
                <button
                  onClick={() => updateSettings({ readingDirection: "Vertical" })}
                  className={`flex-1 py-2 text-sm rounded ${settings.readingDirection === "Vertical" ? "bg-blue-600 text-white" : "bg-gray-200 dark:bg-gray-700 dark:text-gray-300"}`}
                >
                  Vertical Scroll
                </button>
                <button
                  onClick={() => updateSettings({ readingDirection: "Single" })}
                  className={`flex-1 py-2 text-sm rounded ${settings.readingDirection === "Single" ? "bg-blue-600 text-white" : "bg-gray-200 dark:bg-gray-700 dark:text-gray-300"}`}
                >
                  Single Page
                </button>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Image Fit</label>
              <div className="flex space-x-2">
                <button
                  onClick={() => updateSettings({ imageFit: "Width" })}
                  className={`flex-1 py-2 text-sm rounded ${settings.imageFit === "Width" ? "bg-blue-600 text-white" : "bg-gray-200 dark:bg-gray-700 dark:text-gray-300"}`}
                >
                  Fit Width
                </button>
                <button
                  onClick={() => updateSettings({ imageFit: "Height" })}
                  className={`flex-1 py-2 text-sm rounded ${settings.imageFit === "Height" ? "bg-blue-600 text-white" : "bg-gray-200 dark:bg-gray-700 dark:text-gray-300"}`}
                >
                  Fit Height
                </button>
              </div>
            </div>

            <button
              onClick={() => setShowSettings(false)}
              className="w-full py-2 bg-gray-200 dark:bg-gray-700 dark:text-white rounded hover:bg-gray-300 dark:hover:bg-gray-600"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Reading Container */}
      <div className={`mx-auto mt-8 px-4 flex flex-col items-center ${settings.imageFit === "Width" ? "max-w-4xl" : "max-w-full"}`}>
        {pages.length > 0 ? (
          settings.readingDirection === "Vertical" ? (
            // Vertical Scroll Mode
            pages.map((pageUrl, index) => (
              <div key={index} className="mb-4 w-full flex justify-center shadow-lg bg-white dark:bg-black">
                <img
                  src={pageUrl}
                  alt={`Page ${index + 1}`}
                  loading={index < 3 ? "eager" : "lazy"}
                  className={`${settings.imageFit === "Width" ? "w-full h-auto" : "h-screen w-auto"} object-contain`}
                />
              </div>
            ))
          ) : (
            // Single Page Mode
            <div className="w-full flex flex-col items-center relative">
               <div className="mb-4 w-full flex justify-center shadow-lg bg-white dark:bg-black relative group">
                  <img
                    src={pages[currentPage]}
                    alt={`Page ${currentPage + 1}`}
                    className={`${settings.imageFit === "Width" ? "w-full h-auto" : "h-[85vh] w-auto"} object-contain`}
                  />
                  {/* Invisible clickable areas for page turning */}
                  <div
                    className="absolute left-0 top-0 bottom-0 w-1/3 cursor-pointer"
                    onClick={() => currentPage > 0 && setCurrentPage(p => p - 1)}
                  />
                  <div
                    className="absolute right-0 top-0 bottom-0 w-1/3 cursor-pointer"
                    onClick={() => currentPage < pages.length - 1 && setCurrentPage(p => p + 1)}
                  />
               </div>
               <div className="text-gray-500 dark:text-gray-400 mt-2">
                 Page {currentPage + 1} of {pages.length}
               </div>

               {/* Mobile visible controls for single page */}
               <div className="flex space-x-4 mt-4 sm:hidden">
                  <button
                    disabled={currentPage === 0}
                    onClick={() => setCurrentPage(p => p - 1)}
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50"
                  >
                    Previous Page
                  </button>
                  <button
                    disabled={currentPage === pages.length - 1}
                    onClick={() => setCurrentPage(p => p + 1)}
                    className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
                  >
                    Next Page
                  </button>
               </div>
            </div>
          )
        ) : (
          <div className="text-center p-12 text-gray-500 dark:text-gray-400">
            No pages found for this chapter.
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="container mx-auto px-4 mt-12 flex items-center justify-between max-w-4xl">
        {prevChapterId ? (
          <Link
            href={`/read/${prevChapterId}`}
            className="px-6 py-2 bg-gray-200 dark:bg-gray-700 dark:text-white rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          >
            Previous Chapter
          </Link>
        ) : (
          <div></div>
        )}
        {nextChapterId ? (
          <Link
            href={`/read/${nextChapterId}`}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Next Chapter
          </Link>
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
}
