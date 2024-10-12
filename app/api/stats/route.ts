import { connectDB } from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/users.models";
import Blog from "@/models/blogs.models";

await connectDB();

export async function GET() {
  try {
    const users = await User.find();
    const blogs = await Blog.find();
    const total = {
      blogs: blogs.length,
      likes: blogs.reduce((acc, blog) => acc + blog.likes, 0),
      views: blogs.reduce((acc, blog) => acc + blog.views, 0),
      users: users.length,
    };
    return NextResponse.json({
      message: "Stats fetched successfully",
      total,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
