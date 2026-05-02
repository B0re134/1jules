## 2024-05-01 - [Avoid Database Connection Exhaustion]
**Learning:** Instantiating `new PrismaClient()` across multiple files in a Next.js App Router project causes database connection exhaustion and memory leaks due to hot reloading during development. Each reload spins up a new client connection to the SQLite database without cleaning up the old ones.
**Action:** Always instantiate `PrismaClient` as a global singleton (`src/lib/prisma.ts`) and import that singleton across all pages, API routes, and libs.
