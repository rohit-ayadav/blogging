import { connectDB } from "@/utils/db";
import User from "@/models/users.models";
import Blog from "@/models/blogs.models";
import { BlogPostType, UserType } from "@/types/blogs-types";
import HomePage from "../../components/HomePageComponent";
import { ErrorMessage } from "./blogs/[id]/ErrorMessage";

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

    // convert createdAt and all dates to string, _id to string
    posts.forEach(post => post.createdAt = post.createdAt.toString());
    users.forEach(user => user.createdAt = user.createdAt.toString());
    users.forEach(user => (user as UserType)._id = (user as UserType)._id.toString());

    // Convert `_id` from ObjectId to string because Next.js doesn't support ObjectId
    posts.forEach(post => (post as BlogPostType)._id = (post as BlogPostType)._id.toString());

    return {
        success: true,
        posts: posts as BlogPostType[],
        users: users as UserType[],
        totalBlogs,
        totalUsers,
        totalLikes,
        totalViews
    };
}

export default async function HomePage1() {
    const { success, posts, users, totalBlogs, totalUsers, totalLikes, totalViews } = await getPostData();
    if (!success) {
        return <ErrorMessage message="An error occurred while fetching data. Please try again later." />
    }
    return <HomePage posts={posts} users={users} totalLikes={totalLikes} totalViews={totalViews} totalBlogs={totalBlogs} totalUsers={totalUsers} />;
}