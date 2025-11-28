"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  Search,
  Globe,
  Menu,
  X,
  ChevronDown,
  User,
  LogOut,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/modules/auth/hooks/useAuth";
import { useTranslation } from "@/hooks/useTranslation";
import logoImage from "./logo1.png";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [isAuthDropdownOpen, setIsAuthDropdownOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);
  const authRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);
  const { user, isAuthenticated, logout } = useAuth();
  const { t, locale, changeLocale } = useTranslation();
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);

  // Close search, auth, lang dropdowns when clicking outside
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
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setIsLangDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const scrollToSection = (sectionId: string, e: React.MouseEvent) => {
    e.preventDefault();
    setIsMenuOpen(false);

    if (pathname !== "/") {
      window.location.href = `/#${sectionId}`;
      return;
    }

    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = 64;
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

    const sectionMap: { [key: string]: string } = {
      "/": "home",
      "/about": "about",
      "/courses": "courses",
      "/contact": "contact",
    };

    const sectionId = sectionMap[href];
    if (sectionId) scrollToSection(sectionId, e);
  };

  const handleLogout = async () => {
    await logout();
    setIsAuthDropdownOpen(false);
    router.push("/");
  };

  return (
    <header className="bg-white border-b shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-10 max-w-7xl">
        <div className="flex items-center h-16 w-full gap-2 sm:gap-4">
          {/* LEFT: logo */}
          <div className="flex items-center flex-shrink-0">
            <Link href="/" className="flex items-center space-x-2 sm:space-x-3">
              <div
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center shadow-md overflow-hidden relative"
                style={{
                  background:
                    "linear-gradient(135deg, #FFDE59 0%, #01BC63 100%)",
                  boxShadow: "0 8px 24px rgba(1,188,99,0.08)",
                }}
              >
                <Image
                  src={logoImage}
                  alt="Azemera Farms Logo"
                  width={80}
                  height={80}
                  className="absolute inset-0"
                  style={{
                    objectFit: "cover",
                    transform: "scale(1.8)",
                    objectPosition: "center",
                  }}
                />
              </div>
              <span
                className="text-sm sm:text-base md:text-xl font-extrabold tracking-tight"
                style={{ color: "#01BC63" }}
              >
                Azemera Farms
              </span>
            </Link>
          </div>

          {/* CENTER: nav */}
          <div className="hidden md:flex flex-1 justify-center">
            <nav className="flex items-center bg-[rgba(2,6,23,0.03)] rounded-full px-3 py-2 shadow-sm border border-[rgba(2,6,23,0.04)] backdrop-blur-sm">
              <a
                href="#home"
                onClick={(e) => handleNavClick("/", e)}
                className="relative px-5 py-2 text-gray-800 rounded-full text-sm font-medium transition-all duration-300 ease-out group overflow-hidden"
              >
                <span className="relative z-10 transition-colors duration-300 group-hover:text-white">
                  Home
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-[#01BC63] to-[#00a855] rounded-full scale-0 group-hover:scale-100 transition-transform duration-300 ease-out origin-center opacity-0 group-hover:opacity-100"></span>
                <span className="absolute inset-0 shadow-lg shadow-[#01BC63]/30 rounded-full scale-0 group-hover:scale-100 transition-all duration-300 ease-out opacity-0 group-hover:opacity-100"></span>
              </a>
              <a
                href="#about"
                onClick={(e) => handleNavClick("/about", e)}
                className="relative px-5 py-2 text-gray-800 rounded-full text-sm font-medium transition-all duration-300 ease-out group overflow-hidden"
              >
                <span className="relative z-10 transition-colors duration-300 group-hover:text-white">
                  {t("common.about", "About")}
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-[#01BC63] to-[#00a855] rounded-full scale-0 group-hover:scale-100 transition-transform duration-300 ease-out origin-center opacity-0 group-hover:opacity-100"></span>
                <span className="absolute inset-0 shadow-lg shadow-[#01BC63]/30 rounded-full scale-0 group-hover:scale-100 transition-all duration-300 ease-out opacity-0 group-hover:opacity-100"></span>
              </a>
              <a
                href="#courses"
                onClick={(e) => handleNavClick("/courses", e)}
                className="relative px-5 py-2 text-gray-800 rounded-full text-sm font-medium transition-all duration-300 ease-out group overflow-hidden"
              >
                <span className="relative z-10 transition-colors duration-300 group-hover:text-white">
                  {t("courses.title", "Courses")}
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-[#01BC63] to-[#00a855] rounded-full scale-0 group-hover:scale-100 transition-transform duration-300 ease-out origin-center opacity-0 group-hover:opacity-100"></span>
                <span className="absolute inset-0 shadow-lg shadow-[#01BC63]/30 rounded-full scale-0 group-hover:scale-100 transition-all duration-300 ease-out opacity-0 group-hover:opacity-100"></span>
              </a>
              <a
                href="#contact"
                onClick={(e) => handleNavClick("/contact", e)}
                className="relative px-5 py-2 text-gray-800 rounded-full text-sm font-medium transition-all duration-300 ease-out group overflow-hidden"
              >
                <span className="relative z-10 transition-colors duration-300 group-hover:text-white">
                  {t("common.contact", "Contact")}
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-[#01BC63] to-[#00a855] rounded-full scale-0 group-hover:scale-100 transition-transform duration-300 ease-out origin-center opacity-0 group-hover:opacity-100"></span>
                <span className="absolute inset-0 shadow-lg shadow-[#01BC63]/30 rounded-full scale-0 group-hover:scale-100 transition-all duration-300 ease-out opacity-0 group-hover:opacity-100"></span>
              </a>
            </nav>
          </div>

          {/* RIGHT: search & auth */}
          <div className="flex items-center space-x-2 sm:space-x-4 ml-auto">
            {/* Search */}
            <div ref={searchRef} className="relative z-20">
              {!isSearchExpanded ? (
                <button
                  onClick={() => setIsSearchExpanded(true)}
                  className="flex items-center space-x-1 sm:space-x-2 text-gray-700 hover:text-gray-900 transition px-2 sm:px-3 py-2 rounded-lg"
                >
                  <Search className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-sm hidden sm:inline">Search</span>
                </button>
              ) : (
                <div
                  className="flex items-center rounded-full px-3 sm:px-4 py-2 w-48 sm:w-64 transition-all"
                  style={{
                    background:
                      "linear-gradient(90deg, rgba(255,222,89,0.06), rgba(1,188,99,0.04))",
                    border: "1px solid rgba(2,6,23,0.06)",
                  }}
                >
                  <Search className="w-4 h-4 text-gray-700 mr-2 flex-shrink-0" />
                  <input
                    type="text"
                    placeholder="Search..."
                    autoFocus
                    className="bg-transparent border-none outline-none flex-1 text-sm text-gray-900 placeholder-gray-500"
                    onBlur={() => setIsSearchExpanded(false)}
                  />
                </div>
              )}
            </div>

            {/* Language Selector */}
            <div ref={langRef} className="relative">
              <button
                onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                className="flex items-center space-x-1 rounded-full px-2 sm:px-3 py-2 text-sm transition"
                style={{
                  background: "rgba(2,6,23,0.03)",
                  border: "1px solid rgba(2,6,23,0.04)",
                }}
              >
                <Globe className="w-4 h-4 text-gray-700 flex-shrink-0" />
                <span className="text-gray-800 hidden sm:inline">
                  {locale === "en" ? "English" : "አማርኛ"}
                </span>
                <ChevronDown className="w-3 h-3 text-gray-600 hidden sm:block" />
              </button>

              {isLangDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-40 rounded-lg shadow-lg py-2 z-50"
                  style={{
                    background: "#fff",
                    border: "1px solid rgba(2,6,23,0.06)",
                  }}
                >
                  <button
                    onClick={() => {
                      changeLocale("en");
                      setIsLangDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm transition ${
                      locale === "en" ? "font-medium" : ""
                    }`}
                    style={
                      locale === "en"
                        ? {
                            color: "#01BC63",
                            background: "rgba(1,188,99,0.04)",
                          }
                        : { color: "#374151" }
                    }
                  >
                    English
                  </button>
                  <button
                    onClick={() => {
                      changeLocale("am");
                      setIsLangDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm transition ${
                      locale === "am" ? "font-medium" : ""
                    }`}
                    style={
                      locale === "am"
                        ? {
                            color: "#01BC63",
                            background: "rgba(1,188,99,0.04)",
                          }
                        : { color: "#374151" }
                    }
                  >
                    አማርኛ
                  </button>
                </div>
              )}
            </div>

            {/* Auth */}
            {isAuthenticated && user ? (
              <div ref={authRef} className="relative">
                <button
                  onClick={() => setIsAuthDropdownOpen(!isAuthDropdownOpen)}
                  className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-2 rounded-full text-sm font-medium transition"
                  style={{
                    background:
                      "linear-gradient(90deg, #01BC63 0%, #FFDE59 100%)",
                    color: "#071126",
                    boxShadow: "0 8px 24px rgba(1,188,99,0.08)",
                  }}
                >
                  <User className="w-4 h-4 flex-shrink-0" />
                  <span className="hidden sm:inline truncate max-w-[100px] md:max-w-none">
                    {user.firstName || user.email.split("@")[0]}
                  </span>
                </button>

                {isAuthDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg py-2 z-50"
                    style={{
                      background: "#fff",
                      border: "1px solid rgba(2,6,23,0.06)",
                    }}
                  >
                    <Link
                      href={
                        user.role === "ADMIN"
                          ? "/admin/dashboard"
                          : user.role === "CREATOR"
                          ? "/creator/dashboard"
                          : "/dashboard"
                      }
                      onClick={() => setIsAuthDropdownOpen(false)}
                      className="block px-4 py-2 text-sm transition"
                      style={{ color: "#374151" }}
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm transition flex items-center space-x-2"
                      style={{ color: "#DC2626" }}
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div ref={authRef} className="relative">
                <button
                  onClick={() => setIsAuthDropdownOpen(!isAuthDropdownOpen)}
                  className="px-3 sm:px-4 py-2 rounded-full text-sm font-medium transition"
                  style={{
                    background: "#0f1724",
                    color: "#fff",
                    boxShadow: "0 6px 20px rgba(15,23,36,0.5)",
                  }}
                >
                  <span className="hidden sm:inline">Sign In</span>
                  <User className="w-4 h-4 sm:hidden" />
                </button>

                {isAuthDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-40 rounded-lg shadow-lg py-2 z-50"
                    style={{
                      background: "#fff",
                      border: "1px solid rgba(2,6,23,0.06)",
                    }}
                  >
                    <Link
                      href="/login"
                      onClick={() => setIsAuthDropdownOpen(false)}
                      className="block px-4 py-2 text-sm transition"
                      style={{ color: "#374151" }}
                    >
                      Login
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setIsAuthDropdownOpen(false)}
                      className="block px-4 py-2 text-sm transition"
                      style={{
                        background:
                          "linear-gradient(90deg, #FFDE59 0%, #01BC63 100%)",
                        color: "#071126",
                        borderRadius: 8,
                        margin: "6px",
                        textAlign: "center",
                      }}
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-lg ml-1"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              style={{ background: "rgba(2,6,23,0.03)" }}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="w-5 h-5 sm:w-6 sm:h-6 text-gray-800" />
              ) : (
                <Menu className="w-5 h-5 sm:w-6 sm:h-6 text-gray-800" />
              )}
            </button>
          </div>
        </div>

        {/* MOBILE MENU */}
        {isMenuOpen && (
          <div
            className="md:hidden py-4 border-t"
            style={{ borderColor: "rgba(2,6,23,0.06)" }}
          >
            <nav className="flex flex-col space-y-4">
              <a
                href="#home"
                onClick={(e) => handleNavClick("/", e)}
                className="text-gray-800 hover:text-[#01BC63] cursor-pointer transition"
              >
                Home
              </a>
              <a
                href="#about"
                onClick={(e) => handleNavClick("/about", e)}
                className="text-gray-800 hover:text-[#FFDE59] cursor-pointer transition"
              >
                About
              </a>
              <a
                href="#courses"
                onClick={(e) => handleNavClick("/courses", e)}
                className="text-gray-800 hover:text-[#01BC63] cursor-pointer transition"
              >
                Courses
              </a>
              <a
                href="#contact"
                onClick={(e) => handleNavClick("/contact", e)}
                className="text-gray-800 hover:text-[#FFDE59] cursor-pointer transition"
              >
                Contact
              </a>

              {/* Mobile Search */}
              <div
                className="pt-4 border-t"
                style={{ borderColor: "rgba(2,6,23,0.06)" }}
              >
                <div
                  className="flex items-center rounded-lg px-4 py-2"
                  style={{
                    background:
                      "linear-gradient(90deg, rgba(255,222,89,0.06), rgba(1,188,99,0.04))",
                  }}
                >
                  <Search className="w-4 h-4 text-gray-700 mr-2" />
                  <input
                    type="text"
                    placeholder="Search courses..."
                    className="bg-transparent border-none outline-none flex-1 text-sm text-gray-800 placeholder-gray-500"
                  />
                </div>
              </div>

              {/* Mobile Auth */}
              <div
                className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:space-x-2 pt-4 border-t"
                style={{ borderColor: "rgba(2,6,23,0.06)" }}
              >
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => changeLocale("en")}
                    className={`px-3 py-2 text-sm rounded-lg transition flex-1 sm:flex-none`}
                    style={
                      locale === "en"
                        ? { background: "#01BC63", color: "#fff" }
                        : { background: "#f3f4f6", color: "#374151" }
                    }
                  >
                    English
                  </button>
                  <button
                    onClick={() => changeLocale("am")}
                    className={`px-3 py-2 text-sm rounded-lg transition flex-1 sm:flex-none`}
                    style={
                      locale === "am"
                        ? { background: "#01BC63", color: "#fff" }
                        : { background: "#f3f4f6", color: "#374151" }
                    }
                  >
                    አማርኛ
                  </button>
                </div>

                {isAuthenticated && user ? (
                  <div className="flex flex-col sm:flex-row gap-2 sm:space-x-2">
                    <Link
                      href={
                        user.role === "ADMIN"
                          ? "/admin/dashboard"
                          : user.role === "CREATOR"
                          ? "/creator/dashboard"
                          : "/dashboard"
                      }
                      className="flex items-center justify-center space-x-2 px-4 py-2 text-gray-800 rounded-lg border border-gray-200 hover:bg-gray-50"
                    >
                      <User className="w-4 h-4" />
                      <span className="truncate">
                        {user.firstName || user.email.split("@")[0]}
                      </span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center justify-center space-x-2 px-4 py-2 text-gray-800 rounded-lg border border-gray-200 hover:bg-gray-50"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row gap-2 sm:space-x-2">
                    <Link
                      href="/login"
                      className="px-4 py-2 rounded-lg border text-center"
                      style={{ borderColor: "#01BC63", color: "#01BC63" }}
                    >
                      Login
                    </Link>
                    <Link
                      href="/register"
                      className="px-4 py-2 rounded-lg text-white text-center"
                      style={{
                        background:
                          "linear-gradient(90deg, #FFDE59 0%, #01BC63 100%)",
                      }}
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
