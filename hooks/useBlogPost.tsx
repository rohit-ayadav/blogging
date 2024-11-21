// File: hooks/useBlogPost.tsx
"use client";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { BlogPostType } from "@/types/blogs-types";
import { ErrorMessage } from "@/app/blogs/[id]/ErrorMessage";

const useBlogPost = ({ email, tags, id }: { email: string, tags: string[], id: string }) => {
    const router = useRouter();
    const [authorPosts, setAuthorPosts] = useState<BlogPostType[]>([]);
    const [relatedPosts, setRelatedPosts] = useState<BlogPostType[]>([]);
    const [error, setError] = useState<Error | null>(null);

    const RelatedData = async () => {
        if (id) {
            if (!email) {
                router.push('/404');
            }
            try {
                const authorPostsResponse = await fetch(
                    `/api/blogpost?email=${email}`
                );
                if (!authorPostsResponse.ok) {
                    throw new Error(
                        `${authorPostsResponse.status} - ${authorPostsResponse.statusText}`
                    );
                }
                const authorPostsData = await authorPostsResponse.json();
                setAuthorPosts(
                    authorPostsData.blogs.filter((p: BlogPostType) => p._id !== id)
                );
            } catch (error: any) {
                setError(error);
                toast.error(error.message);
            }
            try {
                const relatedPostsResponse = await fetch(
                    `/api/blog?tags=${tags?.slice(0, 6).join(",")}&&limit=3`
                );
                if (!relatedPostsResponse.ok) {
                    throw new Error(
                        `${relatedPostsResponse.status} - ${relatedPostsResponse.statusText}`
                    );
                }
                const relatedPostsData = await relatedPostsResponse.json();
                setRelatedPosts(
                    relatedPostsData.data.filter((p: BlogPostType) => p._id !== id)
                );
            } catch (error: any) {
                setError(error);
                console.error('Error sharing:', error);
            }
        }
    };

    useEffect(() => {
        RelatedData();
    }, [id]);

    if (error) {
        <ErrorMessage message={error.message} />
    }


    return {
        relatedPosts,
        authorPosts,
    };
};


export default useBlogPost;

