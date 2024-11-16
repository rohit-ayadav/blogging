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
  language: string;
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

const CATEGORIES = [
  { value: "all", label: "All Categories" },
  { value: "DSA", label: "DSA" },
  { value: "Job Posting", label: "Job Posting" },
  { value: "WebDev", label: "Web Development" },
  { value: "AI", label: "Artificial Intelligence" },
  { value: "ML", label: "Machine Learning" },
  { value: "Skill Development", label: "Skill Development" },
  { value: "Resume and Cover Letter Guidance", label: "Resume & Cover Letter" },
  { value: "Interview Preparation", label: "Interview Prep" },
  { value: "Tech-news", label: "Tech News" },
  { value: "Internship", label: "Internship" },
  { value: "Others", label: "Others" }
];

export type { BlogPostType, UserType, StatsType, Author };
export {CATEGORIES};