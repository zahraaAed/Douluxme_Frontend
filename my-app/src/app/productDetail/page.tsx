import { Suspense } from "react";
import ProductDetailClient from "./productDetailComponent";

export default function ProductDetailPage() {
  return (
    <Suspense fallback={<div>Loading product...</div>}>
      <ProductDetailClient />
    </Suspense>
  );
}
