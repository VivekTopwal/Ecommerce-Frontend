import { Geist, Geist_Mono } from "next/font/google";
import "@/app/globals.css";
import { AuthProvider } from "@/app/context/AuthContext";
import { ShopProvider } from "@/app/context/ShopContext";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Mindful Living",
  description: "A thoughtfully curated platform offering skin care, hair care, wellness, nutrition, and spiritual lifestyle essentials for everyday balance.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>        
          <ShopProvider>
             <Toaster position="top-right" />
          {children}
          </ShopProvider>
          </AuthProvider>

      </body>
    </html>
  );
}
