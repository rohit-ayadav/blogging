import { notFound } from "next/navigation";
import { BlogPostType } from "@/types/blogs-types";
import { ErrorMessage } from "@/app/blogs/[id]/ErrorMessage";
import AuthorPage from "./component/Profile";
import { connectDB } from "@/utils/db";
import Blog from "@/models/blogs.models";
import User from "@/models/users.models";
import { Author } from "./component/Profile";
import { Metadata } from "next";

async function getPostData(id: string) {
    try {
        await connectDB();

        // Convert Mongoose document to plain JSON object
        const user = await User.findById(id).lean() as Author;
        if (!user) {
            return { success: false, statusCode: 404 };
        }

        let postData = await Blog.find({ createdBy: user.email }).lean() as BlogPostType[];
        if (!postData || postData.length === 0) {
            return { success: false, statusCode: 404 };
        }

        // Convert `_id` from ObjectId to string because Next.js doesn't support ObjectId
        postData = postData.map(post => ({
            ...post,
            _id: post._id.toString(), // Convert ObjectId to string
            createdAt: post.createdAt.toString(), // Convert Date to string
            updatedAt: post.updatedAt?.toString() // Convert Date to string
        }));

        return {
            success: true,
            data: postData as BlogPostType[],
            author: { ...user, _id: user._id.toString() } as Author // Convert user `_id`
        };
    } catch (error) {
        return { success: false, error: (error as Error).message };
    }
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
    const response = await getPostData(params.id);
    if (!response || !response.success) {
        return {
            title: "Not Found",
            description: "The requested page could not be found."
        };
    }
    if (!response.author) {
        return {
            title: "Not Found",
            description: "The requested page could not be found."
        };
    }
    const title = `${response.author.name}'s Profile`;
    const description = `View all posts by ${response.author.name}`;
    const thumbnail = response.author.image;

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            images: [{ url: thumbnail }]
        }
    };
}

export async function generateStaticParams() {
    await connectDB();
    const users = await User.find();
    return users.map((user) => ({ params: { id: user._id.toString() } }));
}

export default async function IndividualProfile({ params }: { params: { id: string } }) {
    const response = await getPostData(params.id);

    if (!response || !response.success) {
        switch (response.statusCode) {
            case 404:
                notFound(); // This will render the 404 page
            case 403:
                return <ErrorMessage message="You don't have permission to view this blog post" />;
            case 401:
                return <ErrorMessage message="Please login to view this blog post" />;
            default:
                return <ErrorMessage message={response.error || 'Failed to load blog post'} />;
        }
    }

    if (!response.data) {
        return <ErrorMessage message="No posts found for this author" />;
    }

    return <AuthorPage author={response.author} authorPosts={response.data} />;
}