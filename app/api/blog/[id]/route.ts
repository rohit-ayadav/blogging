import { connectDB } from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";
import Blog from "@/models/blogs.models";
import { getSessionAtHome } from "@/auth";
import { isValidObjectId } from "mongoose";
import { isValidSlug, makeValidSlug } from "@/lib/common-function";

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
  // if not valid id or slug return 404 
  let isSlug = false;
  if (!isValidObjectId(id)) {
    isSlug = isValidSlug(id);
  }
  if (!isValidObjectId(id) && !isSlug) {
    return NextResponse.json(
      {
        message: "Invalid Blog ID or Slug",
        success: false
      },
      { status: 404 }
    );
  }

  console.log("id", id);
  let blog;
  if (isSlug) {
    blog = await Blog.findOne({ slug: id });
  }
  else {
    blog = await Blog.findById(id);
  }

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
        message: "Sorry, you are not authorized to update this blog",
        success: false
      },
      { status: 401 }
    );
  }
  try {
    const data = await request.json();
    let blog;
    if (isValidObjectId(id)) {
      blog = await Blog.findById(id);
    } else {
      blog = await Blog.findOne({ slug: id });
    }

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
          message: "Sorry, you are not authorized to update this blog",
          success: false
        },
        { status: 403 }
      );
    }
    if (!data.title || !data.content || !data.category || !data.language) {
      return NextResponse.json(
        {
          message: "Title, Content, Category and Language are required",
          success: false
        },
        { status: 400 }
      );
    }
    if (!data.slug) {
      data.slug = makeValidSlug(data.title);
    }

    if (!isValidSlug(data.slug)) {
      return NextResponse.json(
        {
          message: "Invalid slug",
          success: false
        },
        { status: 400 }
      );
    }

    // Check if slug is already taken
    const existingBlog = await Blog.findOne({ slug: data.slug });
    if (existingBlog && existingBlog._id.toString() !== blog._id.toString()) {
      let counter = 1;
      let newSlug = `${data.slug}-${counter}`;
      while (await Blog.findOne({ slug: newSlug })) {
        counter++;
        newSlug = `${data.slug}-${counter}`;
      }
      data.slug = newSlug;
    }

    // Check if data is changed or not
    if (
      blog.title === data.title &&
      blog.thumbnail === data.thumbnail &&
      blog.content === data.content &&
      blog.tags === data.tags &&
      blog.category === data.category &&
      blog.language === data.language &&
      blog.slug === data.slug
    ) {
      return NextResponse.json(
        {
          message: "No changes found to update",
          success: true
        },
        { status: 200 }
      );
    }

    blog.title = data.title;
    blog.thumbnail = data.thumbnail;
    blog.content = data.content;
    blog.tags = data.tags;
    blog.category = data.category;
    blog.language = data.language;
    blog.slug = data.slug;

    const result = await blog.save();
    if (!result) {
      return NextResponse.json(
        {
          message: "Something went wrong",
          success: false
        },
        { status: 500 }
      );
    }
    return NextResponse.json({
      message: "Blog updated successfully",
      data: result,
      success: true
    });
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
