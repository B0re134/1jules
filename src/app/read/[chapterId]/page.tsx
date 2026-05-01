import { PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation";
import ProgressTracker from "./ProgressTracker";
import ReaderUI from "./ReaderUI";

const prisma = new PrismaClient();

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
  // Performance optimization: Using targeted queries instead of fetching all chapters
  // into memory, saving significant RAM and DB payload by not fetching large 'pages' JSON
  const [prevChapter, nextChapter] = await Promise.all([
    prisma.chapter.findFirst({
      where: {
        contentId: chapter.contentId,
        number: { lt: chapter.number },
      },
      orderBy: { number: "desc" },
      select: { id: true },
    }),
    prisma.chapter.findFirst({
      where: {
        contentId: chapter.contentId,
        number: { gt: chapter.number },
      },
      orderBy: { number: "asc" },
      select: { id: true },
    }),
  ]);

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
