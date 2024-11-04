import { connectDB } from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/users.models";
import Blog from "@/models/blogs.models";

await connectDB();

export async function GET() {
  try {
    /*
    Total number of blogs, likes, views, user, and author (which user has no of blogs)
    */
    const totalBlogs = await Blog.countDocuments();
    const totalLikes = await Blog.aggregate([
      { $group: { _id: null, totalLikes: { $sum: "$likes" } } }
    ]);
    const totalViews = await Blog.aggregate([
      { $group: { _id: null, totalViews: { $sum: "$views" } } }
    ]);
    const totalUsers = await User.countDocuments();
    const totalAuthors = await Blog.aggregate([
      {
        $group: {
          _id: "$createdBy",
          totalBlogs: { $sum: 1 }
        }
      },
      { $sort: { totalBlogs: -1 } },
      { $limit: 1 }
    ]);


    return NextResponse.json({
      totalBlogs,
      totalLikes: totalLikes[0]?.totalLikes || 0,
      totalViews: totalViews[0]?.totalViews || 0,
      totalUsers,
      totalAuthors: totalAuthors[0] || { _id: "", totalBlogs: 0 },
    });
  } catch (error) {
    return NextResponse.json(
      {
        message: (error as Error).message,
        success: false,
        error
      },
      { status: 500 }
    );
  }
}