// "use client";

import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "./navComponent/navigation/navbar";
import Footer from "./footer/page";
import { Toaster } from 'react-hot-toast';
import SessionWrapper from "./component/sessionWrapper";
import { Analytics } from "@vercel/analytics/react"
import { ThemeProvider } from "@/context/ThemeContext";

declare global {
  interface Window {
    dataLayer: any[];
  }
}

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});


export async function generateMetadata({
  title = "Write & Share: Next.js Blogging Platform",
  description = "Explore a user-friendly blogging platform built with Next.js. Effortlessly create, update, and share blogs on diverse topics with customizable features and an interactive interface.",
  slug = "",
  imageUrl = "/default-thumbnail.png",
  canonicalUrl = "https://blogging-one-omega.vercel.app",
}: {
  title?: string;
  description?: string;
  slug?: string;
  imageUrl?: string;
  canonicalUrl?: string;
}): Promise<Metadata> {
  const fullUrl = `${canonicalUrl}/blogs/${slug}`;

  return {
    title,
    description,
    // Manifest
    manifest: "/manifest.json?v=3",
    // themeColor: "#000000",
    appleWebApp: {
      capable: true,
      statusBarStyle: "black",
      title: "Blog Website",
    },
    icons: {
      icon: [
        { url: "/icons/android-icon-36x36.png", sizes: "36x36", type: "image/png" },
        { url: "/icons/android-icon-48x48.png", sizes: "48x48", type: "image/png" },
        { url: "/icons/android-icon-72x72.png", sizes: "72x72", type: "image/png" },
        { url: "/icons/android-icon-96x96.png", sizes: "96x96", type: "image/png" },
        { url: "/icons/android-icon-144x144.png", sizes: "144x144", type: "image/png" },
        { url: "/icons/android-icon-192x192.png", sizes: "192x192", type: "image/png" },
        { url: "/icons/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
      ],

      apple: [
        { url: "/icons/apple-icon-57x57.png", sizes: "57x57", type: "image/png" },
        { url: "/icons/apple-icon-60x60.png", sizes: "60x60", type: "image/png" },
        { url: "/icons/apple-icon-72x72.png", sizes: "72x72", type: "image/png" },
        { url: "/icons/apple-icon-76x76.png", sizes: "76x76", type: "image/png" },
        { url: "/icons/apple-icon-114x114.png", sizes: "114x114", type: "image/png" },
        { url: "/icons/apple-icon-120x120.png", sizes: "120x120", type: "image/png" },
        { url: "/icons/apple-icon-144x144.png", sizes: "144x144", type: "image/png" },
        { url: "/icons/apple-icon-152x152.png", sizes: "152x152", type: "image/png" },
        { url: "/icons/apple-icon-180x180.png", sizes: "180x180", type: "image/png" },
      ],
      shortcut: ["/icons/android-chrome-192x192.png"],
    },
    applicationName: "Blog Website",
    // viewport: {
    //   width: "device-width",
    //   initialScale: 1,
    //   maximumScale: 1,
    //   minimumScale: 1,
    //   userScalable: false,
    //   viewportFit: "cover",
    // },
    formatDetection: {
      telephone: false,
    },
    openGraph: {
      title,
      description,
      url: fullUrl,
      type: "article",
      images: [
        {
          url: imageUrl,
          width: 800,
          height: 600,
          alt: title,
        },
      ],
      siteName: "Blog Website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
      site: "@rohit.ayadav",
      creator: "@rohit.ayadav",
    },
    alternates: {
      canonical: fullUrl,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    verification: {
      // google: "your-google-site-verification",
    },
    category: "blogging",
    other: {
      "apple-mobile-web-app-capable": "yes",
      "mobile-web-app-capable": "yes",
      "msapplication-TileColor": "#000000",
      "msapplication-TileImage": "/icons/android-chrome-192x192.png",
      "msapplication-config": "/browserconfig.xml",
    },
  };
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8778160378200057"
          crossOrigin="anonymous">
        </script>
        <meta name="google-adsense-account" content="ca-pub-8778160378200057"></meta>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      > <Toaster
          position="top-right"
          reverseOrder={false}
        />
        <ThemeProvider>
          <SessionWrapper>
            <Navbar />
            {children}
            <Footer />
          </SessionWrapper>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
