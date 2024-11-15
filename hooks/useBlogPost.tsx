// File: hooks/useBlogPost.tsx
"use client";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { BlogPostType, Author } from "@/types/blogs-types";

const useBlogPost = (id: string, initialData: BlogPostType | null = null) => {
    const router = useRouter();
    const [post, setPost] = useState<BlogPostType | null>(initialData);
    const [author, setAuthor] = useState<Author | null>(null);
    const [authorPosts, setAuthorPosts] = useState<BlogPostType[]>([]);
    const [relatedPosts, setRelatedPosts] = useState<BlogPostType[]>([]);
    const [likes, setLikes] = useState(0);
    const [views, setViews] = useState(0);
    const [liked] = useState(false);
    const [createdBy, setCreatedBy] = useState<string | null>(null);
    const [language, setLanguage] = useState<string | null>(null);

    const fetchPostAndRelatedData = async () => {
        if (id) {
            let data;
            try {
                const response = await fetch(`/api/blog/${id}`);
                if (!response.ok) {
                    throw new Error(`${response.status} - ${response.statusText}`);
                }
                data = await response.json();
                setPost(data.data);
                setLikes(data.data.likes);
                setViews(data.data.views);
                setCreatedBy(data.data.createdBy);
                setLanguage(data.language);
            } catch (error: any) {
                toast.error(`${error.message}`);
                router.push("/blogs");
            }
            try {
                const authorResponse = await fetch(
                    `/api/user?email=${data.data.createdBy}`
                );
                if (!authorResponse.ok) {
                    throw new Error(
                        `${authorResponse.status} - ${authorResponse.statusText}`
                    );
                }
                const authorData = await authorResponse.json();
                setAuthor(authorData.user);
            }
            catch (error: any) {
                toast.error(error.message);
            }

            try {
                const authorPostsResponse = await fetch(
                    `/api/blogpost?email=${data.data.createdBy}`
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
                toast.error(error.message);
            }
            try {
                const relatedPostsResponse = await fetch(
                    `/api/blog?tags=${data.data.tags.join(",")}&limit=4`
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
                // toast.error("An error occurred while fetching blog post data");
            }
        }
    };

    useEffect(() => {
        fetchPostAndRelatedData();
    }, [id]);



    return {
        post,
        author,
        relatedPosts,
        authorPosts,
        likes,
        views,
        liked,
        createdBy,
        isLoading: !post,
        error: !post ? new Error("Post not found") : null,
        language,
    };
};


export default useBlogPost;

