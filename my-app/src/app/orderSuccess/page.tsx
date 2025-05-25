"use client";

export default function OrderSuccessPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <h1 className="text-4xl font-extrabold text-green-700 mb-6">Order Successful!</h1>
      <p className="text-lg text-gray-700 mb-2">Thank you for your order.</p>
      <p className="text-lg text-gray-700">Your order will be shipped soon.</p>
    </div>
  );
}
