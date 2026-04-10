## 2024-04-04 - Next/Prev Chapter O(N) memory to O(1) query optimization
**Learning:** In Next.js/Prisma apps handling manga or serialized content, finding the "next" and "previous" item by fetching `findMany` on all items for a parent causes an N+1 query problem, unbounded memory scaling, and large DB payload times for series with many chapters.
**Action:** Replace `findMany` array index lookups with two targeted `findFirst` database queries using `lt`/`gt` conditions and `select: { id: true }` to achieve O(1) memory and network overhead.

## 2024-04-10 - O(N) memory to O(1) memory via targeted query
**Learning:** The `Chapter` model's `pages` field is a large stringified JSON array of image URLs. Using a broad `include: { chapters: true }` on the parent `Content` fetching all chapters fetches this massive string for every single chapter.
**Action:** When querying the `Content` model in pages like `src/app/content/[id]/page.tsx` that only show chapter lists, replace `include` with a targeted `select` on the `chapters` relation to explicitly exclude the `pages` column.
