import { connectDB } from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";
import Blog from "@/models/blogs.models";

await connectDB();

export async function GET(request: NextRequest) {
  // id is after the last slash in the URL
  const id = request.nextUrl.pathname.split("/").pop();

  if (!id) {
    const authorId = request.nextUrl.searchParams.get("author");
    if (!authorId) {
      return NextResponse.json(
        {
          message: "Blog ID or Author ID is required",
          success: false,
        },
        { status: 400 }
      );
    }
    const blogs = await Blog.find({createdBy: authorId});
    return NextResponse.json({ data: blogs, success: true });
    

  }
  const blog = await Blog.findById(id);
  if (!blog) {
    return NextResponse.json(
      {
        message: "Blog not found",
        success: false,
      },
      { status: 404 }
    );
  }
  return NextResponse.json({ data: blog, success: true });
}
