// app/api/blog/route.ts
import { NextRequest, NextResponse } from "next/server";
import Blog from "../../../models/blogs.models";
import { connectDB } from "../../../utils/db";
import Joi from "joi";
import { JSDOM } from "jsdom";
import DOMPurify from "dompurify";
import User from "@/models/users.models";
import mongoose from "mongoose";
import { getSessionAtHome } from "@/auth";
import webpush from "web-push";
import Notification from "@/models/notification.models";

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

  if (!session) {
    return NextResponse.json(
      {
        message: "You need to be logged in to create a blog post",
        success: false
      },
      { status: 401 }
    );
  }

  if (!session?.user?.email) {
    return NextResponse.json(
      {
        message: "You need to be logged in to create a blog post",
        success: false
      },
      { status: 401 }
    );
  }

  let {
    title,
    content,
    status = "published",
    tags = [],
    thumbnail = "",
    category = "Others",
    language = "html",
    slug
  } = body;

  if (!content) {
    return NextResponse.json(
      {
        message: "Content is required",
        success: false
      },
      { status: 400 }
    );
  }

  if (!title) {
    return NextResponse.json(
      {
        message: "Title is required",
        success: false
      },
      { status: 400 }
    );
  }

  const { error } = blogSchema.validate({
    title,
    content,
    status,
    tags,
    language
  });

  if (error) {
    return NextResponse.json(
      {
        message: error.message,
        success: false
      },
      { status: 400 }
    );
  }
  if (!slug) {
    slug = title
      .trim() // Remove leading and trailing spaces
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .replace(/[^a-zA-Z0-9-]/g, "") // Remove special characters
      .toLowerCase(); // Convert to lowercase
  }

  const { window } = new JSDOM("");
  const purify = DOMPurify(window);
  const sanitizedContent = purify.sanitize(content);
  const sanitizedTitle = purify.sanitize(title);
  const sanitizedTags = tags.map((tag: string) => purify.sanitize(tag));
  const sanitizedCategory = purify.sanitize(category);

  const blogPost = {
    title: sanitizedTitle,
    content: sanitizedContent,
    status,
    thumbnail,
    tags: sanitizedTags,
    createdBy: session.user.email,
    likes: 0,
    views: 0,
    category: sanitizedCategory,
    language: language,
    slug
  };

  try {
    // check if slug already exists
    const existingBlog = await Blog.findOne({ slug });
    if (existingBlog) slug = `${slug}-${Date.now()}`;

    // Save blog post
    const newBlogPost = new Blog(blogPost);
    await newBlogPost.save();
    const blogPostId = newBlogPost._id;

    // Increment blog count for user
    await User.findOneAndUpdate(
      { email: session.user.email },
      {
        $inc: { noOfBlogs: 1 }
      }
    );

    // Send notifications to subscribers
    const subscriptions = await Notification.find({});
    if (subscriptions.length) {
      const payload = {
        title: "New Blog Post",
        body: `A new blog post "${blogPost.title}" has been published`,
        icon: blogPost.thumbnail,
        data: {
          url: `/blog/${newBlogPost._id}`
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
      console.log("Notifications sent successfully");
    } else {
      console.log("No active subscriptions found");
    }

    return NextResponse.json(
      {
        message: "Blog post created successfully",
        success: true,
        data: blogPost,
        blogPostId: blogPostId
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error saving blog post:", error);
    return NextResponse.json(
      {
        message: (error as Error).message,
        success: false,
        error
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json(
      {
        message: "Blog post id is required",
        success: false
      },
      { status: 400 }
    );
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json(
      {
        message: "Invalid blog post id",
        success: false
      },
      { status: 400 }
    );
  }

  const session = await getSessionAtHome();

  if (!session) {
    return NextResponse.json(
      {
        message: "You need to be logged in to delete a blog post",
        success: false
      },
      { status: 401 }
    );
  }

  const blogPost = await Blog.findById(id);
  if (!blogPost) {
    return NextResponse.json(
      {
        message: "Blog post not found",
        success: false
      },
      { status: 404 }
    );
  }

  if (blogPost.createdBy !== session?.user?.email) {
    return NextResponse.json(
      {
        message: "You are not authorized to delete this blog post",
        success: false
      },
      { status: 403 }
    );
  }

  try {
    await Blog.findByIdAndDelete(id);

    await User.findOneAndUpdate(
      { email: session?.user?.email },
      {
        $inc: { noOfBlogs: -1 }
      }
    );

    return NextResponse.json(
      {
        message: "Blog post deleted successfully",
        success: true
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting blog post:", error);
    return NextResponse.json(
      {
        message: (error as Error).message,
        success: false,
        error
      },
      { status: 500 }
    );
  }
}

// export async function GET(request: Request) {
//   try {
//     const { searchParams } = new URL(request.url);
//     const page = parseInt(searchParams.get("page") || "1", 10);
//     const limit = parseInt(searchParams.get("limit") || "10", 10);
//     let category = searchParams.get("category") || "";
//     const sortBy = searchParams.get("sortBy") || "newest";

//     const validatedPage = Math.max(1, page);
//     const validatedLimit = Math.min(Math.max(1, limit), 100);
//     const validSortOptions: Record<string, Record<string, 1 | -1>> = {
//       newest: { createdAt: -1 },
//       oldest: { createdAt: 1 },
//       mostViews: { views: -1 },
//       mostLikes: { likes: -1 }
//     };
//     const validatedSortBy =
//       validSortOptions[sortBy] || validSortOptions["newest"];

//     const skip = (validatedPage - 1) * validatedLimit;

//     if (category === "all") {
//       category = "";
//     }

//     const query = category ? { category } : {};
//     const totalCount = await Blog.countDocuments(query);

//     const data = await Blog.find(query)
//       .sort(validatedSortBy)
//       .skip(skip)
//       .limit(validatedLimit)
//       .select("-__v");

//     const metadata = {
//       currentPage: validatedPage,
//       totalPages: Math.ceil(totalCount / validatedLimit),
//       totalPosts: totalCount,
//       hasMore: skip + data.length < totalCount
//     };

//     return NextResponse.json(
//       {
//         message: "Blog posts found successfully",
//         success: true,
//         data,
//         metadata
//       },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Error fetching blog posts:", error);
//     return NextResponse.json(
//       {
//         message: "Failed to retrieve blog posts",
//         success: false,
//         error: {
//           message: error instanceof Error ? error.message : "Unknown error"
//         }
//       },
//       { status: 500 }
//     );
//   }
// }

// Detail GET request by Claude Ai

// Define types for better type safety
type SortOption = {
  [key: string]: 1 | -1;
};

type QueryParams = {
  page: number;
  limit: number;
  category: string;
  sortBy: string;
  search?: string;
};

export async function GET(request: Request) {
  try {
    // Extract and validate query parameters
    const { searchParams } = new URL(request.url);
    const params = validateQueryParams(searchParams);

    // Build query object
    const query = buildQuery(params);

    // Get sort configuration
    const sortConfig = getSortConfig(params.sortBy);

    // Execute query with error handling
    const [data, totalCount] = await executeQuery(query, sortConfig, params);

    // Calculate pagination metadata
    const metadata = calculatePaginationMetadata(
      params,
      totalCount,
      data.length
    );

    // Return successful response
    return NextResponse.json(
      {
        message: "Blog posts retrieved successfully",
        success: true,
        data,
        metadata
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, max-age=60, stale-while-revalidate=30"
        }
      }
    );
  } catch (error) {
    return handleError(error);
  }
}

// Validate and sanitize query parameters
function validateQueryParams(searchParams: URLSearchParams): QueryParams {
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const limit = clamp(parseInt(searchParams.get("limit") || "10", 10), 1, 100);
  const category = searchParams.get("category") || "";
  const sortBy = searchParams.get("sortBy") || "newest";
  const search = searchParams.get("search") || "";

  return { page, limit, category, sortBy, search };
}

// Clamp number between min and max
function clamp(num: number, min: number, max: number): number {
  return Math.min(Math.max(num, min), max);
}

// Build MongoDB query object
function buildQuery(params: QueryParams): mongoose.FilterQuery<typeof Blog> {
  const query: mongoose.FilterQuery<typeof Blog> = {};

  // Add category filter if specified
  if (params.category && params.category !== "all") {
    query.category = params.category;
  }

  // Add search functionality if search term is provided
  if (params.search) {
    query.$or = [
      { title: { $regex: params.search, $options: "i" } },
      { content: { $regex: params.search, $options: "i" } },
      { tags: { $in: [new RegExp(params.search, "i")] } }
    ];
  }

  return query;
}

// Get sort configuration
function getSortConfig(sortBy: string): SortOption {
  const sortOptions: Record<string, SortOption> = {
    newest: { createdAt: -1 },
    oldest: { createdAt: 1 },
    mostViews: { views: -1, createdAt: -1 }, // Secondary sort for equal views
    mostLikes: { likes: -1, createdAt: -1 }, // Secondary sort for equal likes
    trending: {
      // Complex sort for trending posts
      score: -1,
      createdAt: -1
    }
  };

  return sortOptions[sortBy] || sortOptions.newest;
}

// Execute database query
async function executeQuery(
  query: mongoose.FilterQuery<typeof Blog>,
  sortConfig: SortOption,
  params: QueryParams
) {
  const skip = (params.page - 1) * params.limit;

  // Add scoring for trending sort
  if (sortConfig.score) {
    const now = new Date();
    const hoursSinceCreation = {
      $divide: [
        { $subtract: [now, "$createdAt"] },
        1000 * 60 * 60 // Convert milliseconds to hours equivalent to 1 hour
      ]
    };

    query.createdAt = {
      $gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
    };

    const aggregationPipeline = [
      { $match: query },
      {
        $addFields: {
          score: {
            $divide: [
              { $add: ["$likes", { $multiply: ["$views", 0.5] }] },
              { $add: [hoursSinceCreation, 2] } // Decay factor
            ]
          }
        }
      },
      { $sort: sortConfig },
      { $skip: skip },
      { $limit: params.limit },
      { $project: { __v: 0 } }
    ];

    const countPipeline = [{ $match: query }, { $count: "total" }];

    const [data, countResult] = await Promise.all([
      Blog.aggregate(aggregationPipeline),
      Blog.aggregate(countPipeline)
    ]);

    return [data, countResult[0]?.total || 0];
  }

  // Regular query for non-trending sorts
  const [data, totalCount] = await Promise.all([
    Blog.find(query)
      .sort(sortConfig)
      .skip(skip)
      .limit(params.limit)
      .select("-__v")
      .lean(),
    Blog.countDocuments(query)
  ]);

  return [data, totalCount];
}

// Calculate pagination metadata
function calculatePaginationMetadata(
  params: QueryParams,
  totalCount: number,
  resultCount: number
) {
  const totalPages = Math.ceil(totalCount / params.limit);
  const skip = (params.page - 1) * params.limit;

  return {
    currentPage: params.page,
    totalPages,
    totalPosts: totalCount,
    hasMore: skip + resultCount < totalCount,
    resultsPerPage: params.limit
  };
}

// Handle errors
function handleError(error: unknown) {
  console.error("Error fetching blog posts:", error);

  const errorMessage =
    error instanceof Error ? error.message : "An unknown error occurred";

  const statusCode =
    error instanceof mongoose.Error.ValidationError ? 400 : 500;

  return NextResponse.json(
    {
      message: "Failed to retrieve blog posts",
      success: false,
      error: {
        message: errorMessage,
        code: statusCode
      }
    },
    { status: statusCode }
  );
}
