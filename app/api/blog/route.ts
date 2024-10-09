import { NextRequest, NextResponse } from "next/server";
import Blog from "../../../models/blogs.models";
import { connectDB } from "../../../utils/db";
import Joi from "joi";
import { JSDOM } from "jsdom";
import DOMPurify from "dompurify";

connectDB();

const blogSchema = Joi.object({
  title: Joi.string().required(),
  // thumbnail: Joi.string().optional(),
  content: Joi.string().required(),
  status: Joi.string().valid("published", "draft").optional(),
  tags: Joi.array().items(Joi.string()).optional(),
});

export async function POST(request: NextRequest) {
  const body = await request.json();

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

  const { title, content, status = "published", tags } = body;

  const { window } = new JSDOM("");
  const purify = DOMPurify(window);
  const sanitizedContent = purify.sanitize(content);

  const blogPost = new Blog({
    title,
    // thumbnail,
    content: sanitizedContent,
    status,
    tags,
  });

  try {
    await blogPost.save();
    return NextResponse.json(
      {
        message: "Blog post created successfully",
        success: true,
        data: blogPost,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error saving blog post:", error);
    return NextResponse.json(
      {
        message: "Failed to create blog post",
        success: false,
        error,
      },
      { status: 500 }
    );
  }
}
