import { PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation";
import Link from "next/link";
import ProgressTracker from "./ProgressTracker";

const prisma = new PrismaClient();

export default async function ReadChapterPage({
  params,
}: {
  params: { chapterId: string };
}) {
  const chapterId = params.chapterId;

  const chapter = await prisma.chapter.findUnique({
    where: { id: chapterId },
    include: {
      content: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  });

  if (!chapter) {
    notFound();
  }

  // Find next and previous chapters for navigation
  const allChapters = await prisma.chapter.findMany({
    where: { contentId: chapter.contentId },
    orderBy: { number: "asc" },
  });

  const currentIndex = allChapters.findIndex((c) => c.id === chapter.id);
  const prevChapter = currentIndex > 0 ? allChapters[currentIndex - 1] : null;
  const nextChapter =
    currentIndex < allChapters.length - 1 ? allChapters[currentIndex + 1] : null;

  // Handle parsing the SQLite stringified JSON array
  let pages: string[] = [];
  try {
      pages = JSON.parse(chapter.pages);
  } catch(e) {
      console.error("Failed to parse pages", e);
  }

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen pb-12">
      {/* ProgressTracker handles client-side saving when component mounts */}
      <ProgressTracker chapterId={chapter.id} />

      {/* Top Navigation Bar */}
      <div className="sticky top-0 z-10 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-b dark:border-gray-700 shadow-sm">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link
            href={`/content/${chapter.content.id}`}
            className="text-blue-600 dark:text-blue-400 hover:underline flex items-center space-x-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            <span>Back to {chapter.content.title}</span>
          </Link>
          <div className="text-center">
            <h1 className="font-semibold text-lg dark:text-white">
              Chapter {chapter.number} {chapter.title ? `- ${chapter.title}` : ""}
            </h1>
          </div>
          <div className="flex space-x-2">
            {prevChapter ? (
              <Link
                href={`/read/${prevChapter.id}`}
                className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition"
              >
                Prev
              </Link>
            ) : (
              <span className="px-3 py-1 text-gray-400 dark:text-gray-500 cursor-not-allowed">Prev</span>
            )}
            {nextChapter ? (
              <Link
                href={`/read/${nextChapter.id}`}
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

      {/* Reading Container */}
      <div className="max-w-4xl mx-auto mt-8 px-4 flex flex-col items-center">
        {pages.length > 0 ? (
          pages.map((pageUrl, index) => (
            <div key={index} className="mb-4 w-full flex justify-center shadow-lg bg-white dark:bg-black">
              {/* Assuming pages are image URLs. We use standard img for manga pages usually to avoid next/image complexity unless configured */}
              <img
                src={pageUrl}
                alt={`Page ${index + 1}`}
                loading={index < 3 ? "eager" : "lazy"}
                className="max-w-full h-auto object-contain"
              />
            </div>
          ))
        ) : (
          <div className="text-center p-12 text-gray-500 dark:text-gray-400">
            No pages found for this chapter.
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="container mx-auto px-4 mt-12 flex items-center justify-between max-w-4xl">
         {prevChapter ? (
              <Link
                href={`/read/${prevChapter.id}`}
                className="px-6 py-2 bg-gray-200 dark:bg-gray-700 dark:text-white rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition"
              >
                Previous Chapter
              </Link>
            ) : (
              <div></div>
            )}
            {nextChapter ? (
              <Link
                href={`/read/${nextChapter.id}`}
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
