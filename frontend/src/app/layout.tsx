import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Azemera Academy - Online Learning Platform",
  description: "Empowering Ethiopian farmers with modern agricultural education",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}



