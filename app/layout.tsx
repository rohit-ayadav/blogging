

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

// export const metadata: Metadata = {
//   title: "Blogger App",
//   description: "A simple blogging app built with Next.js and Prisma ORM which allows users to create, read, update and delete blog posts.",
// };

// export async function generateMetadata({ title, description }: Metadata) {
//   return {
//     title: title,
//     description: description,
//   };
// }


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
