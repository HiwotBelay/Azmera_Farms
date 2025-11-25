"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Send, MessageCircle, Clock } from "lucide-react";

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log("Form submitted:", formData);
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email Us",
      details: ["info@azemeraacademy.et", "support@azemeraacademy.et"],
      color: "bg-[#01BC63]",
      hoverColor: "hover:bg-[#059669]",
    },
    {
      icon: Phone,
      title: "Call Us",
      details: ["+251 11 123 4567", "+251 911 234 567"],
      color: "bg-[#FFDE59]",
      hoverColor: "hover:bg-[#FFD700]",
    },
    {
      icon: MapPin,
      title: "Visit Us",
      details: ["Azemera Farms", "Addis Ababa, Ethiopia"],
      color: "bg-[#01BC63]",
      hoverColor: "hover:bg-[#059669]",
    },
  ];

  return (
    <section
      id="contact"
      className="py-20 lg:py-32 bg-gradient-to-br from-gray-50 via-white to-gray-50"
    >
      <div className="container mx-auto px-6 md:px-12 lg:px-16 xl:px-20 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-16 lg:mb-24">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Get in <span className="text-[#01BC63]">Touch</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Have questions? We'd love to hear from you. Send us a message and
            we'll respond as soon as possible.
          </p>
        </div>

        {/* Contact Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 lg:mb-20">
          {contactInfo.map((info, index) => {
            const Icon = info.icon;
            return (
              <div
                key={index}
                className="group bg-white rounded-2xl p-8 border border-gray-200 hover:border-[#01BC63] transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              >
                <div
                  className={`inline-flex p-4 rounded-xl ${info.color} ${info.hoverColor} mb-6 transition-all duration-300 group-hover:scale-110`}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {info.title}
                </h3>
                <div className="space-y-2">
                  {info.details.map((detail, idx) => (
                    <p
                      key={idx}
                      className="text-gray-600 text-sm hover:text-[#01BC63] transition-colors cursor-pointer"
                    >
                      {detail}
                    </p>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Main Contact Form Section */}
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-[#01BC63] to-[#059669] p-8 text-center">
              <div className="inline-flex p-4 bg-white/20 rounded-full mb-4">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-2">
                Send us a Message
              </h3>
              <p className="text-white/90 text-lg">
                Fill out the form below and we'll get back to you within 24
                hours
              </p>
            </div>

            <form onSubmit={handleSubmit} className="p-8 lg:p-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-semibold text-gray-900 mb-3"
                  >
                    Full Name <span className="text-[#01BC63]">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#01BC63] focus:border-[#01BC63] outline-none transition-all duration-200 bg-gray-50 hover:bg-white"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-semibold text-gray-900 mb-3"
                  >
                    Email Address <span className="text-[#01BC63]">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#01BC63] focus:border-[#01BC63] outline-none transition-all duration-200 bg-gray-50 hover:bg-white"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label
                  htmlFor="subject"
                  className="block text-sm font-semibold text-gray-900 mb-3"
                >
                  Subject <span className="text-[#01BC63]">*</span>
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#01BC63] focus:border-[#01BC63] outline-none transition-all duration-200 bg-gray-50 hover:bg-white"
                  placeholder="What is this regarding?"
                />
              </div>

              <div className="mb-8">
                <label
                  htmlFor="message"
                  className="block text-sm font-semibold text-gray-900 mb-3"
                >
                  Message <span className="text-[#01BC63]">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#01BC63] focus:border-[#01BC63] outline-none transition-all duration-200 resize-none bg-gray-50 hover:bg-white"
                  placeholder="Tell us how we can help you..."
                ></textarea>
              </div>

              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-2 text-gray-600 text-sm">
                  <Clock className="w-4 h-4" />
                  <span>We typically respond within 24 hours</span>
                </div>
                <button
                  type="submit"
                  className="group px-8 py-4 bg-gradient-to-r from-[#01BC63] to-[#059669] text-white rounded-xl font-semibold hover:shadow-xl hover:shadow-[#01BC63]/30 transition-all duration-200 flex items-center justify-center gap-2 hover:scale-105"
                >
                  <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
