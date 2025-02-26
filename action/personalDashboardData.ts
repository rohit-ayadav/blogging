"use server";
import { connectDB } from "@/utils/db";
import User from "@/models/users.models";
import Blog from "@/models/blogs.models";
import MonthlyStats from "@/models/monthlyStats";
import { getSessionAtHome } from "@/auth";
import serializeDocument from "@/utils/date-formatter";
import { BlogPostType, UserType } from "@/types/blogs-types";

export async function fetchAuthorData() {
    try {
        await connectDB();
        const session = await getSessionAtHome();
        if (!session?.user?.email) return { error: "Unauthorized: Please log in." };

        const [user, blogs] = await Promise.all([
            User.findOne({ email: session.user.email }).lean() as unknown as UserType,
            Blog.find({ createdBy: session.user.email }).lean() as unknown as BlogPostType[]
        ]);
        const monthlyStats = await MonthlyStats.find({ blog: { $in: blogs.map(blog => blog._id) } }).lean();

        return {
            user: serializeDocument(user),
            blogs: blogs.map(blog => serializeDocument(blog)),
            monthlyStats: monthlyStats.map(stat => ({
                blog: stat.blog.toString(),
                month: stat.month,
                views: stat.views || 0,
                likes: stat.likes || 0,
            }))
        };
    } catch (error) {
        return { error: "Something went wrong. Please try again." };
    }
}
