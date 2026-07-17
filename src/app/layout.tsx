import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "@/providers";
import { UserSync } from "@/components/shared/user-sync";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "DriveRent — Premium Car Rental",
    template: "%s | DriveRent",
  },
  description:
    "Rent luxury and premium vehicles with ease. DriveRent offers the best car rental experience with top brands, flexible booking, and 24/7 support.",
  keywords: [
    "car rental",
    "luxury cars",
    "premium vehicles",
    "rent a car",
    "DriveRent",
    "BMW",
    "Mercedes",
    "Porsche",
    "Tesla",
  ],
  authors: [{ name: "DriveRent" }],
  creator: "DriveRent",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "DriveRent",
    title: "DriveRent — Premium Car Rental",
    description:
      "Rent luxury and premium vehicles with ease. DriveRent offers the best car rental experience.",
  },
  twitter: {
    card: "summary_large_image",
    title: "DriveRent — Premium Car Rental",
    description:
      "Rent luxury and premium vehicles with ease. DriveRent offers the best car rental experience.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <Providers>
          <UserSync />
          {children}
        </Providers>
      </body>
    </html>
  );
}
