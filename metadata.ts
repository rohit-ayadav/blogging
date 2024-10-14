// metadata.ts
import type { Metadata } from "next";

export async function generateMetadata({
  title,
  description,
  url,
  image,
}: Readonly<{
  title: string;
  description: string;
  url: string;
  image: string;
}>): Promise<Metadata> {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      type: "website",
      images: [
        {
          url: image,
          width: 800,
          height: 600,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}