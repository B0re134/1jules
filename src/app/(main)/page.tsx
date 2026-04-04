import MangaCard from "@/components/MangaCard";
import { prisma } from "@/lib/prisma";

export default async function MainHomePage() {
  let contents: { id: string; title: string; coverImage: string | null }[] = [];
  try {
    // ⚡ Bolt Optimization:
    // 1. Added `take: 24` to prevent fetching all records as DB grows (O(1) payload vs O(n))
    // 2. Added `select` to only fetch required fields (id, title, coverImage), reducing memory and network overhead
    contents = await prisma.content.findMany({
      orderBy: { createdAt: 'desc' },
      take: 24,
      select: {
        id: true,
        title: true,
        coverImage: true,
      }
    });
  } catch (_error) {
    console.error("Database connection failed during build, using empty content list.");
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Modern Dark-Themed Hero Banner */}
      <div className="bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 py-20 px-4 shadow-inner">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-6 tracking-tight drop-shadow-md">
            Welcome to <span className="text-blue-400">MangaVault</span>
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 max-w-2xl mx-auto drop-shadow">
            Discover, read, and track your favorite manga in one beautifully designed platform.
          </p>
        </div>
      </div>

      <div className="container mx-auto p-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Latest Additions</h2>
        </div>

        {contents.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <p className="text-xl text-gray-500 dark:text-gray-400">No content available yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {contents.map((content) => (
              <MangaCard
                key={content.id}
                id={content.id}
                title={content.title}
                coverImage={content.coverImage}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
