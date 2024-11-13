import { connectDB } from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";
import Blog from "@/models/blogs.models";
import { getSessionAtHome } from "@/auth";

connectDB();

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get("email");
  if (!id) {
    return NextResponse.json(
      {
        message: "Email is required",
        success: false,
      },
      { status: 400 }
    );
  }
  try {
    const blogs = await Blog.find({ createdBy: id });
    if (!blogs) {
      return NextResponse.json(
        {
          message: "No blog post found",
          success: false,
        },
        { status: 404 }
      );
    }
    // Sort by views or likes or date
    // blogs.sort((a, b) => b.views - a.views);
    // blogs.sort((a, b) => b.likes - a.likes);
    blogs.sort((a, b) => b.createdAt - a.createdAt);

    return NextResponse.json({ blogs, success: true });
  } catch (error: any) {
    console.error("Error fetching blog:", error);
    return NextResponse.json(
      {
        message: error.message || "Something went wrong",
        success: false,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, response: NextResponse) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get("email");
  if (!id) {
    return NextResponse.json(
      {
        message: "Email is required",
        success: false,
      },
      { status: 400 }
    );
  }
  const session = await getSessionAtHome();
  if (!session) {
    return NextResponse.json(
      {
        message: "You need to be logged in to delete a blog post",
        success: false,
      },
      { status: 401 }
    );
  }
  if (!session.user || session.user.email !== id) {
    return NextResponse.json(
      {
        message: "You are not authorized to delete this blog post",
        success: false,
      },
      { status: 401 }
    );
  }
  try {
    const blogs = await Blog.deleteMany({ createdBy: id });
    if (!blogs) {
      return NextResponse.json(
        {
          message: "No blog post found",
          success: true,
        },
        { status: 200 }
      );
    }
    return NextResponse.json({ blogs, success: true });
  } catch (error: any) {
    console.error("Error deleting blog:", error);
    return NextResponse.json(
      {
        message: error.message || "Something went wrong",
        success: false,
      },
      { status: 500 }
    );
  }
}
