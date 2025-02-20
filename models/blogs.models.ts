// blogging/models/blogs.models.ts
import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    thumbnail: {
      type: String,
      required: false
    },
    thumbnailCredit: {
      type: String,
      required: false
    },
    content: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft"
    },
    tags: {
      type: [String],
      required: true
    },
    createdBy: {
      type: String,
      required: true,
      default: "anonymous"
    },
    likes: {
      type: Number,
      default: 0
    },
    views: {
      type: Number,
      default: 0
    },
    category: {
      type: String,
      required: false
    },
    language: {
      type: String,
      required: true,
      default: "html"
    },
    slug: {
      type: String,
      required: true,
      unique: true
    }
  },
  { timestamps: true }
);

const Blog = mongoose.models.Blog || mongoose.model("Blog", blogSchema);

export default Blog;
