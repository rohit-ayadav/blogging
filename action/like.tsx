"use server"

import { connectDB } from "@/utils/db"
import Blog from "@/models/blogs.models"
import { isValidObjectId } from "mongoose"
import { isValidSlug } from "@/lib/common-function"

await connectDB()

async function likePost(id: string) {
    let post

    if (!id) {
        return false;
    }

    try {
        if (!isValidObjectId(id)) {
            if (!isValidSlug(id)) {
                return false;
            }
        }
        if (isValidObjectId(id)) {
            post = await Blog.findById(id)
        } else {
            post = await Blog.findOne({ slug: id })
        }

        if (!post) {
            return false;
        }
        post.likes = (post.likes || 0) + 1
        await post.save()
        console.log("Post liked successfully")
        return true;
    } catch (error) {
        console.error("Error saving blog post:", error)
        return false;
    }
}

async function dislikePost(id: string) {
    let post

    if (!id) {
        return false;
    }

    try {
        if (!isValidObjectId(id)) {
            if (!isValidSlug(id)) {
                return false;
            }
        }
        if (isValidObjectId(id)) {
            post = await Blog.findById(id)
        } else {
            post = await Blog.findOne({ slug: id })
        }

        if (!post) {
            return false;
        }
        if (post.likes > 0) {
            post.likes = post.likes - 1
        } else {
            post.likes = 0
        }

        await post.save()
        console.log("Post disliked successfully")
        return true;
    } catch (error) {
        console.error("Error saving blog post:", error)
        return false;
    }
}

export { likePost, dislikePost }
