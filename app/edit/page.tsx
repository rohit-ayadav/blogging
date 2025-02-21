import { getSessionAtHome } from '@/auth';
import Blog from '@/models/blogs.models';
import { connectDB } from '@/utils/db';
import { ErrorMessage } from '../blogs/[id]/ErrorMessage';
import Link from 'next/link';
import { Pencil, Trash2 } from 'lucide-react';
import { BlogPostType } from '@/types/blogs-types';

// Fetch blogs with error handling
const fetchUserBlogs = async () => {
  try {
    await connectDB();
    const session = await getSessionAtHome();

    if (!session) {
      return {
        success: false,
        blogs: [],
        error: 'Please sign in to view your blogs'
      };
    }

    const blogs = await Blog.find({
      createdBy: session.user.email
    }).sort({ createdAt: -1 }); // Sort by newest first

    return {
      success: true,
      blogs,
      error: ''
    };
  } catch (err) {
    console.error('Error fetching blogs:', err);
    return {
      success: false,
      blogs: [],
      error: 'Failed to fetch blogs. Please try again later.'
    };
  }
};

// Blog item component for better organization
const BlogItem = ({ blog }: { blog: BlogPostType }) => (
  <li className="p-4 mb-4 border rounded-lg hover:bg-gray-50 transition-colors">
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <h2 className="text-lg font-semibold mb-1">{blog.title}</h2>
        <p className="text-gray-600 text-sm mb-2">
          {new Date(blog.createdAt).toLocaleDateString()}
        </p>
        {blog.content && (
          <p className="text-gray-700 line-clamp-2">{blog.content.replace(/<[^>]+>/g, ''.slice(0, 180))}</p>
        )}
      </div>
      <div className="flex gap-2 ml-4">
        <Link
          href={`/edit/${blog.slug}`}
          className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
          title="Edit blog"
        >
          <Pencil size={20} />
        </Link>
        {/* <button
          onClick={() => handleDelete(blog._id)}
          className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
          title="Delete blog"
        >
          <Trash2 size={20} />
        </button> */}
      </div>
    </div>
  </li>
);

const BlogListingPage = async () => {
  const { success, blogs, error } = await fetchUserBlogs();

  if (!success) {
    return (
      <div className="p-6">
        <ErrorMessage message={error} />
        <Link
          href="/login"
          className="mt-4 inline-block text-blue-600 hover:underline"
        >
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Your Blogs</h1>
        <Link
          href="/create"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Write New Blog
        </Link>
      </div>

      {blogs.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">You haven't written any blogs yet.</p>
          <Link
            href="/create"
            className="text-blue-600 hover:underline"
          >
            Start writing your first blog →
          </Link>
        </div>
      ) : (
        <ul className="space-y-4">
          {blogs.map((blog) => (
            <BlogItem key={blog._id} blog={blog} />
          ))}
        </ul>
      )}
    </div>
  );
};

export default BlogListingPage;