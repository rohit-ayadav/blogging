import { connectDB } from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/users.models";
import Blog from "@/models/blogs.models";

export async function GET(
  request: NextRequest,
  { params }: { params: { category: string } }
) {
  try {
    await connectDB();

    if (!params.category) {
      console.log(`Category not found,${params.category}`);
      params.category = "all";
    }
    console.log(`Found, ${params.category}`);

    const query = params.category ? { category: params.category } : {};
    let blogs;
    if (!params.category || params.category == "all") {
      blogs = await Blog.find();
    } else {
      blogs = await Blog.find(query);
    }
    const users = await User.find();

    const totalBlogs = blogs.length;
    const totalUsers = users.length;
    const totalLikes = blogs.reduce((acc, blog) => acc + blog.likes, 0);
    const totalViews = blogs.reduce((acc, blog) => acc + blog.views, 0);

    return NextResponse.json({
      totalBlogs,
      totalUsers,
      totalLikes,
      totalViews
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
