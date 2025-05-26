"use client";

import { useState } from "react";
import emailjs from "@emailjs/browser";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Header from "../components/header";
import Footer from "../components/footer";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    // Debug log
    console.log("DEBUG: Sending email with", {
      service_id: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
      template_id: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
      public_key: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY,
      params: {
        from_name: formData.name,
        from_email: formData.email,
        subject: formData.subject,
        message: formData.message,
      },
    });

    try {
      const result = await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
        {
          from_name: formData.name,
          from_email: formData.email,
          subject: formData.subject,
          message: formData.message,
        },
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
      );

      console.log("EmailJS success:", result);
      toast.success("Message sent successfully!");
      setFormData({ name: "", email: "", subject: "", message: "" }); // Clear form
    } catch (error) {
      console.error("EmailJS error:", error);
      toast.error("Failed to send message. Please try again later.");
    }
  };

  return (
    <div className="pt-20 md:pt-24">
      <Header />
      <div className="pt-24 px-20 max-w-8xl mx-auto min-h-12xl">
        <h1 className="text-4xl md:text-6xl font-extrabold uppercase text-[#FFC88E] mb-12 leading-snug">
          How can we serve <br /> you?
        </h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-[#A03321] mb-2">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="w-full bg-transparent border-b border-[#DFA38F] focus:border-[#A03321] placeholder-[#B08984] py-2 outline-none"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-[#A03321] mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full bg-transparent border-b border-[#DFA38F] focus:border-[#A03321] placeholder-[#B08984] py-2 outline-none"
              />
            </div>
          </div>

          <div>
            <label htmlFor="subject" className="block text-sm font-semibold text-[#A03321] mb-2">
              Message subject
            </label>
            <input
              type="text"
              id="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="Enter subject"
              className="w-full bg-transparent border-b border-[#DFA38F] focus:border-[#A03321] placeholder-[#B08984] py-2 outline-none"
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-semibold text-[#A03321] mb-2">
              Message
            </label>
            <textarea
              id="message"
              rows={5}
              value={formData.message}
              onChange={handleChange}
              placeholder="Type your message here..."
              className="w-full bg-transparent border-b border-[#DFA38F] focus:border-[#A03321] placeholder-[#B08984] py-2 outline-none resize-none"
            ></textarea>
          </div>

          <div className="text-right">
            <button
              type="submit"
              className="bg-[#808000] text-white font-semibold px-6 py-2 rounded-md hover:opacity-90 transition"
            >
              Send
            </button>
          </div>
        </form>
      </div>
      <Footer />
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </div>
  );
}
