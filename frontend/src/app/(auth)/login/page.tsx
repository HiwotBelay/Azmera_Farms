"use client";

import { useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import LoginForm from "@/modules/auth/components/LoginForm";
import Logo from "@/components/ui/Logo";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-green-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative">
        {/* Close Button */}
        <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X className="w-5 h-5" />
        </button>

        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Logo className="w-16 h-16" />
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
          Welcome Back
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Login to continue your learning journey
        </p>

        {/* Login Form */}
        <LoginForm />

        {/* Sign Up Link */}
        <p className="text-center mt-6 text-gray-600">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-primary hover:underline font-semibold">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
