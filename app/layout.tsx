

import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "./navComponent/navigation/navbar";
import Footer from "./footer/page";
import { Toaster } from 'react-hot-toast';
import SessionWrapper from "./component/sessionWrapper";

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

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Blogger App",
    description: "A simple blogging platform built with Next.js, where users can create, read, update, and delete blog posts.",
    openGraph: {
      title: "Blogger App",
      description: "Join the Blogger App community and start sharing your stories!",
      url: "https://blogging-one-omega.vercel.app",
      type: "website",
      images: [
        {
          url: "/default-thumbnail.png",
          width: 800,
          height: 600,
          alt: "Blogger App",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Blogger App",
      description: "Start blogging with ease using our platform!",
      images: ["/default-thumbnail.jpg"],
    },
    alternates: {
      canonical: "https://blogging-one-omega.vercel.app",
    },
    robots: {
      index: true,
      follow: true,
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
      {/* <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
        <meta property="og:title" content="Blogger App" />
        <meta property="og:description" content="A simple blogging app built with Next.js and Prisma ORM which allows users to create, read, update and delete blog posts." />
        <meta property="og:image" content="/blog.jpeg" />
        <meta property="og:url" content="https://blogging-one-omega.vercel.app/" />
        <meta name="twitter:card" content="summary_large_image" />
      </head> */}
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      > <Toaster
          position="top-right"
          reverseOrder={false}
        />
        <SessionWrapper>
          <Navbar />
          {children}
          <Footer />
        </SessionWrapper>
      </body>
    </html>
  );
}
