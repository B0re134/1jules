import { PrismaClient } from "@prisma/client";
import Link from "next/link";

const prisma = new PrismaClient();

export default async function MainHomePage() {
  let contents: any[] = [];
  try {
    contents = await prisma.content.findMany({
      orderBy: { createdAt: 'desc' },
    });
  } catch (error) {
    console.error("Database connection failed during build, using empty content list.");
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-4 text-center">Welcome to MangaVault</h1>
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-12 text-center">Browse and read your favorite manga.</p>

      {contents.length === 0 ? (
        <p className="text-center text-gray-500">No content available yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {contents.map((content) => (
            <Link href={`/content/${content.id}`} key={content.id} className="block group">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden transition-transform duration-200 group-hover:-translate-y-1 group-hover:shadow-lg">
                <div className="h-64 bg-gray-200 dark:bg-gray-700 w-full object-cover">
                  {content.coverImage ? (
                    <img src={content.coverImage} alt={content.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">No Image</div>
                  )}
                </div>
                <div className="p-4">
                  <h2 className="text-xl font-semibold mb-1 truncate dark:text-white">{content.title}</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{content.author || 'Unknown Author'}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
