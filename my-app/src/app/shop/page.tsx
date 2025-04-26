"use client"

import Image from 'next/image';
import { useEffect, useState } from "react";
import axios from 'axios';
import Header from '../components/header';
import Footer from '../components/footer';


interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  nut: {
    variety: string;
  };
  chocolate: {
    type: string;
  };
  category: {
    name: string;
  };
}
const Sidebar = () => {
  const categories = ["Bars", "Gifts", "Boxes"];

  return (
    <div className="w-[200px] flex flex-col gap-4 text-[#FFA76B] font-bold mt-6">
      {categories.map((cat) => (
        <details key={cat} className="cursor-pointer">
          <summary className="text-lg">{cat.toUpperCase()}</summary>
          <div className="pl-4 mt-1 text-sm text-black">Coming soon...</div>
        </details>
      ))}
    </div>
  );
};

export default function ProductPage() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/products/get')
      .then(res => {
        console.log("Fetched products:", res.data); // 👈 logs product data
        setProducts(res.data);
      })
      .catch(err => console.error("Error fetching products:", err));
  }, []);
  

  return (
    <>
      <Header />

      {/* Hero Section */}
      <div className="relative w-full h-[80vh] md:h-[110vh] bg-[#FFF7F3] overflow-hidden mt-20">
  <div className="absolute inset-0">
    <Image
      src="/Shop.png"
      alt="Order Hero"
      fill
      className="w-full h-full object-cover"
      priority
    />
  </div>
  <div className="relative z-10 flex items-center h-full px-8 text-[#B65F50]">
    <div className="text-left">
      <h2 className="text-3xl md:text-6xl lg:text-7xl font-bold leading-snug max-w-4xl ml-30">
        WHAT WOULD YOU <br /> LIKE TO ORDER
      </h2>
    </div>
  </div>
</div>




      {/* Content Section */}
      <div className="flex px-6 md:px-12 mt-10 ml-30">
        {/* Sidebar */}
      
        {/* Product Grid Section */}
        <div className="flex-1">
          {/* Title + Line */}
          <div className="flex items-center gap-4 mb-4 w-full">
            <h1 className="text-4xl font-bold text-black uppercase">Our Product</h1>
            <hr className="flex-grow border-t-4 border-[#A6CC9A]" />
          </div>
          <div className='flex items-center gap-4 mb-6 w-full '>
          <Sidebar />

          {/* Product Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-[80%] h-auto mt-16">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white border rounded-xl p-4 shadow-sm text-center"
              >
                <img
                  src={`http://localhost:5000/uploads/${product.image}`}
                  alt={product.name}
                  width={150}
                  height={150}
                  className="mx-auto mb-2"
                />
                <h2 className="font-semibold text-sm mb-1">{product.name}</h2>
                <p className="text-xs text-gray-500 mb-1 capitalize">
                  {product.nut.variety} + {product.chocolate.type} chocolate
                </p>
                <p className="text-sm text-gray-600 mb-2">${product.price}</p>
                <button className="w-full bg-[#D3E8A5] text-[#5B5B5B] hover:bg-[#c6e09a] py-1 rounded">
                  ADD TO CART
                </button>
              </div>
            ))}
          </div>
        </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
