import Link from "next/link";
import { Facebook, Twitter, Linkedin, Youtube } from "lucide-react";
import Logo from "@/components/ui/Logo";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="border-t-2 border-primary"></div>
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Branding and Mission */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Logo />
              <span className="text-xl font-bold">Azemera Farms</span>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Empowering Ethiopian farmers with modern agricultural education and sustainable farming practices.
            </p>
            <div className="flex items-center space-x-4">
              <a href="#" className="hover:text-primary transition">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-primary transition">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-primary transition">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-primary transition">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Platform Navigation */}
          <div>
            <h3 className="font-bold mb-4">Platform</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/courses" className="text-gray-400 hover:text-white transition">
                  Courses
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-gray-400 hover:text-white transition">
                  Categories
                </Link>
              </li>
              <li>
                <Link href="/instructors" className="text-gray-400 hover:text-white transition">
                  Instructors
                </Link>
              </li>
              <li>
                <Link href="/certificates" className="text-gray-400 hover:text-white transition">
                  Certificates
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-bold mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/help" className="text-gray-400 hover:text-white transition">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white transition">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-400 hover:text-white transition">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
