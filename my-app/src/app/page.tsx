"use client"

import Image from 'next/image'
import { useEffect, useState } from "react";
import axios from 'axios';


interface Category {
  id: number;
  name: string;
  image: string;
}


const NewTaskSection = () => {
  const [categories, setCategories] = useState<Category[]>([]);

 
  useEffect(() => {
    // Using axios to fetch data
    axios.get("http://localhost:5000/api/categories/get")
      .then((response) => {
        setCategories(response.data);
      })
      .catch((err) => {
        console.error("Failed to fetch categories:", err);
      });
  }, []);

  return (
    <div className="font-sans pt-20 md:pt-24">
      {/* First Section: Image as Background + Heading */}
      <div className="relative flex flex-col md:flex-row items-center justify-between py-12 px-6 bg-[#FFF7F3] w-full h-[500px] md:h-[600px] lg:h-[1000px]">
        {/* Text Section with Background Image */}
        <div className="md:w-1/2 text-left relative z-10 text-white">
          <h2 className="text-4xl font-extrabold text-[#B65F50] leading-snug mb-4">
            New Task Heading
          </h2>

        </div>

        {/* Image as Background */}
        <div className="w-full h-auto">
          <Image
            src="/home1.jpeg"
            alt="Task Image"
            layout="fill"
            objectFit="cover"
            className="rounded-lg h-auto"
          />
        </div>
      </div>

      {/* Second Section: Image + Text in Row */}
      <div className="flex flex-col lg:flex-row items-center justify-evenly w-full py-12 px-6 bg-[#FFFBF1] gap-y-12 lg:gap-x-16">
        {/* Image Section */}
        <div className="lg:w-[25%] w-full">
          <Image
            src="/home.png"
            alt="Another Image"
            width={500}
            height={300}
            className="object-contain rounded-lg w-full h-auto"
          />
        </div>

        {/* Text Section */}
        <div className="lg:w-[45%] w-full text-left">
          <h3 className="text-3xl font-semibold text-[#F48444] mb-4">
            About Douluxme
          </h3>
          <p className="text-[#9E2A16] text-lg font-normal leading-relaxed">
            Here, you can describe the task in more detail. Explain what needs to be done, the goals, and any other relevant information.
          </p>
          <button className='mt-4'>
            <span className="text-white text-lg font-semibold bg-green-500 py-2 px-2">
              Learn More
            </span>
          </button>
        </div>

     
      </div>
      <div className="relative w-screen mt-20 overflow-visible">
  {/* Green Bar */}
  <div className="w-full h-[100px] md:h-[150px] lg:h-[200px] bg-green-500"></div>

  {/* Image Positioned Below and Centered */}
  <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-40 z-10 ml-50">
    <img
      src="/home3.jpeg"
      alt="Date 1"
      className="w-64 md:w-1/4 lg:w-1/2 h-auto object-cover mb-20"
    />
  </div>
</div>
<div className='mt-60'>
<h2 className="text-4xl font-bold text-center mt-8 mb-4 text-[#F48444]">Discover By Categories</h2>
<div className="grid grid-cols-6 sm:grid-cols-3 md:grid-cols-4 gap-6 p-4">
      {categories.map((category) => (
        <div
          key={category.id}
          className="flex flex-col items-center text-center bg-red-300 rounded-2xl shadow-md p-4 hover:shadow-lg transition"
        >
          <img
            src={category.image}
            alt={category.name}
            className="w-24 h-24 object-cover mb-3 bg-red-500"
          />
          <p className="text-lg font-medium">{category.name}</p>
        </div>
      ))}
    </div>
    </div>


    </div>
  )
}

export default NewTaskSection
