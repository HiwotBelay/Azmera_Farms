"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  PlusCircle,
  BarChart3,
  Settings,
  Menu,
  X,
  Bell,
  LogOut,
  FileText,
} from "lucide-react";
import { useAuth } from "@/modules/auth/hooks/useAuth";

interface CreatorDashboardLayoutProps {
  children: React.ReactNode;
}

const creatorNavigation = [
  { name: "Dashboard", href: "/creator/dashboard", icon: LayoutDashboard },
  { name: "My Courses", href: "/creator/courses", icon: BookOpen },
  { name: "Create Course", href: "/creator/courses/create", icon: PlusCircle },
  { name: "Analytics", href: "/creator/analytics", icon: BarChart3 },
  { name: "Settings", href: "/creator/settings", icon: Settings },
];

const adminNavigation = [
  { name: "Dashboard", href: "/creator/dashboard", icon: LayoutDashboard },
  { name: "My Courses", href: "/creator/courses", icon: BookOpen },
  { name: "Create Course", href: "/creator/courses/create", icon: PlusCircle },
  { name: "Manage Courses", href: "/admin/courses", icon: FileText },
  { name: "Analytics", href: "/creator/analytics", icon: BarChart3 },
  { name: "Settings", href: "/creator/settings", icon: Settings },
];

export default function CreatorDashboardLayout({ children }: CreatorDashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  const getUserInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return 'C';
  };

  const getUserDisplayName = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    if (user?.firstName) {
      return user.firstName;
    }
    return user?.email || 'Creator';
  };

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
              <div className="w-12 h-12 bg-accent-yellow rounded-full flex items-center justify-center text-gray-800 font-bold">
                {getUserInitials()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800 truncate">{getUserDisplayName()}</p>
                <p className="text-sm text-gray-500">{user?.role === 'ADMIN' ? 'Admin' : 'Creator'}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {(user?.role === 'ADMIN' ? adminNavigation : creatorNavigation).map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                    isActive
                      ? "bg-accent-yellow text-gray-800"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
            
            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition mt-4"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Top Bar */}
        <header className="bg-white shadow-sm sticky top-0 z-40">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden text-gray-500"
              >
                {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>

              <div className="flex items-center space-x-4 ml-auto">
                <Link
                  href="/courses"
                  className="text-sm text-gray-600 hover:text-gray-800"
                >
                  Browse Marketplace
                </Link>
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

