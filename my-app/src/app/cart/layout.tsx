// app/cart/layout.tsx
import ProtectedLayout from "../components/protectedRoute";

export default function CartLayout({ children }: { children: React.ReactNode }) {
  return <ProtectedLayout>{children}</ProtectedLayout>;
}
