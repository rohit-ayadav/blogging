import { connectDB } from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";
import Blog from "@/models/blogs.models";
import { getSessionAtHome } from "@/auth";

await connectDB();

export async function GET(request: NextRequest) {
  const id = request.nextUrl.pathname.split("/").pop();

  if (!id) {
    const authorId = request.nextUrl.searchParams.get("author");
    if (!authorId) {
      return NextResponse.json(
        {
          message: "Blog ID or Author ID is required",
          success: false
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
        success: false
      },
      { status: 404 }
    );
  }

  blog.views = (blog.views || 0) + 1;
  await blog.save();

  return NextResponse.json({
    message: "Blog found",
    data: blog,
    success: true
  });
}

export async function PUT(request: NextRequest) {
  const id = request.nextUrl.pathname.split("/").pop();
  if (!id) {
    return NextResponse.json(
      {
        message: "Blog ID is required",
        success: false
      },
      { status: 400 }
    );
  }
  const session = await getSessionAtHome();
  if (!session) {
    return NextResponse.json(
      {
        message: "Unauthorized",
        success: false
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
          success: false
        },
        { status: 404 }
      );
    }
    if (session?.user?.email !== blog.createdBy) {
      return NextResponse.json(
        {
          message: "You are not authorized to update this blog",
          success: false
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
        success: false
      },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  await connectDB();
  // This api will be used to update the category of a blog

  const session = await getSessionAtHome();
  if (!session) {
    return createResponse({ message: "Unauthorized", success: false }, 401);
  }
  const id = request.nextUrl.pathname.split("/").pop();
  console.log("id", id);
  if (!id) {
    return createResponse(
      { message: "Blog ID is required", success: false },
      400
    );
  }
  try {
    const data = await request.json();
    if (!data.category) {
      return createResponse(
        { message: "Category is required", success: false },
        400
      );
    }
    const blog = await Blog.findById(id);
    if (!blog) {
      return createResponse({ message: "Blog not found", success: false }, 404);
    }
    // if (session?.user?.email !== blog.createdBy) {
    //   return createResponse(
    //     {
    //       message: "You are not authorized to update this blog",
    //       success: false
    //     },
    //     403
    //   );
    // }
    blog.category = data.category;
    const result = await blog.save();

    if (!result) {
      return createResponse(
        { message: "Something went wrong", success: false },
        500
      );
    }
    console.log(
      `result.category === data.category`,
      result.category,
      data.category
    );
    if (result.category === data.category) {
      return createResponse(
        {
          message: "Category updated successfully",
          success: true
        },
        200
      );
    }
    return createResponse(
      { message: "Something went wrong", success: false },
      500
    );
  } catch (error: any) {
    console.error("Error updating blog:", error);
    return createResponse(
      {
        message: error.message || "Something went wrong",
        success: false
      },
      500
    );
  }
}
function createResponse(data: any, status: number) {
  return NextResponse.json(data, { status });
}
