import Image from "next/image";
import Link from "next/link";

interface MangaCardProps {
  id: string;
  title: string;
  coverImage?: string | null;
}

export default function MangaCard({ id, title, coverImage }: MangaCardProps) {
  return (
    <Link href={`/content/${id}`} className="group block">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-all duration-300 transform group-hover:scale-105 group-hover:shadow-xl group-hover:-translate-y-1">
        <div className="relative w-full aspect-[2/3] bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
          {coverImage ? (
            <Image
              src={coverImage}
              alt={title}
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 25vw, 16vw"
              className="object-cover"
            />
          ) : (
            <span className="text-gray-400 dark:text-gray-500 text-sm">No Image</span>
          )}
        </div>
        <div className="p-4">
          <h2 className="font-bold text-lg text-gray-900 dark:text-white line-clamp-2 leading-tight">
            {title}
          </h2>
        </div>
      </div>
    </Link>
  );
}
