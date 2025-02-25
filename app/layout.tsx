import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from 'react-hot-toast';
import { Analytics } from "@vercel/analytics/react"
import { ThemeProvider } from "@/context/ThemeContext";
import Script from "next/script";
import { Toaster as Toast } from "react-hot-toast";
import SessionWrapper from "@/app/_component/sessionWrapper";
import Footer from "./footer/page";
import Navbar from "./_component/navigation/navbar/navbarComponent";
declare global {
  interface Window {
    dataLayer: any[];
  }
}

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
  display: "swap",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
  display: "swap",
});

export async function generateMetadata({
  title = "TheFoodBlogger - A Blogging Platform for Developers",
  description = "Explore a user-friendly blogging platform built with Next.js. Effortlessly create, update, and share blogs on diverse topics with customizable features and an interactive interface.",
  slug = "",
  imageUrl = "/default-thumbnail.png",
  canonicalUrl = "https://www.food.devblogger.in",
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
    keywords: "blogging, developer, blog, next.js, react, typescript, mongodb, vercel, nextjs, next,js, next-js, next.js blog, next.js blogging, next.js blog website, next.js blog platform, next.js blog app, next.js blog template, next.js blog example, next.js blog post, next.js blog tutorial, next.js blog website template, next.js blog website example, next.js blog website tutorial, next.js blog website project, next.js blog website code, next.js blog website design, next.js blog website development, next.js blog website app, next.js blog website platform, next.js blog website features, next.js blog website interface, next.js blog website user-friendly, next.js blog website customizable, next.js blog website interactive, next.js blog website share, next.js blog website update, next.js blog website create, next.js blog website effortlessly, next.js blog website diverse, next.js blog website topics, next.js blog website built, next.js blog website explore,TheFoodBlogger, Dev Blogger, Developer Blogger, Dev Blog, Developer Blog, Blog for Developers, Blogging",
    description,
    manifest: "/manifest.json?v=1.0.6",
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
    applicationName: "TheFoodBlogger",
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
      siteName: "TheFoodBlogger",
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
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "TheFoodBlogger",
    "alternateName": [
      "Dev Blogger",
      "Developer Blogger",
      "Dev Blog",
      "Developer Blog",
      "Blog for Developers",
      "Blogging",
    ],
    url: "https://www.food.devblogger.in",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://www.food.devblogger.in/search?q={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    },
    publisher: {
      "@type": "Organization",
      name: "TheFoodBlogger",
      logo: {
        "@type": "ImageObject",
        url: "https://www.food.devblogger.in/icons/android/android-launchericon-192-192.png",
        width: 192,
        height: 192
      }
    },
    sameAs: [
      "https://twitter.com/rohit.ayadav",
      // Add other social media links here
    ],
    mainEntity: {
      "@type": "Blog",
      name: "TheFoodBlogger",
      description: "Explore a user-friendly blogging platform built with Next.js. Effortlessly create, update, and share blogs on diverse topics with customizable features and an interactive interface.",
      url: "https://www.food.devblogger.in",
      inLanguage: "en",
      isAccessibleForFree: "True",
      creator: {
        "@type": "Person",
        name: "Rohit Ayadav"
      }
    }
  };

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "TheFoodBlogger",
    url: "https://www.food.devblogger.in",
    logo: "https://www.food.devblogger.in/icons/android/android-launchericon-192-192.png",
    sameAs: [
      "https://twitter.com/rohit.ayadav",
      // Add other social media links here
    ]
  };

  return (
    <html lang="en">
      <head>
        <Script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8778160378200057" />
        <meta name="google-adsense-account" content="ca-pub-8778160378200057"></meta>
        <Script
          id="json-ld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          strategy="afterInteractive"
        />
        <Script
          id="organization-json-ld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
          strategy="afterInteractive"
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}>
        <Toaster position="top-right" reverseOrder={false} />
        {/* <Toast /> */}
        <ThemeProvider>
          <SessionWrapper>
            {/* <NavbarComponent /> */}
            {/* <TheFoodBloggerNavbar /> */}
            <Navbar />
            <main className="flex-grow min-h-[calc(100vh-100px)]">
              {/* <main className="flex-grow min-h-[calc(100vh-100px)] flex items-center justify-center"> */}
              {children}
            </main>
            <Footer />
          </SessionWrapper>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}