import { PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation";
import MangaForm from "../../MangaForm";

const prisma = new PrismaClient();

export default async function EditMangaPage({
  params,
}: {
  params: { id: string };
}) {
  const manga = await prisma.content.findUnique({
    where: { id: params.id },
  });

  if (!manga) {
    notFound();
  }

  // Map null values to undefined/empty string to satisfy Zod/React-Hook-Form
  const mappedManga = {
    ...manga,
    author: manga.author ?? "",
    description: manga.description ?? "",
    coverImage: manga.coverImage ?? "",
    status: manga.status as "Ongoing" | "Completed",
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 dark:text-white">Edit Manga: {manga.title}</h1>
      <MangaForm initialData={mappedManga} />
    </div>
  );
}
