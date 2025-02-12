import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "./navComponent/navigation/navbar/page";
import Footer from "./footer/page";
import { Toaster } from 'react-hot-toast';
import SessionWrapper from "./component/sessionWrapper";
import { Analytics } from "@vercel/analytics/react"
import { ThemeProvider } from "@/context/ThemeContext";
import Script from "next/script";

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
  title = "DevBlogger - A Blogging Platform for Developers",
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
    manifest: "/manifest.json?v=1.0.6",
    // themeColor: "#000000",
    appleWebApp: {
      capable: true,
      statusBarStyle: "black",
      title: "Blog Website",
    },
    icons: {
      icon: [
        { url: "/icons/android/android-launchericon-48-48.png", sizes: "48x48", type: "image/png" },
        { url: "/icons/android/android-launchericon-72-72.png", sizes: "72x72", type: "image/png" },
        { url: "/icons/android/android-launchericon-96-96.png", sizes: "96x96", type: "image/png" },
        { url: "/icons/android/android-launchericon-144-144.png", sizes: "144x144", type: "image/png" },
        { url: "/icons/android/android-launchericon-192-192.png", sizes: "192x192", type: "image/png" },
        { url: "/icons/android/android-launchericon-512-512.png", sizes: "512x512", type: "image/png" },
      ],

      apple: [
        // 16 20 29 32 40  50 57 58 60 64 72 76 80 87 100 114 120 128 144 152 167 180 192 256 512 1024
        { url: "/icons/ios/16.png", sizes: "16x16", type: "image/png" },
        { url: "/icons/ios/20.png", sizes: "20x20", type: "image/png" },
        { url: "/icons/ios/29.png", sizes: "29x29", type: "image/png" },
        { url: "/icons/ios/32.png", sizes: "32x32", type: "image/png" },
        { url: "/icons/ios/40.png", sizes: "40x40", type: "image/png" },
        { url: "/icons/ios/50.png", sizes: "50x50", type: "image/png" },
        { url: "/icons/ios/57.png", sizes: "57x57", type: "image/png" },
        { url: "/icons/ios/60.png", sizes: "60x60", type: "image/png" },
        { url: "/icons/ios/72.png", sizes: "72x72", type: "image/png" },
        { url: "/icons/ios/76.png", sizes: "76x76", type: "image/png" },
        { url: "/icons/ios/80.png", sizes: "80x80", type: "image/png" },
        { url: "/icons/ios/87.png", sizes: "87x87", type: "image/png" },
        { url: "/icons/ios/100.png", sizes: "100x100", type: "image/png" },
        { url: "/icons/ios/114.png", sizes: "114x114", type: "image/png" },
        { url: "/icons/ios/120.png", sizes: "120x120", type: "image/png" },
        { url: "/icons/ios/144.png", sizes: "144x144", type: "image/png" },
        { url: "/icons/ios/152.png", sizes: "152x152", type: "image/png" },
        { url: "/icons/ios/167.png", sizes: "167x167", type: "image/png" },
        { url: "/icons/ios/180.png", sizes: "180x180", type: "image/png" },
        { url: "/icons/ios/192.png", sizes: "192x192", type: "image/png" },
        { url: "/icons/ios/256.png", sizes: "256x256", type: "image/png" },
        { url: "/icons/ios/512.png", sizes: "512x512", type: "image/png" },
        { url: "/icons/ios/1024.png", sizes: "1024x1024", type: "image/png" },
      ],
      shortcut: ["/icons/ios/152.png"],
    },
    applicationName: "DevBlogger",
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
      siteName: "DevBlogger",
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
        {/* <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8778160378200057"
          crossOrigin="anonymous">
        </script> */}
        
        <Script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8778160378200057" />
        {/* <Script
          src="//code.tidio.co/l6g8cbi3bveugsuepmvcwmmvim0muhdb.js"
          strategy="afterInteractive"
        /> */}
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
