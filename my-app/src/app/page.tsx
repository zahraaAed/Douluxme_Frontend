"use client"

import Image from 'next/image'
import { useEffect, useState } from "react";
import axios from 'axios';
import Header from './components/header';
import Footer from './components/footer';
import Link from 'next/link';
interface Category {
  id: number;
  name: string;
  image: string;
}


const NewTaskSection = () => {
  const [categories, setCategories] = useState<Category[]>([]);


  useEffect(() => {
    // Using axios to fetch data
    axios.get("https://douluxme-backend.onrender.com/api/categories/get")
      .then((response) => {
        setCategories(response.data);
      })
      .catch((err) => {
        console.error("Failed to fetch categories:", err);
      });
  }, []);

  return (
    <div>
      <Header />
      {/* Main Container */}
      <div className="relative w-full h-[500px] md:h-[600px] lg:h-[1000px] bg-[#FFF7F3] overflow-hidden">
  {/* Background Image */}
  <Image
    src="/home1.jpeg"
    alt="Hero Image"
    fill
    className="object-cover"
    priority
  />

  {/* Overlay Text Section */}
  <div className="relative z-10 flex flex-col items-start justify-center h-full px-6 md:px-12">
    <h2 className="text-4xl md:text-5xl lg:text-7xl font-extrabold leading-snug tracking-wide text-[#B65F50] max-w-3xl">
      Good for You. <br />
      Even Better for <br />
      Your Tastebuds.
    </h2>
    <Link href="/shop">
      <button className="bg-[#808000] text-white text-lg font-semibold py-2 px-4 rounded-md mt-8 hover:opacity-90">
        Start Shopping
      </button>
    </Link>
  </div>
</div>

      {/* Second Section: Image + Text in Row */}
      <div className="flex flex-col lg:flex-row items-center justify-evenly w-full py-12 px-6 bg-[#FFFBF1] gap-y-12 lg:gap-x-16 mt-30">
        {/* Image Section */}
        <div className="lg:w-[25%] w-full">
          <Image
            src="/home2.jpeg"
            alt="Another Image"
            width={500}
            height={300}
            className="object-contain rounded-lg w-full h-auto"
          />
        </div>

        <div className="flex flex-col justify-around items-start lg:w-[45%] w-full text-left h-[400px]">
          <h3 className="text-4xl font-semibold text-[#F48444] uppercase">
            what is Douluxme ?
          </h3>
          <p className="text-[#9E2A16] lg:text-2xl text-lg  font-normal leading-relaxed">
            At Douluxme, we make simple moments feel special. We take the finest dates, fill them with crunchy nuts, dip them in rich chocolate, and craft each one with real care. It&apos;s a small bite of luxury you can enjoy anytime — for yourself or as a gift.
          </p>
          <Link href="/about" className="font-semibold underline hover:opacity-90">
          
          <button className="bg-[#808000] text-white text-lg font-semibold py-2 px-4 rounded-md">
            Learn More
          </button>
          </Link>
        </div>



      </div>
      <div className="relative w-screen overflow-visible mt-30">
        {/* Green Bar */}
        <div className="w-full h-[100px] md:h-[150px] lg:h-[200px] bg-[#808000]"></div>

        {/* Image Positioned Below and Centered */}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-50 z-10 ">
          <Image
            src="/home3.png"
            alt="Date 1"
            width={500}
            height={300}
            className="w-90 md:w-1/4 lg:w-3/4 h-auto object-cover mb-20"
          />
        </div>
      </div>
      <div className='mt-60 ml-5'>
        <h2 className="text-4xl font-bold text-left mt-8 mb-12 text-[#F48444] uppercase ml-5 lg:ml-30">Discover By Categories</h2>
        <div className="flex flex-col sm:flex-row flex-wrap justify-center lg:gap-50 px-4 gap-10 md:gap-20">
  {categories.map((category) => (
    <div
      key={category.id}
      className="w-full sm:w-[40%] lg:w-[25%] max-w-sm flex flex-col items-center bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition duration-300 min-h-[250px]"
    >
      <Image
        src={`https://douluxme-backend.onrender.com/uploads/${category.image}`}
        alt={category.name}
        className="w-full object-cover"
        width={500}
        height={500}
      />
      <div className="bg-[#A03321] w-full flex flex-1 justify-between items-center px-3 py-3">
        <p className="text-white text-base font-bold uppercase">{category.name}</p>
        <Link href={`/shop`}>
          <button className="text-[#A03321] text-sm font-semibold bg-transparent border-none p-2 bg-white hover:text-[#808000] hover:border-[#A9471F] hover:border-2 transition-all duration-300">
            shop now
          </button>
        </Link>
      </div>
    </div>
  ))}
</div>




      </div>

      <Footer />
    </div>
  )
}

export default NewTaskSection
