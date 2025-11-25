"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  Plus,
  BarChart3,
  Users,
  DollarSign,
  Settings,
  Menu,
  X,
  Bell,
  Video,
  FileText,
  MessageSquare,
} from "lucide-react";
import BackButton from "@/components/ui/BackButton";

interface CreatorDashboardLayoutProps {
  children: React.ReactNode;
}

const navigation = [
  { name: "Dashboard", href: "/creator/dashboard", icon: LayoutDashboard },
  { name: "My Courses", href: "/creator/courses", icon: BookOpen },
  { name: "Create Course", href: "/creator/courses/create", icon: Plus },
  { name: "Analytics", href: "/creator/analytics", icon: BarChart3 },
  { name: "My Students", href: "/creator/students", icon: Users },
  { name: "Revenue", href: "/creator/revenue", icon: DollarSign },
  { name: "Reviews", href: "/creator/reviews", icon: MessageSquare },
  { name: "Settings", href: "/creator/settings", icon: Settings },
];

export default function CreatorDashboardLayout({
  children,
}: CreatorDashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          {/* User Info */}
          <div className="p-6 border-b">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-[#FFDE59] rounded-full flex items-center justify-center text-gray-900 font-bold">
                CC
              </div>
              <div>
                <p className="font-semibold text-gray-800">Content Creator</p>
                <p className="text-sm text-gray-500">Creator</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                    isActive
                      ? "bg-[#01BC63] text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Top Bar */}
        <header className="bg-white shadow-sm sticky top-0 z-40">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="lg:hidden text-gray-500"
                >
                  {sidebarOpen ? (
                    <X className="w-6 h-6" />
                  ) : (
                    <Menu className="w-6 h-6" />
                  )}
                </button>
                {pathname !== "/creator/dashboard" && (
                  <BackButton fallbackPath="/creator/dashboard" />
                )}
              </div>

              <div className="flex items-center space-x-4 ml-auto">
                <button className="relative p-2 text-gray-500 hover:text-gray-700">
                  <Bell className="w-6 h-6" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
