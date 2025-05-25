// app/cart/layout.tsx
import ProtectedLayout from "../components/protectedRoute";

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return <ProtectedLayout>{children}</ProtectedLayout>;
}
