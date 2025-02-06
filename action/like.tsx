"use server";

import { connectDB } from "@/utils/db";
import Blog from "@/models/blogs.models";
import { isValidObjectId } from "mongoose";
import { isValidSlug } from "@/lib/common-function";

await connectDB();

async function likePost(id: string): Promise<boolean> {
    if (!id) return false;
    try {
        const filter = isValidObjectId(id)
            ? { _id: id }
            : isValidSlug(id)
                ? { slug: id }
                : null;

        if (!filter) return false;
        const post = await Blog.findOneAndUpdate(
            filter,
            { $inc: { likes: 1 } },
            { new: true }
        );
        // console.log(post);
        return !!post;
    } catch (error) {
        console.error("Error liking blog post:", error);
        return false;
    }
}

async function dislikePost(id: string): Promise<boolean> {
    if (!id) return false;

    try {
        const filter = isValidObjectId(id)
            ? { _id: id }
            : isValidSlug(id)
                ? { slug: id }
                : null;

        if (!filter) return false;


        const post = await Blog.findOneAndUpdate(
            filter,
            { $inc: { likes: -1 } },
            {
                new: true,
                upsert: false,
                runValidators: true,
            }
        );


        if (post && post.likes < 0) {
            post.likes = 0;
            await post.save();
        }

        // console.log(post);
        return !!post;
    } catch (error) {
        console.error("Error disliking blog post:", error);
        return false;
    }
}

export { likePost, dislikePost };
