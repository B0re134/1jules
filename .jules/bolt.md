## 2026-05-01 - Admin Pagination
**Learning:** `src/app/admin/manga/page.tsx` was executing an unbounded `findMany` query fetching all content, with all fields. Similar to the main page issue, this unbounded query could lead to memory overflow and slow DB performance in the admin panel as content grows.
**Action:** When querying lists with Prisma in admin pages, always include a `take` limit and a targeted `select` clause to fetch only the fields required for the table display.
