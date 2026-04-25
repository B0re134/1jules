import { PrismaClient } from "@prisma/client"
import { randomUUID } from "crypto"

const prisma = new PrismaClient()

async function main() {
  const user = await prisma.user.upsert({
    where: { email: "test@example.com" },
    update: {},
    create: {
      email: "test@example.com",
      name: "Test User",
      role: "ADMIN"
    }
  })

  const content = await prisma.content.create({
    data: {
      title: "Test Manga",
      description: "A manga for testing the reader",
      author: "Test Author",
      status: "ONGOING",
      coverImage: "https://via.placeholder.com/300x450"
    }
  })

  const chapter1 = await prisma.chapter.create({
    data: {
      title: "First Chapter",
      number: 1,
      pages: JSON.stringify([
        "https://via.placeholder.com/800x1200?text=Page+1",
        "https://via.placeholder.com/800x1200?text=Page+2",
        "https://via.placeholder.com/800x1200?text=Page+3"
      ]),
      contentId: content.id
    }
  })

  const chapter2 = await prisma.chapter.create({
    data: {
      title: "Second Chapter",
      number: 2,
      pages: JSON.stringify([
        "https://via.placeholder.com/800x1200?text=Page+1",
        "https://via.placeholder.com/800x1200?text=Page+2"
      ]),
      contentId: content.id
    }
  })

  console.log("Database seeded successfully with test content and chapters.")
  console.log(`Content ID: ${content.id}`)
  console.log(`Chapter 1 ID: ${chapter1.id}`)
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
