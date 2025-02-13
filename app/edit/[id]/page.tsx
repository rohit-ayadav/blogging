import { connectDB } from "@/utils/db";
import Blog from "@/models/blogs.models";
import { isValidObjectId } from "mongoose";
import { isValidSlug } from "@/lib/common-function";
import EditBlogComponent from "./editBlog";
import { getSessionAtHome } from "@/auth";
import LoadingSpinner from "@/app/create/component/LoadingSpinner";

await connectDB();
interface EditBlogState {
    isInitializing: boolean;
    isLoading: boolean;
    error: string | null;
    title: string;
    thumbnail: string | null;
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
        isInitializing: false,
        isLoading: false,
        error: "An error occurred while fetching blog post data",
        title: "",
        thumbnail: null,
        htmlContent: "",
        markdownContent: "",
        tags: [],
        category: "",
        blogId: "",
        createdBy: "",
        editorMode: "markdown" as 'markdown' | 'visual' | 'html',
        slug: "",
    };
    if (!id) return nullresponse;
    const session = getSessionAtHome();

    try {
        const post = isValidObjectId(id)
            ? await Blog.findById(id)
            : isValidSlug(id)
                ? await Blog.findOne({ slug: id })
                : null;

        if (!post) return nullresponse;

        return {
            isInitializing: false,
            isLoading: false,
            error: null,
            title: post.title,
            thumbnail: post.thumbnail,
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

export async function getStaticParams() {
    const posts = await Blog.find({}, { _id: 1, slug: 1 });
    const paths = posts.map((post) => ({
        params: { id: post.slug },
    }));

    return paths;
}

export default async function EditPost({ params }: { params: { id: string } }) {
    const blogData = await getBlogData(params.id);
    return <EditBlogComponent {...blogData} />;
}