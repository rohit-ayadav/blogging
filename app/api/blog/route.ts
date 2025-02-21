// app/api/blog/route.ts
import { NextRequest, NextResponse } from "next/server";
import Blog from "@/models/blogs.models";
import { connectDB } from "@/utils/db";
import Joi from "joi";
import { JSDOM } from "jsdom";
import DOMPurify from "dompurify";
import User from "@/models/users.models";
import mongoose from "mongoose";
import { getSessionAtHome } from "@/auth";
import webpush from "web-push";
import Notification from "@/models/notification.models";
import { isValidSlug } from "@/lib/common-function";

await connectDB();

webpush.setVapidDetails(
  "mailto:rohitkuyada@gmail.com",
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "",
  process.env.VAPID_PRIVATE_KEY || ""
);

const blogSchema = Joi.object({
  title: Joi.string().required(),
  content: Joi.string().required(),
  status: Joi.string().valid("published", "draft").optional(),
  tags: Joi.array().items(Joi.string()).optional(),
  language: Joi.string().valid("html", "markdown").optional()
});

export async function POST(request: NextRequest) {
  const body = await request.json();
  const session = await getSessionAtHome();

  if (!session) { return NextResponse.json({ message: "You need to be logged in to create a blog post", success: false }, { status: 401 }); }
  if (!session.user.email) { return NextResponse.json({ message: "You need to be logged in to create a blog post", success: false }, { status: 401 }); }

  let { title, content, status, tags, language, slug, thumbnail, thumbnailCredit, category } = body;

  const { error } = blogSchema.validate({ title, content, status, tags, language });

  if (error) return NextResponse.json({ message: error.message, success: false }, { status: 400 });
  slug = slug || title;
  slug = slug.trim()
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")  // Remove special characters except space and hyphen
    .replace(/\s+/g, "-")       // Replace spaces with hyphens
    .replace(/-{2,}/g, "-")     // Remove multiple hyphens
    .replace(/^-+|-+$/g, "");   // Remove leading/trailing hyphens

  const { window } = new JSDOM("");
  const purify = DOMPurify(window);
  const sanitizedContent = purify.sanitize(content);
  const sanitizedTitle = purify.sanitize(title);
  const sanitizedTags = tags.map((tag: string) => purify.sanitize(tag));
  const sanitizedCategory = purify.sanitize(category);

  try {
    const existingBlog = await Blog.findOne({ slug });
    if (existingBlog) slug = `${slug}-${Date.now()}`;

    const blogPost = {
      title: sanitizedTitle, content: sanitizedContent, status, tags: sanitizedTags, language, slug, thumbnail, thumbnailCredit, category: sanitizedCategory, createdBy: session.user.email
    };

    // Save blog post
    const newBlogPost = new Blog(blogPost);
    await newBlogPost.save();
    const blogPostId = newBlogPost.slug;

    await User.findOneAndUpdate({ email: session.user.email }, { $inc: { noOfBlogs: 1 } });

    // Send notifications to subscribers
    const subscriptions = await Notification.find({});
    if (subscriptions.length) {
      const payload = {
        title: `New Blog Post: ${blogPost.title}`,
        body: `A new blog post "${blogPost.title}" has been published`,
        image: blogPost.thumbnail,
        icon: "/favicon.ico",
        tag: "new-blog-post",
        data: {
          url: `/blogs/${slug}`
        },
        actions: [
          { action: "open", title: "Open" },
          { action: "close", title: "Dismiss" }
        ]
      };

      // Send notifications to all subscriptions
      const notificationPromises = subscriptions.map(({ subscription }) =>
        webpush
          .sendNotification(subscription, JSON.stringify(payload))
          .catch((error) => {
            console.error("Error sending notification:", error);
          })
      );


      await Promise.all(notificationPromises);
      await Notification.deleteMany({ active: false });
    }

    return NextResponse.json({ message: "Blog post created successfully", success: true, data: { id: blogPostId } }, { status: 201 });
  } catch (error) {
    console.error("Error saving blog post:", error);
    return NextResponse.json({ message: (error as Error).message, success: false }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get("id");
  if (!id) { return NextResponse.json({ message: "Blog post id is required", success: false }, { status: 400 }); }
  if (!mongoose.Types.ObjectId.isValid(id)) { return NextResponse.json({ message: "Invalid blog post id", success: false }, { status: 400 }); }

  const session = await getSessionAtHome();

  if (!session) { return NextResponse.json({ message: "You need to be logged in to delete a blog post", success: false }, { status: 401 }); }

  const blogPost = await Blog.findById(id);
  if (!blogPost) { return NextResponse.json({ message: "Blog post not found", success: false }, { status: 404 }); }
  if (blogPost.createdBy !== session?.user?.email) { return NextResponse.json({ message: "You are not authorized to delete this blog post", success: false }, { status: 403 }); }

  try {
    await Blog.findByIdAndDelete(id);
    await User.findOneAndUpdate({ email: session?.user?.email }, { $inc: { noOfBlogs: -1 } });

    return NextResponse.json({ message: "Blog post deleted successfully", success: true }, { status: 200 });
  } catch (error) {
    console.error("Error deleting blog post:", error);
    return NextResponse.json({ message: (error as Error).message, success: false }, { status: 500 });
  }
}

// GET /api/blog/route.ts
/**
 * API to get related blog posts based on tags received in query params ?tags=tag1,tag2
 * Also supports limiting results and fetching posts by a specific author.
 *
 * @param {NextRequest} request
 * @returns {Promise<NextResponse>}
 * @example GET /api/blog?tags=tag1,tag2
 * @example GET /api/blog?tags=tag1,tag2&limit=3
 * @example GET /api/blog?email=author@example.com
 */

const projection = {
  title: 1,
  description: 1,
  thumbnail: 1,
  thumbnailCredit: 1,
  slug: 1,
  tags: 1,
  totalViews: 1,
  totalLikes: 1,
  comments: 1,
  createdAt: 1,
  createdBy: 1
};

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const category = searchParams.get("category")?.split(",");
  const limit = parseInt(searchParams.get("limit") || "5", 10);
  const email = searchParams.get("email");

  try {
    if (!category || !email) {
      const posts = await Blog.find({})
        .select(projection)
        .sort({ createdAt: -1, totalViews: -1 })
        .limit(limit)
        .lean();
      return NextResponse.json({ posts }, { status: 200 });
    }

    const [authorPosts, relatedPosts] = await Promise.all([
      Blog.find({ createdBy: email }, projection)
        .sort({ createdAt: -1, totalViews: -1 })
        .limit(limit + 1)
        .lean(),
      Blog.find({ category }, projection)
        .sort({ createdAt: -1, totalViews: -1 })
        .limit(limit + 1)
        .lean()
    ]);
    if (!relatedPosts.length) {
      // find trending posts if no related posts found
      const trendingPosts = await Blog.find({})
        .sort({ totalViews: -1 })
        .limit(limit + 1)
        .lean();

      return NextResponse.json({
        authorPosts,
        relatedPosts: trendingPosts
      }, { status: 200 });
    }

    return NextResponse.json({
      authorPosts,
      relatedPosts
    }, { status: 200 });

  } catch (error) {
    console.error("Error fetching related posts:", error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "An unknown error occurred", success: false },
      { status: 500 }
    );
  }
}