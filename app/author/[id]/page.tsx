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
            title: "Author Not Found | DevBlogger",
            description: "The requested author profile could not be found on DevBlogger. Explore expert developer blogs, coding insights, and web development trends.",
            openGraph: {
                title: "Author Not Found",
                description: "This author does not exist or has not published any posts. Discover top programming blogs and tech articles on DevBlogger.",
                images: [{ url: "/default-thumbnail.jpg", width: 1200, height: 630 }]
            }
        };
    }

    const { author } = response;

    // Function to split name after the second space
    function formatAuthorName(name: string): string {
        const words = name.split(" ");
        return words.length > 2 ? `${words.slice(0, 2).join(" ")}...` : name;
    }

    const authorName = formatAuthorName(author.name);
    const description = `Explore expert blogs by ${author.name} on DevBlogger. Read coding tutorials, web development tips, and tech insights.`;

    const url = `https://www.devblogger.in/author/${author.username}`;
    const thumbnail = author.image || "/default-thumbnail.jpg";

    return {
        title: `${authorName} - Dev Blogs, Coding Guides & Tech Insights | DevBlogger`,
        description,
        openGraph: {
            title: `${authorName} - Developer Blogs & Coding Tutorials`,
            description,
            url,
            siteName: "DevBlogger",
            type: "profile",
            images: [{ url: thumbnail, width: 1200, height: 630 }],
            locale: "en_US"
        },
        twitter: {
            card: "summary_large_image",
            site: "@DevBlogger",
            creator: `@${author.username}`,
            title: `${authorName} - Dev Blogs & Tech Tutorials`,
            description,
            images: [{ url: thumbnail }]
        },
        alternates: {
            canonical: url
        },
        other: {
            "robots": "index, follow",
            "og:profile:first_name": author.name.split(" ")[0],
            "og:profile:last_name": author.name.split(" ").slice(1).join(" ") || "",
            "og:profile:username": author.username
        }
    };
}

export async function generateStaticParams() {
    await connectDB();
    const posts = await User.find({}, { username: 1, _id: 1 });

    return posts.flatMap(post => [
        { id: post._id.toString() },
        { id: post.username }
    ]);
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