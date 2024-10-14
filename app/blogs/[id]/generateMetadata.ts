// app/blog/[id]/generateMetadata.ts

import { Metadata } from "next";

type Props = {
  params: { id: string };
};

/* Data in form returned from api
  const blogPost = {
    title: sanitizedTitle,
    content: sanitizedContent,
    status,
    thumbnail,
    tags: sanitizedTags,
    createdBy: session.user.email,
    likes: 0,
    views: 0,
  };
  */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const getPostBySlug = async (id: string) => {
    try {
      const response = await fetch(`api/blog/${id}`);
      if (!response.ok) {
        throw new Error(`${response.status} - ${response.statusText}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching blog post:", error);
      return null;
    }
  };

  const post = await getPostBySlug(params.id);
  console.log(`\n\n\nThis is post in file generateMetadata.ts: ${post}`);
  if (!post) {
    return {
      title: "Blog post not found",
      description: "The blog post you are looking for does not exist.",
      openGraph: {
        title: "Blog post not found",
        description: "The blog post you are looking for does not exist.",
        url: `https://blogging-one-omega.vercel.app/blogs/${params.id}`,
        type: "website",
        images: [
          {
            url: "/default-thumbnail.png",
            width: 800,
            height: 600,
            alt: "Blog post not found",
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: "Blog post not found",
        description: "The blog post you are looking for does not exist.",
        images: ["/default-thumbnail.jpg"],
      },

      alternates: {
        canonical: `https://blogging-one-omega.vercel.app/blogs/${params.id}`,
      },
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  return {
    title: post.title,
    description: post.content.substring(0, 160),
    openGraph: {
      title: post.title,
      description: post.content.substring(0, 160),
      url: `https://blogging-one-omega.vercel.app/blogs/${params.id}`,
      type: "article",
      images: [
        {
          url: post.thumbnail || "/default-thumbnail.png",
          width: 800,
          height: 600,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.content.substring(0, 160),
      images: [post.thumbnail || "/default-thumbnail.png"],
    },
  };
}
