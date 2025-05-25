// app/admin/layout.tsx
import { ReactNode } from "react";
import Sidebar from "../components/adminSidebar";
import AdminProtectedRoute from "../components/adminProtectedRoute";
export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AdminProtectedRoute>
      <html lang="en">
        <body className="flex">
          <Sidebar />
          <main className="flex-1 p-4">{children}</main>
        </body>
      </html>
    </AdminProtectedRoute>
  );
}
