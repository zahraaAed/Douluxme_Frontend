import Image from 'next/image';

export default function AboutDouluxme() {
  return (
    <div className="font-sans">
      {/* Header */}
      <div className="px-6 py-12 bg-white max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold text-[#B65F50] mb-4">ABOUT DOULUXME</h2>
        <div className="flex items-start gap-4">
          <div className="w-1/2">
            <Image src="/images/chocolate-dip.jpg" alt="Chocolates" width={300} height={200} className="rounded" />
          </div>
          <p className="text-gray-700 text-sm">
          Douluxme makes delicious, feel-good treats—dates filled with nuts and fruits, dipped in smooth chocolate. Sweet, simple, and wholesome.


          </p>
        </div>
      </div>

  

      {/* Our Story */}
      <div className="py-10 px-6 max-w-4xl mx-auto">
        <h3 className="text-lg font-semibold text-[#F48444] mb-2">Our Story</h3>
        <p className="text-gray-700 text-sm">
        It started with a girl who loved two things: eating healthy and making sweets. She wanted to share treats that feel like dessert but are made with love and real ingredients. That’s how Douluxme came to life
        </p>
      </div>

      {/* Mission and Vision */}
      <div className="bg-[#FFF3EA] py-10 px-6">
        <h3 className="text-lg font-semibold text-[#F7A700] mb-6">Our Mission and Vision</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-bold text-sm mb-2">Mission</h4>
            <p className="text-gray-700 text-sm">
            To create treats that make people feel good—inside and out. We believe healthy can be delicious, and every bite should be a little moment of joy. We’re here to turn simple ingredients into something special, without compromise.


            </p>
          </div>
          <div>
            <h4 className="font-bold text-sm mb-2">Vision</h4>
            <p className="text-gray-700 text-sm">
            To change how the world sees sweets. We imagine a future where indulgence doesn’t mean guilt, where natural ingredients shine, and where everyone—no matter their lifestyle—can enjoy a little luxury, made with care.


            </p>
          </div>
        </div>
      </div>
      </div>
  );
}
