"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Globe, Menu, X, User, LogOut } from "lucide-react";
import { useState } from "react";
import Logo from "@/components/ui/Logo";
import { useAuth } from "@/modules/auth/hooks/useAuth";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Logo />
            <span className="text-xl font-bold text-gray-800">Azemera Academy</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-gray-700 hover:text-primary transition">
              Home
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-primary transition">
              About
            </Link>
            <Link href="/courses" className="text-gray-700 hover:text-primary transition">
              Courses
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-primary transition">
              Contact
            </Link>
          </nav>

          {/* Search Bar */}
          <div className="hidden lg:flex items-center bg-gray-100 rounded-lg px-4 py-2 flex-1 max-w-md mx-8">
            <Search className="w-4 h-4 text-gray-500 mr-2" />
            <input
              type="text"
              placeholder="Search courses..."
              className="bg-transparent border-none outline-none flex-1 text-sm"
            />
          </div>

          {/* Language Selector & Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <button className="flex items-center space-x-1 bg-gray-100 rounded-lg px-3 py-2 text-sm">
              <Globe className="w-4 h-4" />
              <span>English</span>
              <span>▼</span>
            </button>
            {isAuthenticated && user ? (
              <>
                <Link
                  href="/dashboard"
                  className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-primary transition"
                >
                  <User className="w-4 h-4" />
                  <span>{user.firstName || user.email.split('@')[0]}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-red-600 transition"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 text-primary border border-primary rounded-lg hover:bg-primary hover:text-white transition"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition whitespace-nowrap"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <nav className="flex flex-col space-y-4">
              <Link href="/" className="text-gray-700 hover:text-primary">
                Home
              </Link>
              <Link href="/about" className="text-gray-700 hover:text-primary">
                About
              </Link>
              <Link href="/courses" className="text-gray-700 hover:text-primary">
                Courses
              </Link>
              <Link href="/contact" className="text-gray-700 hover:text-primary">
                Contact
              </Link>
              <div className="flex items-center space-x-2 pt-4 border-t">
                <button className="flex items-center space-x-1 bg-gray-100 rounded-lg px-3 py-2 text-sm">
                  <Globe className="w-4 h-4" />
                  <span>English</span>
                </button>
                {isAuthenticated && user ? (
                  <>
                    <Link
                      href="/dashboard"
                      className="flex items-center space-x-2 px-4 py-2 text-gray-700"
                    >
                      <User className="w-4 h-4" />
                      <span>{user.firstName || user.email.split('@')[0]}</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 px-4 py-2 text-gray-700"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="px-4 py-2 text-primary border border-primary rounded-lg"
                    >
                      Login
                    </Link>
                    <Link
                      href="/register"
                      className="px-4 py-2 bg-primary text-white rounded-lg whitespace-nowrap"
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
