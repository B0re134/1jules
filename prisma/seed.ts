import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Clean existing data to avoid conflicts (optional but recommended for pure seeds)
  await prisma.comment.deleteMany();
  await prisma.communityPost.deleteMany();
  await prisma.chapter.deleteMany();
  await prisma.content.deleteMany();
  await prisma.user.deleteMany();

  // Create Users
  const password = await bcrypt.hash("password123", 10);

  const admin = await prisma.user.create({
    data: {
      name: "Admin User",
      email: "admin@example.com",
      password: password,
      role: "ADMIN",
    },
  });

  const user1 = await prisma.user.create({
    data: {
      name: "AnimeFan99",
      email: "fan1@example.com",
      password: password,
    },
  });

  const user2 = await prisma.user.create({
    data: {
      name: "MangaReader20",
      email: "fan2@example.com",
      password: password,
    },
  });

  const user3 = await prisma.user.create({
    data: {
      name: "OtakuKing",
      email: "fan3@example.com",
      password: password,
    },
  });

  const users = [user1, user2, user3];

  // Create Manga
  const mangaTitles = [
    { title: "Shadow Leveling", author: "Chugong", desc: "He levels up alone." },
    { title: "Ninja Chronicles", author: "Kishimoto", desc: "A ninja's tale." },
    { title: "Pirate King's Quest", author: "Oda", desc: "Sailing the seas." },
    { title: "Hero Academy", author: "Horikoshi", desc: "Superpowers for all." },
    { title: "Demon Slayer Corps", author: "Gotouge", desc: "Slaying demons." },
    { title: "Titan Hunters", author: "Isayama", desc: "Fighting giant titans." },
  ];

  for (let i = 0; i < mangaTitles.length; i++) {
    const mangaData = mangaTitles[i];
    const manga = await prisma.content.create({
      data: {
        title: mangaData.title,
        author: mangaData.author,
        description: mangaData.desc,
        coverImage: `https://picsum.photos/seed/${i + 100}/400/600`, // Placeholder image
        status: i % 2 === 0 ? "Ongoing" : "Completed", // Mix statuses
        chapters: {
          create: [
            {
              title: "The Beginning",
              number: 1,
              pages: [
                `https://picsum.photos/seed/${i * 10 + 1}/800/1200`,
                `https://picsum.photos/seed/${i * 10 + 2}/800/1200`,
                `https://picsum.photos/seed/${i * 10 + 3}/800/1200`,
              ],
            },
            {
              title: "The Journey Continues",
              number: 2,
              pages: [
                `https://picsum.photos/seed/${i * 10 + 4}/800/1200`,
                `https://picsum.photos/seed/${i * 10 + 5}/800/1200`,
              ],
            },
            {
              title: "A New Threat",
              number: 3,
              pages: [
                `https://picsum.photos/seed/${i * 10 + 6}/800/1200`,
                `https://picsum.photos/seed/${i * 10 + 7}/800/1200`,
              ],
            },
          ],
        },
      },
    });
    console.log(`Created Manga: ${manga.title}`);
  }

  // Create Community Threads
  const threads = [
    {
      title: "What's everyone reading this week?",
      body: "I just started Shadow Leveling and it's amazing. Any other recommendations?",
      authorId: user1.id,
    },
    {
      title: "Ending of Titan Hunters...",
      body: "Did anyone else feel like the ending was rushed? I need to discuss!",
      authorId: user2.id,
    },
    {
      title: "Looking for wholesome slice-of-life manga",
      body: "Need a break from the action. Hit me with your best recommendations.",
      authorId: user3.id,
    },
    {
      title: "Site Update: New features added!",
      body: "Welcome to MangaVault. We just added progress tracking and a new reading UI.",
      authorId: admin.id,
    },
  ];

  for (const threadData of threads) {
    const thread = await prisma.communityPost.create({
      data: threadData,
    });
    console.log(`Created Thread: ${thread.title}`);

    // Create Replies
    await prisma.comment.create({
      data: {
        body: "I highly recommend Ninja Chronicles if you haven't read it yet!",
        authorId: users[Math.floor(Math.random() * users.length)].id,
        postId: thread.id,
      },
    });

    await prisma.comment.create({
      data: {
        body: "Totally agree with the first reply. It's a classic.",
        authorId: users[Math.floor(Math.random() * users.length)].id,
        postId: thread.id,
      },
    });
  }

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
