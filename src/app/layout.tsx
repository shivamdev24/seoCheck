import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "Advanced SEO Site Analyzer - Free SEO Audit Tool",
  description: "Run a free, instant SEO analysis on any website. Get prioritized recommendations, keyword suggestions, and a full technical audit with one click.",
  keywords: [
    "SEO analysis", "free SEO tool", "site audit", "technical SEO checker",
    "on-page SEO", "website SEO analyzer", "SEO site checkup", "SEO recommendations"
  ],
  authors: [{ name: "Refinix Labs", url: "https://www.refinix.in/" }],
  creator: "Refinix Labs",
  applicationName: "Advanced SEO Site Analyzer",
  metadataBase: new URL("https://www.refinix.in/"),
  openGraph: {
    title: "Advanced SEO Site Analyzer",
    description: "Run a free, instant SEO analysis on any website. Get a prioritized report and fix critical issues fast.",
    url: "https://www.refinix.in/",
    siteName: "Advanced SEO Site Analyzer",
    // images: [
    //   {
    //     url: "https://yourdomain.com/og-image.png",
    //     width: 1200,
    //     height: 630,
    //     alt: "Advanced SEO Site Analyzer Preview",
    //   },
    // ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Advanced SEO Site Analyzer",
    description: "Run a free, instant SEO analysis on any website. Get a prioritized report and fix critical issues fast.",
    // images: ["https://yourdomain.com/og-image.png"],
    creator: "@yourhandle",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  themeColor: "#ffffff",
  viewport: "width=device-width, initial-scale=1, maximum-scale=5",
};





export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
