"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const MangaSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  author: z.string().min(1, "Author is required"),
  coverImage: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  status: z.enum(["Ongoing", "Completed"]),
});

type MangaFormData = z.infer<typeof MangaSchema>;

async function checkAdmin() {
  const session = await getServerSession(authOptions);
  if ((session?.user as any)?.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }
}

export async function createManga(data: MangaFormData) {
  await checkAdmin();

  const validatedData = MangaSchema.parse(data);

  await prisma.content.create({
    data: {
      ...validatedData,
      coverImage: validatedData.coverImage || null, // Convert empty string to null if applicable
    },
  });

  revalidatePath("/admin/manga");
  revalidatePath("/");
}

export async function updateManga(id: string, data: MangaFormData) {
  await checkAdmin();

  const validatedData = MangaSchema.parse(data);

  await prisma.content.update({
    where: { id },
    data: {
      ...validatedData,
      coverImage: validatedData.coverImage || null,
    },
  });

  revalidatePath("/admin/manga");
  revalidatePath(`/content/${id}`);
  revalidatePath("/");
}

export async function deleteManga(id: string) {
  await checkAdmin();

  await prisma.content.delete({
    where: { id },
  });

  revalidatePath("/admin/manga");
  revalidatePath("/");
}
