import { connectDB } from "@/utils/db";
import Comment from "../../../models/comment.models";
import { NextRequest, NextResponse } from "next/server";
import { valid } from "joi";
import { isValidObjectId } from "mongoose";
import User from "@/models/users.models";
import Blog from "@/models/blogs.models";
import { getSessionAtHome } from "@/auth";
import { isValidSlug } from "@/lib/common-function";

await connectDB();

export async function POST(req: NextRequest) {
  const { postId, name, email, content } = await req.json();
  const session = await getSessionAtHome();
  if (!session) {
    return NextResponse.json(
      { message: "Not authorized to post comment." },
      { status: 401 }
    );
  }

  if (!postId || !name || !email || !content) {
    return NextResponse.json(
      { message: "All fields are required." },
      { status: 400 }
    );
  }

  try {
    const newComment = new Comment({ postId, name, email, content });
    await newComment.save();
    return NextResponse.json(newComment, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error saving comment.", error },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest, res: NextResponse) {
  const { searchParams } = new URL(req.url);
  const postId = searchParams.get("postId");
  if (!postId) {
    return NextResponse.json(
      { message: "postId is required." },
      { status: 400 }
    );
  }
  if (!isValidObjectId(postId)) {
    if (!isValidSlug(postId)) {
      return NextResponse.json({ message: "Invalid postId." }, { status: 400 });
    }
  }

  try {
    let comments;
    if (isValidObjectId(postId)) {
      comments = await Comment.find({ postId });
    } else {
      const post = await Blog.findOne({ slug: postId });
      if (!post) {
        return NextResponse.json(
          { message: "Post not found." },
          { status: 404 }
        );
      }
      comments = await Comment.find({ postId: post._id });
    }

    if (!comments) {
      return NextResponse.json(
        { message: "No comments found for this post." },
        { status: 404 }
      );
    }

    return NextResponse.json(comments, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching comments.", error },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, res: NextResponse) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ message: "id is required." }, { status: 400 });
  }
  if (!isValidObjectId(id)) {
    return NextResponse.json({ message: "Invalid id." }, { status: 400 });
  }

  try {
    const comment = await Comment.findByIdAndDelete(id);
    if (!comment) {
      return NextResponse.json(
        { message: "Comment not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error deleting comment.", error },
      { status: 500 }
    );
  }
}
