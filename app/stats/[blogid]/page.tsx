import { connectDB } from "@/utils/db";
import Blog from "@/models/blogs.models";
import User from "@/models/users.models";
import { isValidObjectId } from "mongoose";
import MonthlyStats from "@/models/monthlyStats";
import serializeDocument from "@/utils/date-formatter";
import { ErrorMessage } from "@/app/blogs/[id]/ErrorMessage";
import { BlogPostType, MonthlyStatsType, UserType } from "@/types/blogs-types";
import BlogStatsPage from "./BlogStatsPage";

async function getPostResults(blogid: string) {
    try {
        await connectDB();

        // Get blog data
        let blog: BlogPostType;
        if (isValidObjectId(blogid)) {
            blog = await Blog.findById(blogid).lean().exec() as BlogPostType;
        } else {
            blog = await Blog.findOne({ slug: blogid }).lean().exec() as BlogPostType;
        }
        if (!blog) {
            return {
                success: false,
                statusCode: 404,
                error: 'Blog not found'
            };
        }
        let user: UserType;
        user = await User.findOne({ email: blog.createdBy }).lean().exec() as UserType;
        if (!user) {
            return {
                success: false,
                statusCode: 404,
                error: 'User not found'
            };
        }
        
        // find the blog stats
        const monthlyStats = await MonthlyStats.find({ blog: blog._id }).lean() as unknown as MonthlyStatsType[];
        const formattedMonthlyStats = monthlyStats.map(stat => ({
            blog: stat.blog.toString(),
            month: stat.month,
            views: stat.views || 0,
            likes: stat.likes || 0,
        }));
        const serializedBlog = serializeDocument(blog);
        const serializedUser = serializeDocument(user);
        return {
            success: true,
            error: '',
            statusCode: 200,
            data: serializedBlog,
            user: serializedUser,
            monthlyStats: formattedMonthlyStats
        };
    } catch (error) {
        return {
            success: false,
            statusCode: 500,
            error: (error as Error).message
        };
    }
}

export async function generateStaticParams() {
    await connectDB();
    const posts = await Blog.find({}, { slug: 1, _id: 1 });
    const paths = [] as { params: { blogid: string } }[];
    posts.forEach(post => {
        paths.push({
            params: {
                blogid: post._id.toString(),
            }
        });
        paths.push({
            params: {
                blogid: post.slug,
            }
        });
    })

    return paths;
}
export default async function BlogStats({ params }: { params: { blogid: string } }) {
    const response = await getPostResults(params.blogid);
    if (response.statusCode !== 200) {
        return <ErrorMessage message={response.error ?? 'Something went wrong'} />;
    }
    const { user, data, monthlyStats } = response;

    return (
        <BlogStatsPage user={user} data={data} monthlyStats={monthlyStats as MonthlyStatsType[]} />
    )
}