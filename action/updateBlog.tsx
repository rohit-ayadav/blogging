"use server";
import { connectDB } from "@/utils/db";
import Blog from "@/models/blogs.models";
import { isValidObjectId } from "mongoose";
import { generateSeoSlug, isValidSlug, makeValidSlug } from "@/lib/common-function";
import { getSessionAtHome } from "@/auth";
import User from "@/models/users.models";
import { revalidatePath } from "next/cache";

await connectDB();

interface ResponseType {
    message: string;
    error: string;
}
interface UpdatePostType {
    title: string,
    content: string,
    thumbnail: string | null,
    thumbnailCredit: string | null,
    tags: string[],
    category: string,
    status: string,
    language: string,
    id: string,
    slug: string
}

// This function will be used to update the existing blog

export async function updateBlog(Post: UpdatePostType) {
    let isUpdatedByAdmin = false;
    if (!Post.id) {
        return {
            message: "",
            error: "Id is required"
        }
    }
    const session = await getSessionAtHome();
    if (!session) {
        return {
            message: "",
            error: "You need to be logged in to update the blog"
        }
    }
    try {
        let blog;
        if (isValidObjectId(Post.id)) {
            blog = await Blog.findById(Post.id);
        } else {
            blog = await Blog.findOne({ slug: Post.id });
        }
        if (!blog) {
            return {
                message: "",
                error: "Blog not found"
            }
        }

        const user = await User.findOne({ email: session.user.email });
        if (!user) {
            return {
                message: "",
                error: "User not found"
            }
        }

        if (session.user.email !== blog.createdBy) {
            if (user.role !== "admin") {
                console.log("\nYou are not authorized to update this blog post\n");
                return {
                    message: "",
                    error: "You are not authorized to update the blog"
                }
            }
            else {
                isUpdatedByAdmin = true;
            }
        }
        if (!Post.title || !Post.content || !Post.category || !Post.language) {
            return {
                message: "",
                error: "Title, Content, Category and Language are required"
            }
        }
        if (!Post.slug) {
            Post.slug = generateSeoSlug(Post.title);
        }
        if (!isValidSlug(Post.slug)) {
            return {
                message: "",
                error: "Invalid slug"
            }
        }
        // Check if slug is already taken
        const slugExist = await Blog.findOne({ slug: Post.slug });
        if (slugExist && slugExist._id.toString() !== Post.id) {
            return {
                message: "",
                error: "Slug is already taken"
            }
        }
        blog.title = Post.title;
        blog.content = Post.content;
        blog.thumbnail = Post.thumbnail;
        blog.thumbnailCredit = Post.thumbnailCredit;
        blog.tags = Post.tags;
        blog.category = Post.category;
        blog.status = Post.status;
        blog.language = Post.language;
        blog.slug = Post.slug;

        await blog.save();
        revalidatePath('/edit');
        revalidatePath(`/blogs/${blog.slug}`);
        revalidatePath(`/edit/${blog.slug}`);
        revalidatePath(`/blogs/${blog._id.toString()}`);
        revalidatePath(`/edit/${blog._id}`);
        return {
            message: `Blog post ${isUpdatedByAdmin ? `updated by admin ${session.user.name}` : "updated"} successfully`,
            error: ""
        }
    }
    catch (e) {
        return {
            message: "",
            error: (e as Error).message
        }
    }
}