import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function ContentDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // ⚡ Bolt Optimization:
  // 1. Replaced `include: { chapters: true }` with a targeted `select` query.
  // 2. Added `select` for chapters to exclude the massive `pages` string field.
  // This drastically reduces database payload and memory footprint for mangas with many chapters.
  const content = await prisma.content.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      author: true,
      description: true,
      coverImage: true,
      chapters: {
        orderBy: { number: "asc" },
        select: {
          id: true,
          number: true,
          title: true,
        },
      },
    },
  });

  if (!content) {
    notFound();
  }

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <div className="flex flex-col md:flex-row gap-8 mb-12">
        <div className="w-full md:w-1/3 flex-shrink-0">
          <div className="bg-gray-200 dark:bg-gray-700 w-full h-96 rounded-lg overflow-hidden shadow-md">
            {content.coverImage ? (
              <img
                src={content.coverImage}
                alt={content.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                No Cover Image
              </div>
            )}
          </div>
        </div>
        <div className="w-full md:w-2/3">
          <h1 className="text-4xl font-bold mb-2 dark:text-white">{content.title}</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">
            {content.author || "Unknown Author"}
          </p>
          <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
            {content.description ? (
              <p>{content.description}</p>
            ) : (
              <p className="italic text-gray-500">No description available.</p>
            )}
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-6 border-b pb-2 dark:text-white dark:border-gray-700">
          Chapters
        </h2>
        {content.chapters.length === 0 ? (
          <p className="text-gray-500">No chapters have been added yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {content.chapters.map((chapter) => (
              <Link
                key={chapter.id}
                href={`/read/${chapter.id}`}
                className="block p-4 border rounded-lg hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="font-medium text-lg dark:text-white">
                  Chapter {chapter.number}
                </div>
                {chapter.title && (
                  <div className="text-gray-600 dark:text-gray-400 text-sm">
                    {chapter.title}
                  </div>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
