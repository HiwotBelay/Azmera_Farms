"use client";

import React, { useState } from "react";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

export default function ContactSection() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  const contactInfo = [
    {
      icon: Mail,
      title: t("home.contactEmail", "Email"),
      detail: "info@azemeraacademy.et",
    },
    {
      icon: Phone,
      title: t("home.contactPhone", "Phone"),
      detail: "+251 11 123 4567",
    },
    {
      icon: MapPin,
      title: t("home.contactVisit", "Address"),
      detail: "Addis Ababa, Ethiopia",
    },
  ];

  return (
    <section
      id="contact"
      className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-white via-[#f8fffe] to-white pt-12 md:pt-16 pb-20 md:pb-32"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-[#01BC63]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-[#FFDE59]/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative container mx-auto px-4 md:px-10 max-w-6xl z-10">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#01BC63]/10 to-[#FFDE59]/10 backdrop-blur-sm border border-[#01BC63]/20 rounded-full px-5 py-2.5 mb-6">
            <div className="w-2 h-2 bg-[#01BC63] rounded-full animate-pulse"></div>
            <span className="text-sm font-semibold text-[#01BC63]">
              Contact Us
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4">
            <span className="text-gray-900">
              {t("home.contactTitle", "Get in")}
            </span>{" "}
            <span className="bg-gradient-to-r from-[#01BC63] to-[#FFDE59] bg-clip-text text-transparent">
              {t("home.contactTitle2", "Touch")}
            </span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            {t(
              "home.contactDescription",
              "Have questions? We'd love to hear from you."
            )}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          {/* Left Side - Contact Info Cards */}
          <div className="space-y-6">
            {contactInfo.map((info, index) => {
              const Icon = info.icon;
              return (
                <div
                  key={index}
                  className="group relative bg-white rounded-2xl p-6 border-2 border-gray-100 shadow-lg hover:shadow-2xl hover:shadow-[#01BC63]/20 transition-all duration-500 hover:-translate-y-2 hover:border-[#01BC63] overflow-hidden"
                >
                  {/* Animated Background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#01BC63]/0 via-[#FFDE59]/0 to-[#01BC63]/0 group-hover:from-[#01BC63]/5 group-hover:via-[#FFDE59]/5 group-hover:to-[#01BC63]/5 transition-all duration-500"></div>

                  {/* Corner Accent */}
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-[#01BC63]/0 to-[#FFDE59]/0 group-hover:from-[#01BC63]/20 group-hover:to-[#FFDE59]/20 rounded-bl-full transition-all duration-500"></div>

                  <div className="relative z-10 flex items-center gap-4">
                    {/* Icon */}
                    <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-[#01BC63] to-[#00a855] flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:shadow-[#01BC63]/30 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6">
                      <Icon className="w-7 h-7 text-white" />
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-[#01BC63] transition-colors duration-300">
                        {info.title}
                      </h3>
                      <p className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                        {info.detail}
                      </p>
                    </div>
                  </div>

                  {/* Hover Border Glow */}
                  <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-[#01BC63]/30 transition-all duration-500 pointer-events-none"></div>
                </div>
              );
            })}
          </div>

          {/* Right Side - Contact Form */}
          <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-100 p-8 overflow-hidden">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-semibold text-gray-900 mb-2"
                >
                  {t("home.contactFormName", "Name")}{" "}
                  <span className="text-[#01BC63]">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#01BC63] focus:border-[#01BC63] outline-none transition-all duration-200 hover:border-gray-300"
                  placeholder={t(
                    "home.contactFormNamePlaceholder",
                    "Your name"
                  )}
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-gray-900 mb-2"
                >
                  {t("home.contactFormEmail", "Email")}{" "}
                  <span className="text-[#01BC63]">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#01BC63] focus:border-[#01BC63] outline-none transition-all duration-200 hover:border-gray-300"
                  placeholder={t(
                    "home.contactFormEmailPlaceholder",
                    "your@email.com"
                  )}
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-semibold text-gray-900 mb-2"
                >
                  {t("home.contactFormMessage", "Message")}{" "}
                  <span className="text-[#01BC63]">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#01BC63] focus:border-[#01BC63] outline-none transition-all duration-200 resize-none hover:border-gray-300"
                  placeholder={t(
                    "home.contactFormMessagePlaceholder",
                    "Your message..."
                  )}
                ></textarea>
              </div>

              <button
                type="submit"
                className="group w-full px-6 py-4 bg-gradient-to-r from-[#01BC63] to-[#00a855] text-white rounded-xl font-semibold shadow-lg shadow-[#01BC63]/30 hover:shadow-xl hover:shadow-[#01BC63]/40 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
              >
                <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                {t("home.sendMessage", "Send Message")}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
