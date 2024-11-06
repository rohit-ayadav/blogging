import { connectDB } from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/users.models";
import Blog from "@/models/blogs.models";

// Define the route with the dynamic segment handler
export async function GET(
  request: NextRequest,
  { params }: { params: { category: string } }
) {
  try {
    // Connect to database
    await connectDB();

    if (!params.category) {
      console.log(`Category not found,${params.category}`);
      params.category = "all";
    }
    console.log(`Found, ${params.category}`);

    // Build query object based on category
    const query = params.category ? { category: params.category } : {};
    let blogs;
    if (!params.category || params.category == "all") {
      blogs = await Blog.find();
    } else {
      blogs = await Blog.find(query);
    }
    const users = await User.find();

    // Calculate stats like total blogs, total users, total likes,views,author(created by)
    const totalBlogs = blogs.length;
    const totalUsers = users.length;
    const totalLikes = blogs.reduce((acc, blog) => acc + blog.likes, 0);
    const totalViews = blogs.reduce((acc, blog) => acc + blog.views, 0);
    // Author by post have created by that unique number
    // const totalAuthor = 

    // Return the stats
    return NextResponse.json({
      totalBlogs,
      totalUsers,
      totalLikes,
      totalViews,
      // authorByPost
    });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
