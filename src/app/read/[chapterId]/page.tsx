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

  // ⚡ Bolt Optimization:
  // 1. Replaced `findMany` (which fetches all chapters) with two targeted `findFirst` queries.
  // 2. Added `select: { id: true }` to minimize DB payload, drastically reducing memory usage for mangas with 100+ chapters.
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
