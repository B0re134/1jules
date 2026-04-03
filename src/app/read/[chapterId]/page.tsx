import { notFound } from "next/navigation";
import ProgressTracker from "./ProgressTracker";
import ReaderUI from "./ReaderUI";
import { prisma } from "@/lib/prisma";

export default async function ReadChapterPage({
  params,
}: {
  params: Promise<{ chapterId: string }>;
}) {
  const chapterId = (await params).chapterId;

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
    <>
      {/* ProgressTracker handles client-side saving when component mounts */}
      <ProgressTracker chapterId={chapter.id} />

      <ReaderUI
        chapterId={chapter.id}
        contentId={chapter.contentId}
        contentTitle={chapter.content.title}
        chapterNumber={chapter.number}
        chapterTitle={chapter.title}
        pages={pages}
        prevChapterId={prevChapter?.id ?? null}
        nextChapterId={nextChapter?.id ?? null}
      />
    </>
  );
}
