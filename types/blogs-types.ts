type BlogPostType = {
  _id: string;
  title: string;
  createdAt: string;
  tags?: string[];
  content: string;
  createdBy: string;
  thumbnail?: string;
  views?: number;
  likes?: number;
  category: string;
  score?: number;
  slug: string;
};

type UserType = {
  email: string;
  name: string;
  image: string;
  bio: string;
  follower: number;
  following: number;
  noOfBlogs: number;
  createdAt: string;
  updatedAt: string;
  theme: string;
  _id: string;
};

type StatsType = {
  totalLikes: number;
  totalViews: number;
  totalBlogs: number;
  totalUsers: number;
};

interface Author {
  name: string;
  image: string;
  bio?: string;
  _id: string;
  likes: number;
  views: number;
}

export type { BlogPostType, UserType, StatsType, Author };
