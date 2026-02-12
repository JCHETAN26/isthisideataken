import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "IdeaTaken - Validate Your Startup Idea Instantly",
  description: "Check if your startup idea already exists. Search across domains, app stores, Product Hunt, GitHub, and more. Get AI-powered insights in seconds.",
  keywords: ["startup validation", "idea checker", "domain availability", "market research", "competitor analysis"],
  authors: [{ name: "IdeaTaken" }],
  openGraph: {
    title: "IdeaTaken - Validate Your Startup Idea Instantly",
    description: "Check if your startup idea already exists across multiple sources with AI-powered analysis.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}

