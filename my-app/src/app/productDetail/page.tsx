"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import Header from "../components/header";
interface Nut {
  variety: string;
}

interface Chocolate {
  type: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  nut: Nut;
  chocolate: Chocolate;
  categoryId: number; 
}

const ProductDetail = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("productId");

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [quantity, setQuantity] = useState<number>(1);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/products/get/${id}`);
        console.log("Fetched product:", res.data);
        setProduct(res.data); // set full product object
        // Fetch related products based on the current product's categoryId
        const relatedRes = await axios.get(
          `http://localhost:5000/api/products/get/products/category/${res.data.categoryId}`
        );
        setRelatedProducts(relatedRes.data); // set related products
      } catch (err) {
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(1, Number(event.target.value));
    setQuantity(value);
  };

  const handleAddToCart = () => {
    console.log("Added to cart:", { id, name: product?.name, quantity });
  };

  // Generate description safely
  const description = product
    ? `This product features ${product.chocolate?.type} chocolate with ${product.nut?.variety} nuts.`
    : "";
    const totalPrice = product ? product.price * quantity : 0;

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  if (!product) {
    return <div className="p-8 text-center">No product found.</div>;
  }

  return (
    <div className="mt-20">
      <Header />
 
    <div className="flex flex-col md:flex-row gap-8 p-8 mx-[30px] justify-center">
      
      {/* Product Image and Details */}
      <div className="flex-1">
        <img
          src={`http://localhost:5000/uploads/${product.image}`}
          alt={product.name}
          className="w-full h-auto object-cover"
        />
      </div>

      <div className="flex-1 justify-center flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-[#A9471F]">{product.name}</h2>
          <p className="text-lg text-[#FF7F00]">${totalPrice}</p>

        </div>
        <div className="border-b-2 mb-4"></div>
        <p className="text-gray-700 mb-4">{description}</p>
        <div className="border-b-2 mb-4"></div>

        <div className="flex justify-between items-center mt-4">
          <div className="flex items-center gap-4">
            <label htmlFor="quantity" className="font-semibold text-[#A9471F]">
              Quantity:
            </label>
            <input
              type="number"
              id="quantity"
              value={quantity}
              onChange={handleQuantityChange}
              className="w-16 p-2 border border-gray-300 rounded"
              min="1"
            />
          </div>
          <button
            onClick={handleAddToCart}
            className="bg-[#FF7F00] text-white px-6 py-2 rounded-md font-semibold"
          >
            Add to Cart
          </button>
        </div>

        {/* Border Below the Button */}
        <div className="border-b-2 mt-4 mb-6"></div>

        {/* Related Products Section */}
        <div className="mt-8">
          <h3 className="text-2xl font-bold mb-4 text-[#A9471F]">Related Products</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {relatedProducts.map((relatedProduct) => (
              <div key={relatedProduct.id} className="product-card">
                <img
                  src={`http://localhost:5000/uploads/${relatedProduct.image}`}
                  alt={relatedProduct.name}
                  className="w-full h-auto object-cover"
                />
                <h4 className="mt-2 text-lg font-semibold">{relatedProduct.name}</h4>
                <p className="text-lg text-[#FF7F00]">${relatedProduct.price}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default ProductDetail;
