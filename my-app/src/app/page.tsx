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
      {/* First Section: Image as Background + Heading */}
      <div className="relative flex flex-col md:flex-row items-center justify-between py-12 px-6 bg-[#FFF7F3] w-full h-[500px] md:h-[600px] lg:h-[1000px]">
        {/* Text Section with Background Image */}
        <div className="md:w-1/2 text-left relative z-10 lg:w-full ">
          <h2 className="text-4xl md:text-5xl font-extrabold leading-snug lg:text-7xl tracking-wide ml-30 text-[#B65F50]">
            Good for You.  <br></br>
            Even Better for <br></br>
            Your Tastebuds.
          </h2>
          <Link href="/shop" className="font-semibold underline hover:opacity-90">
          
          <button className="bg-[#006039] text-white text-lg font-semibold py-2 px-4 rounded-md mx-auto mt-8">
         
            Start Shopping
          </button>
          </Link> 

        </div>

        {/* Image as Background */}
        <div className="w-full h-auto">
          <Image
            src="/home1.jpeg"
            alt="Task Image"
            layout="fill"
            objectFit="cover"
            
            className="h-auto  overflow-hidden"
          />
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
          <p className="text-[#9E2A16] text-2xl font-normal leading-relaxed">
            At Douluxme, we make simple moments feel special. We take the finest dates, fill them with crunchy nuts, dip them in rich chocolate, and craft each one with real care. It's a small bite of luxury you can enjoy anytime — for yourself or as a gift.
          </p>
          <Link href="/about" className="font-semibold underline hover:opacity-90">
          
          <button className="bg-[#A6CC9A] text-white text-lg font-semibold py-2 px-4 rounded-md">
            Learn More
          </button>
          </Link>
        </div>



      </div>
      <div className="relative w-screen overflow-visible mt-30">
        {/* Green Bar */}
        <div className="w-full h-[100px] md:h-[150px] lg:h-[200px] bg-[#A6CC9A]"></div>

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
      <div className='mt-60 ml-30'>
        <h2 className="text-4xl font-bold text-left mt-8 mb-12 text-[#F48444] uppercase">Discover By Categories</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 ">
  {categories.map((category) => (
    <div
      key={category.id}
      className="flex flex-col items-center bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition duration-300 w-1/2 min-h-[300px]"
    >
      <Image
        src={`https://douluxme-backend.onrender.com/uploads/${category.image}`}
        alt={category.name}
        className="w-full object-cover"
        width={500}
        height={500}
      />
<div className="bg-[#A03321] w-full flex flex-1 justify-between items-center px-3 py-4">
  <p className="text-white text-lg font-bold uppercase">{category.name}</p>
  <Link href={`/shop`}>
  <button className="text-white text-md font-semibold bg-transparent border-none hover:bg-white hover:text-[#A9471F] hover:border-[#A9471F] hover:border-2 transition-all duration-300">
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
