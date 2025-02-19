"use client";

import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { notFound } from "next/navigation";
import { BlogPostType } from "@/types/blogs-types";

const useBlogPost = ({ email, tags, id }: { email: string; tags: string[]; id: string }) => {
    const [authorPosts, setAuthorPosts] = useState<BlogPostType[]>([]);
    const [relatedPosts, setRelatedPosts] = useState<BlogPostType[]>([]);
    const [error, setError] = useState<Error | null>(null);

    const RelatedData = async () => {
        if (!id || !email) notFound();

        try {
            const response = await fetch(`/api/blog?tags=${tags.slice(0, 3).join(',')}&email=${email}&limit=5`);
            const { authorPosts, relatedPostsResponse } = await response.json();
            setAuthorPosts(authorPosts);
            setRelatedPosts(relatedPostsResponse);
        }
        catch (error: any) {
            // alert("Error fetching related posts: " + error.message);
            setError(error);
            // refetch();
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            await RelatedData();
        };
        fetchData();
    }, []);

    return { authorPosts, relatedPosts, error };
};

export default useBlogPost;