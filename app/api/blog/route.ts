import { NextRequest, NextResponse } from "next/server";
import Blog from "../../../models/blogs.models";
import { connectDB } from "../../../utils/db";
import Joi, { optional } from "joi";
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
  cateogry: Joi.string().optional(),
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

  let { title, content, status = "published", tags, thumbnail, category } = body;

  if (!session?.user?.email) {
    return NextResponse.json(
      {
        message: "You need to be logged in to create a blog post",
        success: false,
      },
      { status: 401 }
    );
  }
  if (!content) {
    return NextResponse.json(
      {
        message: "Content is required",
        success: false,
      },
      { status: 400 }
    );
  }

  if (!title) {
    return NextResponse.json(
      {
        message: "Title is required",
        success: false,
      },
      { status: 400 }
    );
  }
  if (!thumbnail) {
    // thumbnail is optional
    thumbnail = "";
  }
  if (!category) {
    // category is optional
    category = "Others";
  }

  const { error } = blogSchema.validate({
    title,
    content,
    status,
    tags,
    // thumbnail,
  });
  if (error) {
    return NextResponse.json(
      {
        message: error.message,
        success: false,
      },
      { status: 400 }
    );
  }

  const { window } = new JSDOM("");
  const purify = DOMPurify(window);
  const sanitizedContent = purify.sanitize(content);
  const sanitizedTitle = purify.sanitize(title);
  const sanitizedTags = tags.map((tag: string) => purify.sanitize(tag));
  const sanitizedCategory = purify.sanitize(category);

  const blogPost = {
    title: sanitizedTitle,
    content: sanitizedContent,
    status,
    thumbnail,
    tags: sanitizedTags,
    createdBy: session.user.email,
    likes: 0,
    views: 0,
    category: sanitizedCategory,
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

export async function GET(request: Request) {
    try {
        // Get URL parameters
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '9');
        
        // Calculate skip value for pagination
        const skip = (page - 1) * limit;

        // Get total count of documents
        const totalCount = await Blog.countDocuments();

        // Fetch paginated data
        const data = await Blog.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        if (!data || data.length === 0) {
            return NextResponse.json(
                {
                    message: page === 1 ? "No blog posts found" : "No more blog posts",
                    success: false,
                    data: [],
                    metadata: {
                        currentPage: page,
                        totalPages: Math.ceil(totalCount / limit),
                        totalPosts: totalCount,
                        hasMore: false
                    }
                },
                { status: 404 }
            );
        }

        // Calculate pagination metadata
        const metadata = {
            currentPage: page,
            totalPages: Math.ceil(totalCount / limit),
            totalPosts: totalCount,
            hasMore: skip + data.length < totalCount
        };

        return NextResponse.json(
            {
                message: "Blog posts found",
                success: true,
                data,
                metadata
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error fetching blog posts:', error);
        return NextResponse.json(
            {
                message: "Error fetching blog posts",
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error occurred'
            },
            { status: 500 }
        );
    }
}

// Optional: Add a helper function to validate pagination parameters
function validatePaginationParams(page: number, limit: number) {
    const validatedPage = Math.max(1, page); // Ensure page is at least 1
    const validatedLimit = Math.min(Math.max(1, limit), 100); // Limit between 1 and 100
    return { page: validatedPage, limit: validatedLimit };
}