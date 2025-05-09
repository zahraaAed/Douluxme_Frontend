import dynamic from "next/dynamic";
import { Suspense } from "react";

const ProductDetailClient = dynamic(() => import("./productDetailComponent"),{
  ssr: false,
});

export default function ProductDetailPage() {
  return (
    <Suspense fallback={<div>Loading product...</div>}>
      <ProductDetailClient />
    </Suspense>
  );
}
