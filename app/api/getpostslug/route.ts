import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/utils/db";
import Blog from "@/models/blogs.models";

await connectDB();

export async function GET(request: NextRequest) {

    const posts = await Blog.find({}, { slug: 1, _id: 1 });
    const paths = posts.map(post => ({
        params: {
            id: post._id.toString(),
            slug: post.slug
        }
    }));

    return NextResponse.json(paths);
}