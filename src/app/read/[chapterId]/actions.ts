"use server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function incrementViewCount(contentId: string) {
  try {
    await prisma.content.update({
      where: { id: contentId },
      data: {
        viewCount: {
          increment: 1,
        },
      },
    });
  } catch (error) {
    console.error("Failed to increment view count:", error);
  }
}
