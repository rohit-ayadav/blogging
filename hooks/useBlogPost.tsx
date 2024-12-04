"use client";

import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { BlogPostType } from "@/types/blogs-types";

const useBlogPost = ({ email, tags, id }: { email: string; tags: string[]; id: string }) => {
    const router = useRouter();
    const [authorPosts, setAuthorPosts] = useState<BlogPostType[]>([]);
    const [relatedPosts, setRelatedPosts] = useState<BlogPostType[]>([]);
    const [error, setError] = useState<Error | null>(null);

    const RelatedData = async () => {
        if (!id || !email) {
            router.push('/404');
            return;
        }

        try {
            const [authorPostsResponse, relatedPostsResponse] = await Promise.all([
                fetch(`/api/blogpost?email=${email}`),
                fetch(`/api/blog?tags=${tags?.slice(0, 6).join(",")}&&limit=3`)
            ]);

            if (!authorPostsResponse.ok || !relatedPostsResponse.ok) {
                throw new Error(
                    `Error fetching data: ${authorPostsResponse.statusText}, ${relatedPostsResponse.statusText}`
                );
            }

            const authorPostsData = await authorPostsResponse.json();
            const relatedPostsData = await relatedPostsResponse.json();

            setAuthorPosts(
                authorPostsData.blogs.filter((p: BlogPostType) => p._id !== id) // Filter out the current post by id
            );
            setAuthorPosts(
                authorPostsData.blogs.filter((p: BlogPostType) => p.slug !== id) // Filter out the current post by slug
            );
            setRelatedPosts(
                relatedPostsData.data.filter((p: BlogPostType) => p._id !== id)
            );
            setRelatedPosts(
                relatedPostsData.data.filter((p: BlogPostType) => p.slug !== id)
            );
        } catch (error: any) {
            setError(error);
            toast.error(error.message);
        }
    };

    useEffect(() => {
        RelatedData();
    }, [id, email, tags]);

    return {
        authorPosts,
        relatedPosts
    };
};

export default useBlogPost;
