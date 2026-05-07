import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "@/components/local/Footer";
import Navbar from "@/components/local/Navbar";
import ReduxProvider from "@/components/providers/ReduxProvider";
import { Toaster } from "@/components/ui/sonner";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

export const metadata = {
  title: "PawFect",
  description: "Modern Petshop for cyberpunk future",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={` h-full antialiased`}>
      <body
        suppressHydrationWarning
        className="min-h-full h-full flex flex-col font-heading"
      >
        <ReduxProvider>
          <Navbar />
          <div className="flex-1">{children}</div>
          <Footer />
          <Toaster />
        </ReduxProvider>
      </body>
    </html>
  );
}
