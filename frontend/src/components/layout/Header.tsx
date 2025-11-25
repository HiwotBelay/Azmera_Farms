"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Globe, Menu, X, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import Logo from "@/components/ui/Logo";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [isAuthDropdownOpen, setIsAuthDropdownOpen] = useState(false);
  const pathname = usePathname();
  const searchRef = useRef<HTMLDivElement>(null);
  const authRef = useRef<HTMLDivElement>(null);

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsSearchExpanded(false);
      }
      if (authRef.current && !authRef.current.contains(event.target as Node)) {
        setIsAuthDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const scrollToSection = (sectionId: string, e: React.MouseEvent) => {
    e.preventDefault();
    setIsMenuOpen(false);

    // If we're not on home page, navigate to home first
    if (pathname !== "/") {
      window.location.href = `/#${sectionId}`;
      return;
    }

    // Scroll to section on current page
    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = 64; // Account for sticky header (h-16 = 64px)
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  const handleNavClick = (href: string, e: React.MouseEvent) => {
    setIsMenuOpen(false);

    // Map navbar links to section IDs
    const sectionMap: { [key: string]: string } = {
      "/": "home",
      "/about": "about",
      "/courses": "courses",
      "/contact": "contact",
    };

    const sectionId = sectionMap[href];

    if (sectionId) {
      scrollToSection(sectionId, e);
    }
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-6 md:px-8 lg:px-12 max-w-7xl">
        <div className="flex items-center h-16 relative">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Logo />
            <span className="text-xl font-bold text-gray-800">Azemera</span>
          </Link>

          {/* Desktop Navigation - Pill Container - Centered */}
          <nav className="hidden md:flex items-center bg-gray-50 rounded-full px-4 py-2 absolute left-1/2 transform -translate-x-1/2">
            <a
              href="#home"
              onClick={(e) => handleNavClick("/", e)}
              className="px-5 py-2 text-gray-700 hover:text-primary transition rounded-full text-sm font-medium"
            >
              Home
            </a>
            <a
              href="#about"
              onClick={(e) => handleNavClick("/about", e)}
              className="px-5 py-2 text-gray-700 hover:text-primary transition rounded-full text-sm font-medium"
            >
              About
            </a>
            <a
              href="#courses"
              onClick={(e) => handleNavClick("/courses", e)}
              className="px-5 py-2 text-gray-700 hover:text-primary transition rounded-full text-sm font-medium"
            >
              Courses
            </a>
            <a
              href="#contact"
              onClick={(e) => handleNavClick("/contact", e)}
              className="px-5 py-2 text-gray-700 hover:text-primary transition rounded-full text-sm font-medium"
            >
              Contact
            </a>
          </nav>

          {/* Right Side - Search & Auth - Pushed to far right */}
          <div className="hidden md:flex items-center space-x-4 ml-auto">
            {/* Expandable Search Bar */}
            <div ref={searchRef} className="relative">
              {!isSearchExpanded ? (
                <button
                  onClick={() => setIsSearchExpanded(true)}
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition px-3 py-2"
                >
                  <Search className="w-4 h-4" />
                  <span className="text-sm">Search</span>
                </button>
              ) : (
                <div className="flex items-center bg-gray-100 rounded-full px-4 py-2 w-64 transition-all">
                  <Search className="w-4 h-4 text-gray-500 mr-2" />
                  <input
                    type="text"
                    placeholder="Search courses..."
                    autoFocus
                    className="bg-transparent border-none outline-none flex-1 text-sm"
                    onBlur={() => setIsSearchExpanded(false)}
                  />
                </div>
              )}
            </div>

            {/* Language Selector */}
            <button className="flex items-center space-x-1 bg-gray-100 rounded-full px-3 py-2 text-sm hover:bg-gray-200 transition">
              <Globe className="w-4 h-4" />
              <span>English</span>
              <ChevronDown className="w-3 h-3" />
            </button>

            {/* Auth Dropdown */}
            <div ref={authRef} className="relative">
              <button
                onClick={() => setIsAuthDropdownOpen(!isAuthDropdownOpen)}
                className="px-4 py-2 bg-gray-900 text-white rounded-full text-sm font-medium hover:bg-gray-800 transition"
              >
                Sign In
              </button>

              {/* Dropdown Menu */}
              {isAuthDropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <Link
                    href="/login"
                    onClick={() => setIsAuthDropdownOpen(false)}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setIsAuthDropdownOpen(false)}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <nav className="flex flex-col space-y-4">
              <a
                href="#home"
                onClick={(e) => handleNavClick("/", e)}
                className="text-gray-700 hover:text-primary cursor-pointer"
              >
                Home
              </a>
              <a
                href="#about"
                onClick={(e) => handleNavClick("/about", e)}
                className="text-gray-700 hover:text-primary cursor-pointer"
              >
                About
              </a>
              <a
                href="#courses"
                onClick={(e) => handleNavClick("/courses", e)}
                className="text-gray-700 hover:text-primary cursor-pointer"
              >
                Courses
              </a>
              <a
                href="#contact"
                onClick={(e) => handleNavClick("/contact", e)}
                className="text-gray-700 hover:text-primary cursor-pointer"
              >
                Contact
              </a>

              {/* Mobile Search */}
              <div className="pt-4 border-t">
                <div className="flex items-center bg-gray-100 rounded-lg px-4 py-2">
                  <Search className="w-4 h-4 text-gray-500 mr-2" />
                  <input
                    type="text"
                    placeholder="Search courses..."
                    className="bg-transparent border-none outline-none flex-1 text-sm"
                  />
                </div>
              </div>

              {/* Mobile Auth */}
              <div className="flex items-center space-x-2 pt-4 border-t">
                <button className="flex items-center space-x-1 bg-gray-100 rounded-lg px-3 py-2 text-sm">
                  <Globe className="w-4 h-4" />
                  <span>English</span>
                </button>
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
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
