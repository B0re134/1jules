import { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">Admin Panel</h2>
        </div>
        <nav className="px-4 pb-4">
          <ul className="space-y-2">
            <li>
              <a href="/admin" className="block p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700">Dashboard</a>
            </li>
            <li>
              <a href="/admin/content" className="block p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700">Manage Content</a>
            </li>
            <li>
              <a href="/admin/users" className="block p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700">Manage Users</a>
            </li>
          </ul>
        </nav>
      </aside>
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}
