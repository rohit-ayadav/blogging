import { connectDB } from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";
import Blog from "@/models/blogs.models";
import { getSessionAtHome } from "@/auth";
import User from "@/models/users.models";

await connectDB();


export async function PATCH(request: NextRequest) {
  await connectDB();
  // This api will be used to update the category of a blog

  const session = await getSessionAtHome();
  if (!session) { return NextResponse.json({ message: "You need to be logged in to update a blog post", success: false }, { status: 401 }); }
  const id = request.nextUrl.pathname.split("/").pop();
  if (!id) { return NextResponse.json({ message: "Blog id is required", success: false }, { status: 400 }); }

  try {
    const data = await request.json();
    if (!data.category) { return NextResponse.json({ message: "Category is required", success: false }, { status: 400 }); }
    const blog = await Blog.findById(id);
    if (!blog) { return NextResponse.json({ message: "Blog not found", success: false }, { status: 404 }); }
    const userRole = await User.findOne({ email: session.user.email }).select("role");
    if (session?.user?.email !== blog.createdBy || userRole?.role !== "admin") { return NextResponse.json({ message: "You are not authorized to update this blog", success: false }, { status: 403 }); }

    blog.category = data.category;
    const result = await blog.save();

    if (!result) { return NextResponse.json({ message: "Something went wrong", success: false }, { status: 500 }); }
    if (result.category === data.category) { return NextResponse.json({ message: "Blog updated successfully", success: true }, { status: 200 }); }
    return NextResponse.json({ message: "Something went wrong", success: false }, { status: 500 });
  } catch (error: any) {
    console.error("Error updating blog:", error);
    return NextResponse.json({ message: "Something went wrong", success: false }, { status: 500 });
  }
}