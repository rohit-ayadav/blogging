import { BlogPostType } from "@/types/blogs-types";
import { connectDB } from "@/utils/db";
import Blog from "@/models/blogs.models";
import User from "@/models/users.models";
import { Metadata } from "next";
import { ErrorMessage } from "@/app/blogs/[id]/ErrorMessage";
import AuthorPage from "@/app/profile/id-omponent/Profile";
import { Author } from "@/app/profile/id-omponent/Profile";
import { isValidObjectId } from "mongoose";
import serializeDocument from "@/utils/date-formatter";

async function getPostData(id: string) {
    try {
        await connectDB();
        let user: Author | null = null;
        if (!isValidObjectId(id)) {
            const username = decodeURIComponent(id);
            user = await User.findOne({ username }).lean() as Author;
        } else {
            user = await User.findById(id).lean() as Author;
        }
        // console.log(`User: ${JSON.stringify(user)}`);
        if (!user) {
            return { success: false, statusCode: 404 };
        }
        let postData = await Blog.find({ createdBy: user.email }).lean() as BlogPostType[];
        if (!postData || postData.length === 0) {
            return { success: false, statusCode: 404 };
        }
        user = serializeDocument(user);
        postData = postData.map(serializeDocument);
        return {
            success: true,
            data: postData as BlogPostType[],
            author: user ? { ...user, _id: user._id.toString() } as Author : null
        };
    } catch (error) {
        return { success: false, error: (error as Error).message };
    }
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
    const response = await getPostData(params.id);
    if (!response || !response.success || !response.author) {
        return {
            title: "Author Not Found | TheFoodBlogger",
            description: "The requested author profile could not be found on TheFoodBlogger.",
            openGraph: {
                title: "Author Not Found",
                description: "This author does not exist or has not published any posts.",
                images: [
                    { url: "/default-thumbnail.jpg", width: 1200, height: 630 }
                ]
            }
        };
    }

    const { author, data: posts } = response;
    const postTitles = posts.map(post => post.title).slice(0, 3).join(", ");
    const description = `Discover ${author.name}'s latest blog posts on TheFoodBlogger: ${postTitles}`;

    return {
        title: `${author.name}'s Profile | TheFoodBlogger`,
        description,
        openGraph: {
            title: `${author.name} - Developer Blogs`,
            description,
            images: [{ url: author.image || "/default-thumbnail.jpg", width: 1200, height: 630 }],
            url: `/author/${author.username}`
        },
        twitter: {
            card: "summary_large_image",
            title: `${author.name} - Developer Blogs`,
            description,
            images: [{ url: author.image || "/default-thumbnail.jpg" }]
        }
    };
}

export async function generateStaticParams() {
    await connectDB();
    const users = await User.find();
    return users.map((user) => ({ params: { id: user._id.toString() } }));
    // Return an array of objects containing the params which is the id of the user
}

export default async function IndividualProfile({ params }: { params: { id: string } }) {
    const response = await getPostData(params.id);

    if (!response || !response.success) {
        switch (response.statusCode) {
            case 404:
                return <ErrorMessage message="Author not found" />;
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
    if (!response.author) {
        return <ErrorMessage message="Author not found" />;
    }

    return <AuthorPage author={response.author} authorPosts={response.data} />;
}