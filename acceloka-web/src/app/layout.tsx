import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const poppins = Poppins({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Acceloka - By: Accelist",
  description: "Book your next adventure!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${poppins.variable} antialiased`}>
        
        {/* Navbar */}
        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
            
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="bg-primary text-white p-2 rounded-xl">
                 {/* Ticket Icon */}
                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" /></svg>
              </div>
              <span className="font-heading font-bold text-2xl text-primary tracking-tight">Acceloka</span>
            </div>

            {/* Nav Links */}
            <nav className="hidden md:flex gap-8 font-heading font-semibold text-text-muted">
              <a href="#" className="hover:text-primary transition-colors">Movies</a>
              <a href="#" className="hover:text-primary transition-colors">Concerts</a>
              <a href="#" className="hover:text-primary transition-colors">Events</a>
            </nav>

            {/* Sign In Button */}
            <button className="bg-primary hover:bg-blue-600 text-white px-6 py-2.5 rounded-full font-semibold shadow-md transition-transform hover:scale-105 active:scale-95 cursor-pointer">
              Sign In
            </button>
          </div>
        </header>

        {children}

        {/* Footer */}
        <footer className="bg-white border-t border-gray-100 py-12 mt-20">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <div className="flex justify-center gap-4 mb-6">
              <span className="text-2xl opacity-50 grayscale">🎪</span>
              <span className="text-2xl opacity-50 grayscale">🎟️</span>
              <span className="text-2xl opacity-50 grayscale">🎬</span>
            </div>
            <p className="text-text-muted font-medium">© 2026 Acceloka. Making memories fun!</p>
          </div>
        </footer>

      </body>
    </html>
  );
}
