import type { Metadata } from "next";
import { Anek_Latin, Onest, Noto_Sans_Mono } from "next/font/google";

import "./globals.css";

const headingFont = Anek_Latin({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["500", "600", "700", "800"]
});

const bodyFont = Onest({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600"]
});

const monoFont = Noto_Sans_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500", "600"]
});

export const metadata: Metadata = {
  title: "Silmarillionaire",
  description: "Shared project, staffing, and roadmap awareness for hub-and-spoke teams.",
  icons: {
    icon: "/favicon.svg"
  }
};

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <body className={`${headingFont.variable} ${bodyFont.variable} ${monoFont.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
