import { NextRequest, NextResponse } from "next/server";
import Blog from "../../../models/blogs.models";
import { connectDB } from "../../../utils/db";
import Joi from "joi";
import { JSDOM } from "jsdom";
import DOMPurify from "dompurify";
import User from "@/models/users.models";
import mongoose from "mongoose";
import { getSessionAtHome } from "@/auth";

await connectDB();

const blogSchema = Joi.object({
  title: Joi.string().required(),
  content: Joi.string().required(),
  status: Joi.string().valid("published", "draft").optional(),
  tags: Joi.array().items(Joi.string()).optional(),
  thumbnail: Joi.string().optional(),
});

export async function POST(request: NextRequest) {
  const body = await request.json();
  const session = await getSessionAtHome();
  if (!session) {
    return NextResponse.json(
      {
        message: "You need to be logged in to create a blog post",
        success: false,
      },
      { status: 401 }
    );
  }

  const { error } = blogSchema.validate(body);
  if (error) {
    return NextResponse.json(
      {
        message: error.details[0].message,
        success: false,
      },
      { status: 400 }
    );
  }

  const { title, content, status = "published", tags, thumbnail } = body;

  if (!session?.user?.email) {
    return NextResponse.json(
      {
        message: "You need to be logged in to create a blog post",
        success: false,
      },
      { status: 401 }
    );
  }

  const { window } = new JSDOM("");
  const purify = DOMPurify(window);
  const sanitizedContent = purify.sanitize(content);
  const sanitizedTitle = purify.sanitize(title);
  const sanitizedTags = tags.map((tag: string) => purify.sanitize(tag));

  const blogPost = {
    title: sanitizedTitle,
    content: sanitizedContent,
    status,
    thumbnail,
    tags: sanitizedTags,
    createdBy: session.user.email,
    likes: 0,
    views: 0,
  };

  try {
    const newBlogPost = new Blog(blogPost);
    await newBlogPost.save();
    const blogPostId = newBlogPost._id;
    
    await User.findOneAndUpdate(
      { email: session.user.email },
      {
        $inc: { noOfBlogs: 1 },
      }
    );

    return NextResponse.json(
      {
        message: "Blog post created successfully",
        success: true,
        data: blogPost,
        blogPostId,
      },
      { status: 201 }
    );
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

export async function DELETE(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json(
      {
        message: "Blog post id is required",
        success: false,
      },
      { status: 400 }
    );
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json(
      {
        message: "Invalid blog post id",
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

  const blogPost = await Blog.findById(id);
  if (!blogPost) {
    return NextResponse.json(
      {
        message: "Blog post not found",
        success: false,
      },
      { status: 404 }
    );
  }

  if (blogPost.createdBy !== session?.user?.email) {
    return NextResponse.json(
      {
        message: "You are not authorized to delete this blog post",
        success: false,
      },
      { status: 403 }
    );
  }

  try {
    await Blog.findByIdAndDelete(id);

    await User.findOneAndUpdate(
      { email: session?.user?.email },
      {
        $inc: { noOfBlogs: -1 },
      }
    );

    return NextResponse.json(
      {
        message: "Blog post deleted successfully",
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting blog post:", error);
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

export async function GET() {
  const data = await Blog.find().sort({ createdAt: -1 });
  if (!data) {
    return NextResponse.json(
      {
        message: "No blog post found",
        success: false,
      },
      { status: 404 }
    );
  }

  return NextResponse.json(
    {
      message: "Blog posts found",
      success: true,
      data,
    },
    { status: 200 }
  );
}
