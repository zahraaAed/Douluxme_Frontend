"use client";
import Header from "../components/header";
import Footer from "../components/footer";
export default function ContactPage() {
  return (
    <div className="pt-20 md:pt-24">
    <Header />
    <div className="pt-24 px-20 max-w-8xl mx-auto min-h-12xl">
     
      <h1 className="text-4xl md:text-6xl font-extrabold uppercase text-[#FFC88E] mb-12 leading-snug">
        How can we serve <br /> you?
      </h1>

      <form className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Full Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-[#A03321] mb-2">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              placeholder="Enter your full name"
              className="w-full bg-transparent border-b border-[#DFA38F] focus:border-[#A03321] placeholder-[#B08984] py-2 outline-none"
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-[#A03321] mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              className="w-full bg-transparent border-b border-[#DFA38F] focus:border-[#A03321] placeholder-[#B08984] py-2 outline-none"
            />
          </div>
        </div>

        {/* Subject */}
        <div>
          <label htmlFor="subject" className="block text-sm font-semibold text-[#A03321] mb-2">
            Message subject
          </label>
          <input
            type="text"
            id="subject"
            placeholder="Enter subject"
            className="w-full bg-transparent border-b border-[#DFA38F] focus:border-[#A03321] placeholder-[#B08984] py-2 outline-none"
          />
        </div>

        {/* Message */}
        <div>
          <label htmlFor="message" className="block text-sm font-semibold text-[#A03321] mb-2">
            Message
          </label>
          <textarea
            id="message"
            rows={5}
            placeholder="Type your message here..."
            className="w-full bg-transparent border-b border-[#DFA38F] focus:border-[#A03321] placeholder-[#B08984] py-2 outline-none resize-none"
          ></textarea>
        </div>

        {/* Submit */}
        <div className="text-right">
          <button
            type="submit"
            className="bg-[#A3CD8D] text-white font-semibold px-6 py-2 rounded-md hover:bg-[#8DB77A] transition"
          >
            Send
          </button>
        </div>
      </form>
    </div>
    <Footer />
    </div>
  );
}
