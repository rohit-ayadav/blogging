import { connectDB } from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";
import Blog from "@/models/blogs.models";
import { getToken } from "next-auth/jwt";
import { getSession } from "next-auth/react";

interface CustomSession {
  email: string;
  user: {
    email: string;
  };
  // Add other properties if needed
}

connectDB();

export async function GET(request: NextRequest, response: NextResponse) {
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
          message: "You have not created any blog post",
          success: false,
        },
        { status: 404 }
      );
    }
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
  const session = (await getSession({
    req: { headers: Object.fromEntries(request.headers) },
  })) as CustomSession | null;
  if (!session) {
    return NextResponse.json(
      {
        message: "You need to be logged in to create a blog post",
        success: false,
      },
      { status: 401 }
    );
  }
  if (session.user.email !== id) {
    console.log(`\n\nSession email: ${session.user.email}\nId: ${id}\n\n`);
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
          success: false,
        },
        { status: 404 }
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
