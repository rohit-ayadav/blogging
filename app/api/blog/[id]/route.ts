import { connectDB } from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";
import Blog from "@/models/blogs.models";
import { getSessionAtHome } from "@/auth";

await connectDB();

// This api is used to get a blog by its ID
// or get all blogs by an author

export async function GET(request: NextRequest) {
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
    const blogs = await Blog.find({ createdBy: authorId });
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

  blog.views = (blog.views || 0) + 1;
  await blog.save();

  return NextResponse.json({ data: blog, success: true });
}

export async function PUT(request: NextRequest) {
  const id = request.nextUrl.pathname.split("/").pop();
  if (!id) {
    return NextResponse.json(
      {
        message: "Blog ID is required",
        success: false,
      },
      { status: 400 }
    );
  }
  const session = await getSessionAtHome();
  if (!session) {
    return NextResponse.json(
      {
        message: "Unauthorized",
        success: false,
      },
      { status: 401 }
    );
  }
  try {
    const data = await request.json();
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
    if (session?.user?.email !== blog.createdBy) {
      return NextResponse.json(
        {
          message: "You are not authorized to update this blog",
          success: false,
        },
        { status: 403 }
      );
    }

    blog.title = data.title;
    blog.thumbnail = data.thumbnail;
    blog.content = data.content;
    blog.tags = data.tags;

    await blog.save();
    return NextResponse.json({ data: blog, success: true });
  } catch (error: any) {
    console.error("Error updating blog:", error);
    return NextResponse.json(
      {
        message: error.message || "Something went wrong",
        success: false,
      },
      { status: 500 }
    );
  }
}
