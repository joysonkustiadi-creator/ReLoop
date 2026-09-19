import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { DealsProvider } from "@/lib/store";
import Header from "@/components/Header";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "ReLoop — Where Waste Becomes Value",
  description: "B2B marketplace for industrial waste and secondary materials in Indonesia.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased">
        <DealsProvider>
          <Header />
          <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">{children}</main>
        </DealsProvider>
      </body>
    </html>
  );
}
