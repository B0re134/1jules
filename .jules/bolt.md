## 2024-04-04 - Next/Prev Chapter O(N) memory to O(1) query optimization
**Learning:** In Next.js/Prisma apps handling manga or serialized content, finding the "next" and "previous" item by fetching `findMany` on all items for a parent causes an N+1 query problem, unbounded memory scaling, and large DB payload times for series with many chapters.
**Action:** Replace `findMany` array index lookups with two targeted `findFirst` database queries using `lt`/`gt` conditions and `select: { id: true }` to achieve O(1) memory and network overhead.
