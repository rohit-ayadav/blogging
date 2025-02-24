import { connectDB } from "@/utils/db";
import Blog from "@/models/blogs.models";
import { isValidObjectId } from "mongoose";
import { isValidSlug } from "@/lib/common-function";
import EditBlogComponent from "./editBlog";
import { ErrorMessage } from "@/app/blogs/[id]/ErrorMessage";

await connectDB();
interface EditBlogState {
    success: boolean;
    error: string;
    isInitializing: boolean;
    isLoading: boolean;
    title: string;
    thumbnail: string | null;
    thumbnailCredit: string | null;
    htmlContent: string;
    markdownContent: string;
    tags: string[];
    category: string;
    blogId: string;
    createdBy: string;
    editorMode: 'markdown' | 'visual' | 'html';
    slug: string;
}

async function getBlogData(id: string): Promise<EditBlogState> {
    const nullresponse = {
        success: false,
        error: '',
        isInitializing: false,
        isLoading: false,
        title: "",
        thumbnail: null,
        thumbnailCredit: null,
        htmlContent: "",
        markdownContent: "",
        tags: [],
        category: "",
        blogId: "",
        createdBy: "",
        editorMode: "markdown" as 'markdown' | 'visual' | 'html',
        slug: "",
    };
    if (!id) {
        return { ...nullresponse, error: "Blog id required to edit the blog..." }
    }

    try {
        const post = isValidObjectId(id)
            ? await Blog.findById(id)
            : isValidSlug(id)
                ? await Blog.findOne({ slug: id })
                : null;

        if (!post) return { ...nullresponse, error: "Blog post not found, please check the id..." };

        return {
            success: true,
            isInitializing: false,
            isLoading: false,
            error: "",
            title: post.title,
            thumbnail: post.thumbnail,
            thumbnailCredit: post.thumbnailCredit,
            htmlContent: post.language === "html" ? post.content : "",
            markdownContent: post.language === "markdown" ? post.content : "",
            tags: post.tags,
            category: post.category,
            blogId: post._id.toString(),
            createdBy: post.createdBy,
            editorMode: post.language as 'markdown' | 'visual' | 'html',
            slug: post.slug,
        };
    } catch (error) {
        console.error("Error fetching blog post data:", error);
        return nullresponse;
    }
}

export async function generateStaticParams() {
    await connectDB();
    const posts = await Blog.find({}, { slug: 1, _id: 1 });

    return posts.flatMap(post => [
        { id: post._id.toString() },
        { id: post.slug }
    ]);
}

export default async function EditPost({ params }: { params: { id: string } }) {
    const blogData = await getBlogData(params.id);
    if (!blogData.success) {
        return <ErrorMessage message={blogData.error || "Something went wrong"} />;
    }
    return <EditBlogComponent {...blogData} />;
}