"use client";

import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { notFound } from "next/navigation";
import { BlogPostType } from "@/types/blogs-types";
import serializeDocument from "@/utils/date-formatter";

const useBlogPost = ({ email, category, id }: { email: string; category: string; id: string }) => {
    const [authorPosts, setAuthorPosts] = useState<BlogPostType[]>([]);
    const [relatedPosts, setRelatedPosts] = useState<BlogPostType[]>([]);
    const [error, setError] = useState<Error | null>(null);
    const [loading, setLoading] = useState(true);

    const RelatedData = async () => {
        if (!id || !email) notFound();
        setLoading(true);

        try {
            const response = await fetch(`/api/blog?category=${category}&email=${email}&limit=5&id=${id}`);
            const { authorPosts, relatedPosts } = await response.json();
            // eliminate the current post from the related posts
            // const filteredRelatedPosts = relatedPosts.filter((post: BlogPostType) => String(post._id) !== String(id));
            const filteredAuthorPosts = authorPosts.filter((post: BlogPostType) => String(post._id) !== String(id));
            setAuthorPosts(filteredAuthorPosts);
            // setRelatedPosts(filteredRelatedPosts);
            setRelatedPosts(relatedPosts);
        }
        catch (error: any) {
            // alert("Error fetching related posts: " + error.message);
            setError(error);
            // refetch();
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            await RelatedData();
        };
        fetchData();
    }, []);

    const serializeAuthorPosts = authorPosts.map((post: BlogPostType) => serializeDocument(post));
    const serializeRelatedPosts = relatedPosts.map((post: BlogPostType) => serializeDocument(post));
    return { authorPosts: serializeAuthorPosts, relatedPosts: serializeRelatedPosts, error, loading };
};

export default useBlogPost;