
"use client"
import { Toaster } from 'react-hot-toast';
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/component/Navbar";
import { SessionProvider } from "next-auth/react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// export const metadata = {
//   title: "Kotha - Message App",
//   description: "A simple and secure messaging app built with Next.js",
// };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* ✅ Correct SessionProvider wrapping */}
  <title>Kathabolo App - Chat, Talk & Connect Easily</title>
      <meta
        name="description"
        content="Kathabolo is a smart chatting and talking app that helps you connect instantly. Fast, secure, simple. Try Kathabolo today!"
      />
      <meta
        name="keywords"
        content="kathabolo, chat app, talking app, messaging app, kathabolo beta, kathabolo netlify"
      />
      <meta name="author" content="Kathabolo Team" />
        <SessionProvider>
          <div className="h-[7vh]"> <Navbar /></div>
         
          <div className="absolute inset-0 -z-10 overflow-auto w-full h-[93vh]scrollbar-thumb-blue  items-center px-5 py-24 [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)]">
            {children}
          </div>
          <Toaster position="top-right" reverseOrder={false} />
        </SessionProvider>
      </body>
    </html>
  );
}

