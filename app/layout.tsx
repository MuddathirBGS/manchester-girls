import type { Metadata } from "next";
import { Poppins, Inter } from "next/font/google";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ToastProvider from "@/app/components/ui/ToastProvider";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-heading",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "Manchester Girls FC",
  description: "The home of girls football",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${poppins.variable} ${inter.variable}`}>
      <body
        className="font-body antialiased flex flex-col min-h-screen"
      >
        <ToastProvider>
          <Navbar />

          {/* Page Content */}
          <main className="flex-1">
            {children}
          </main>

          {/* Global Footer */}
          <Footer />
        </ToastProvider>
      </body>
    </html>
  );
}