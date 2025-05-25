import Image from 'next/image';
import Footer from '../components/footer';
import Header from '../components/header';

export default function AboutDouluxme() {
  return (
    <div className="font-sans">
      {/* Header */}
      <Header />
      <div className="bg-[#FFF7F3] px-6 py-12 mt-8 w-full pt-20 md:pt-24">
        {/* Row: Heading + Image */}
        <div className="flex flex-col md:flex-row items-center justify-around gap-6">
          {/* Heading */}
          <h2 className="text-3xl md:text-4xl lg:text-7xl font-extrabold text-[#B65F50] leading-snug text-center md:text-left mt-4">
            ABOUT<br />DOULUXME
          </h2>

          {/* Image with offset background */}
          <div className="relative w-fit">
            <div className="absolute top-4 left-4 w-full h-full bg-[#FDD9B5] -z-10 rounded-sm"></div>
            <Image src="/about1.jpeg" alt="Chocolates" width={500} height={500} className="w-90 md:w-96 object-cover" />
          </div>
        </div>

        {/* Paragraph below */}
        <div className="mt-20">
          <p className="text-[#9E2A16] text-base sm:text-lg md:text-2xl font-normal text-center max-w-7xl mx-auto leading-relaxed ">
            At Douluxme, we believe little moments deserve something sweet.
            That&apos;s why we take soft dates, fill them with crunchy nuts, and dip them in rich, silky chocolate.
            Every piece is made with love, using only the best ingredients.
            A treat that feels good, tastes even better, and makes every day a little more special.
          </p>
        </div>
      </div>

      {/* Decorative green bar */}
      <div className="w-full h-[100px] md:h-[150px] lg:h-[200px] bg-[#808000] mt-20"></div>

      {/* Centered Content Wrapper */}
      <div className="w-full flex justify-center">
        {/* Content Section */}
        <div className="relative flex flex-col md:flex-row items-center justify-evenly w-11/12 md:w-3/4 lg:w-2/3 mt-[-140px] gap-8">
          {/* Image Column */}
          <div className="relative z-10">
            <Image src="/about3.png" alt="Date 1" width={500} height={500} className="w-84 md:w-3/4 h-auto object-cover" />
          </div>

          {/* Text Section */}
          <div className="w-full md:w-1/2 flex flex-col items-center space-around md:items-start justify-center text-center md:text-left mt-4 md:mt-20 gap-y-4">
            <h3 className="text-3xl md:text-4xl font-bold text-[#F48444]">Our Story</h3>
            <p className="text-[#9E2A16] text-base sm:text-lg md:text-2xl font-normal lg:w-[600px] w-[400px]">
              Douluxme began with a girl who loved healthy food but craved something sweet.
              She crafted the perfect treat — natural dates, crunchy nuts, and silky chocolate — no compromise, just pure joy.
              Today, Douluxme brings that same love and passion to you.
            </p>
          </div>
        </div>
      </div>

      {/* Mission and Vision */}
      <div className="py-10 px-6 mt-20">
        <h3 className="text-3xl md:text-4xl font-bold text-[#F48444] mb-6 w-full text-center">Our Mission and Vision</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 mt-20">
          {/* Mission Block */}
          <div className="relative pl-6 py-12 border-t-4 border-l-4 border-[#808000] max-w-3xl mx-auto">
            <h4 className="absolute -top-4 right-0 bg-[#FFFAF4] px-2 font-bold text-2xl md:text-3xl text-[#A6CC9A]">
              Mission
            </h4>
            <p className="text-gray-700 text-base sm:text-lg md:text-2xl">
              To create treats that make people feel good—inside and out. We believe healthy can be delicious, and every bite should be a little moment of joy. We&rsquo;re here to turn simple ingredients into something special, without compromise.
            </p>
          </div>

          {/* Vision Block */}
          <div className="relative py-12 pl-6 border-l-4 border-b-4 border-[#808000] max-w-3xl mx-auto">
            <h4 className="absolute -bottom-4 right-0 bg-[#FFFAF4] px-2 font-bold text-2xl md:text-3xl text-[#A6CC9A]">
              Vision
            </h4>
            <p className="text-gray-700 text-base sm:text-lg md:text-2xl">
              To change how the world sees sweets. We imagine a future where indulgence doesn&rsquo;t mean guilt, where natural ingredients shine, and where everyone&mdash;no matter their lifestyle&mdash;can enjoy a little luxury, made with care.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
