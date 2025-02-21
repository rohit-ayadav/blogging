"use server";

import { connectDB } from "@/utils/db";
import Blog from "@/models/blogs.models";
import MonthlyStats from "@/models/monthlyStats";
import { isValidObjectId } from "mongoose";
import { isValidSlug } from "@/lib/common-function";
class InteractionError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'InteractionError';
    }
}

type InteractionResult = {
    success: boolean;
    message?: string;
    likes?: number;
};

const getBlogFilter = (id: string) => {
    if (!id) throw new InteractionError('No ID provided');

    const filter = isValidObjectId(id)
        ? { _id: id }
        : isValidSlug(id)
            ? { slug: id }
            : null;

    if (!filter) throw new InteractionError('Invalid ID format');
    return filter;
};

const updateMonthlyStats = async (blogId: string, likeChange: number): Promise<boolean> => {
    const currentMonth = new Date().toISOString().slice(0, 7);

    const stats = await MonthlyStats.findOneAndUpdate(
        {
            blog: blogId,
            month: currentMonth
        },
        {
            $inc: { likes: likeChange },
            $setOnInsert: {
                blog: blogId,
                month: currentMonth
            }
        },
        {
            new: true,
            upsert: true,
            runValidators: true
        }
    );

    return !!stats;
};

async function likePost(id: string): Promise<InteractionResult> {
    await connectDB();

    try {
        const filter = getBlogFilter(id);

        // Find the post first to check if it exists
        const existingPost = await Blog.findOne(filter);
        if (!existingPost) {
            throw new InteractionError('Blog post not found');
        }

        // Update the post
        const post = await Blog.findOneAndUpdate(
            filter,
            { $inc: { likes: 1 } },
            {
                new: true,
                runValidators: true
            }
        );

        if (!post) {
            throw new InteractionError('Failed to update likes');
        }

        // Update monthly stats
        const statsUpdated = await updateMonthlyStats(post._id, 1);

        if (!statsUpdated) {
            console.warn('Monthly stats update failed for post:', post._id);
        }

        return {
            success: true,
            likes: post.likes,
            message: 'Post liked successfully'
        };

    } catch (error) {
        console.error("Error in likePost:", error);
        const message = error instanceof InteractionError ? error.message : 'Failed to like post';
        return {
            success: false,
            message
        };
    }
}

async function dislikePost(id: string): Promise<InteractionResult> {
    await connectDB();

    try {
        const filter = getBlogFilter(id);

        // Find the post first to check if it exists and current likes
        const existingPost = await Blog.findOne(filter);
        if (!existingPost) {
            throw new InteractionError('Blog post not found');
        }

        // Don't allow negative likes
        if (existingPost.likes === 0) {
            return {
                success: false,
                message: 'Post already has 0 likes',
                likes: 0
            };
        }

        // Update the post
        const post = await Blog.findOneAndUpdate(
            filter,
            { $inc: { likes: -1 } },
            {
                new: true,
                runValidators: true
            }
        );

        if (!post) {
            throw new InteractionError('Failed to update likes');
        }

        if (post.likes < 0) {
            post.likes = 0;
            await post.save();
        }

        // Update monthly stats
        const statsUpdated = await updateMonthlyStats(post._id, -1);

        if (!statsUpdated) {
            console.warn('Monthly stats update failed for post:', post._id);
        }

        return {
            success: true,
            likes: post.likes,
            message: 'Post disliked successfully'
        };

    } catch (error) {
        console.error("Error in dislikePost:", error);
        const message = error instanceof InteractionError
            ? error.message
            : 'Failed to dislike post';

        return {
            success: false,
            message
        };
    }
}

export { likePost, dislikePost };