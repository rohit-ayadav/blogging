import { connectDB } from "@/utils/db";
import User from "@/models/users.models";
import Blog from "@/models/blogs.models";
import { BlogPostType, UserType } from "@/types/blogs-types";
import { ErrorMessage } from "./blogs/[id]/ErrorMessage";
import HomePage from "@/components/HomePageComponent";
import serializeDocument from "@/utils/date-formatter";

async function getPostData() {
    await connectDB();
    // find all posts, sort by createdAt, limit to 3 and Get all users who created the posts
    const posts = await Blog.find({}).sort({ createdAt: -1 }).limit(3).lean();
    const users = await User.find({ email: { $in: posts.map(post => post.createdBy) } }).lean();

    const totalBlogs = await Blog.countDocuments();
    const totalUsers = await User.countDocuments();

    const postForStats = await Blog.find({}).lean();
    const totalLikes = postForStats.reduce((acc, post) => acc + post.likes, 0);
    const totalViews = postForStats.reduce((acc, post) => acc + post.views, 0);

    // serialize each post and user
    const serializedPosts = posts.map(post => serializeDocument(post));
    const serializedUsers = users.map(user => serializeDocument(user));

    return {
        success: true,
        posts: serializedPosts as BlogPostType[],
        users: serializedUsers as UserType[],
        totalBlogs,
        totalUsers,
        totalLikes,
        totalViews
    };
}

export async function generateMetadata() {
    return {
        title: "TheFoodBlogger - A Blogging Platform for Developers",
        description: "Explore a user-friendly blogging platform built with Next.js. Effortlessly create, update, and share blogs on diverse topics with customizable features and an interactive interface.",
        keywords: "blogging, developer, blog, next.js, react, typescript, mongodb, vercel, nextjs, next,js, next-js, next.js blog, next.js blogging, next.js blog website, next.js blog platform, next.js blog app, next.js blog template, next.js blog example, next.js blog post, next.js blog tutorial, next.js blog website template, next.js blog website example, next.js blog website tutorial, next.js blog website project, next.js blog website code, next.js blog website design, next.js blog website development, next.js blog website app, next.js blog website platform, next.js blog website features, next.js blog website interface, next.js blog website user-friendly, next.js blog website customizable, next.js blog website interactive, next.js blog website share, next.js blog website update, next.js blog website create, next.js blog website effortlessly, next.js blog website diverse, next.js blog website topics, next.js blog website built, next.js blog website explore,TheFoodBlogger, Dev Blogger, Developer Blogger, Dev Blog, Developer Blog, Blog for Developers, Blogging",
        manifest: "/manifest.json?v=1.0.6",
        appleWebApp: {
            capable: true,
            statusBarStyle: "black",
            title: "Blog Website",
        },
        icons: {
            icon: [
                { url: "/icons/android/android-launchericon-48-48.png", sizes: "48x48", type: "image/png" },
                { url: "/icons/android/android-launchericon-72-72.png", sizes: "72x72", type: "image/png" },
                { url: "/icons/android/android-launchericon-96-96.png", sizes: "96x96", type: "image/png" },
                { url: "/icons/android/android-launchericon-144-144.png", sizes: "144x144", type: "image/png" },
                { url: "/icons/android/android-launchericon-192-192.png", sizes: "192x192", type: "image/png" },
                { url: "/icons/android/android-launchericon-512-512.png", sizes: "512x512", type: "image/png" },
            ],
        }
    }
}

export default async function HomePage1() {
    const { success, posts, users, totalBlogs, totalUsers, totalLikes, totalViews } = await getPostData();
    if (!success) {
        return <ErrorMessage message="An error occurred while fetching data. Please try again later." />
    }
    return <HomePage posts={posts} users={users} totalLikes={totalLikes} totalViews={totalViews} totalBlogs={totalBlogs} totalUsers={totalUsers} />;
}