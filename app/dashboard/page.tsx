"use server";
import React from "react";
import { connectDB } from "@/utils/db";
import User from "@/models/users.models";
import Blog from "@/models/blogs.models";
import MonthlyStats from "@/models/monthlyStats";
import { getSessionAtHome } from "@/auth";
import AuthorDashboard from "./Dashboard";
import { ErrorMessage } from "../blogs/[id]/ErrorMessage";
import { BlogPostType } from "@/types/blogs-types";
import { UserType } from "@/types/blogs-types";
import serializeDocument from "@/utils/date-formatter";

interface AuthorData {
    user: UserType;
    blogs: BlogPostType[];
    monthlyStats: {
        blog: string; month: string; views: number; likes: number;
    }[];
}

async function getPersonalAuthorData() {
    // this function will return information of person, blogs written by him and monthly stats of his blogs
    try {
        await connectDB();
        const session = await getSessionAtHome();
        // const user = await User.findOne({ email: session.user.email }).lean() as UserType;
        // const blogs = await Blog.find({ createdBy: session.user.email }).lean() as BlogPostType[];
        const [user, blogs] = await Promise.all([
            User.findOne({ email: session.user.email }).lean() as unknown as UserType,
            Blog.find({ createdBy: session.user.email }).lean() as unknown as BlogPostType[]
        ]);
        // get monthly stats of blogs , stored as Total likes, Total views, Total comments, Total shares of particular month
        const monthlyStats = await MonthlyStats.find({ blog: { $in: blogs.map(blog => blog._id) } }).lean();

        const formattedMonthlyStats = monthlyStats.map(stat => ({
            blog: stat.blog.toString(),
            month: stat.month,
            views: stat.views || 0,
            likes: stat.likes || 0,
        }));
        const serializeUser = serializeDocument(user);
        const serializeBlogs = blogs.map(blog => serializeDocument(blog));
        return { user: serializeUser, blogs: serializeBlogs, monthlyStats: formattedMonthlyStats };
    } catch (error: any) {
        return error;
    }
}

const Dashboard = async () => {
    const response = await getPersonalAuthorData();
    if (!response) {
        return <ErrorMessage message="No data found" />;
    }
    if (response instanceof Error) {
        return <ErrorMessage message={response.message} />;
    }

    return (
        <AuthorDashboard user={response.user} blogs={response.blogs} monthlyStats={response.monthlyStats} />
    );
}

export default Dashboard;