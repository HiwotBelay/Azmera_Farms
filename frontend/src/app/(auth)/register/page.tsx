"use client";

import { useState } from "react";
import Link from "next/link";
import { X, GraduationCap, Monitor } from "lucide-react";
import RegisterForm from "@/modules/auth/components/RegisterForm";
import Logo from "@/components/ui/Logo";

export default function RegisterPage() {
  const [selectedRole, setSelectedRole] = useState<"LEARNER" | "CREATOR">("LEARNER");

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-green-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative">
        {/* Close Button */}
        <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X className="w-5 h-5" />
        </button>

        {/* Logo */}
        <div className="flex justify-center mb-4">
          <Logo className="w-16 h-16" />
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
          Join Azemera Academy
        </h1>
        <p className="text-center text-gray-600 mb-6">
          Create your account to get started
        </p>

        {/* Role Selection */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setSelectedRole("LEARNER")}
            className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-lg border-2 transition ${
              selectedRole === "LEARNER"
                ? "bg-primary border-primary text-white"
                : "bg-gray-50 border-gray-200 text-gray-700 hover:border-gray-300"
            }`}
          >
            <GraduationCap className="w-5 h-5" />
            <span className="font-semibold">Learner</span>
          </button>
          <button
            onClick={() => setSelectedRole("CREATOR")}
            className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-lg border-2 transition ${
              selectedRole === "CREATOR"
                ? "bg-accent-yellow border-accent-yellow text-gray-800"
                : "bg-gray-50 border-gray-200 text-gray-700 hover:border-gray-300"
            }`}
          >
            <Monitor className="w-5 h-5" />
            <span className="font-semibold">Creator</span>
          </button>
        </div>

        {/* Registration Form */}
        <RegisterForm role={selectedRole} />

        {/* Login Link */}
        <p className="text-center mt-6 text-gray-600">
          Already have an account?{" "}
          <Link href="/login" className="text-primary hover:underline font-semibold">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
