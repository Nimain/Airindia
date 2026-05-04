import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Air India Academy — Admission Portal",
  description: "Apply to the Air India Academy Cadet Pilot and Tech MRO programs. Start your aviation journey today.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.variable} style={{ fontFamily: "var(--font-inter, 'Inter', sans-serif)" }}>
        {children}
      </body>
    </html>
  );
}
