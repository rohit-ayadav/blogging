import { connectDB } from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";
import Blog from "@/models/blogs.models";

await connectDB();

export async function POST(request: NextRequest) {
  const id = request.nextUrl.pathname.split("/").slice(-2, -1)[0];
  console.log(`\n\n\n\n\nMessage from like route: ${id}`);
  if (!id) {
    return NextResponse.json(
      {
        message: "Blog ID is required",
        success: false,
      },
      { status: 400 }
    );
  }
  try {
    const post = await Blog.findById(id);
    if (!post) {
      return NextResponse.json(
        {
          message: "Blog not found",
          success: false,
        },
        { status: 404 }
      );
    }
    if (post.likes > 0) {
      post.likes = post.likes - 1;
    } else {
      post.likes = 0;
    }

    await post.save();
    return NextResponse.json({ data: post, success: true });
  } catch (error) {
    console.error("Error saving blog post:", error);
    return NextResponse.json(
      {
        message: (error as Error).message,
        success: false,
        error,
      },
      { status: 500 }
    );
  }
}
