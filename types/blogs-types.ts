type BlogPostType = {
  _id: string;
  title: string;
  createdAt: string;
  updatedAt?: string;
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
  website?: string;
  socialLinks?: {
    linkedin?: string;
    github?: string;
    twitter?: string;
    instagram?: string;
    facebook?: string;
  };
  isEmailVerified: boolean;
  username: string;
  role: string;
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

interface TOCItem {
  level: number;
  text: string;
  id: string;
}

interface ThemeClasses {
  layout: string;
  container: string;
  header: string;
  title: string;
  controls: string;
  searchContainer: string;
  input: string;
  select: string;
  themeToggle: string;
}

interface BlogState {
  isInitializing: boolean;
  isLoading: boolean;
  error: string | null;
  title: string;
  thumbnail: string | null;
  htmlContent: string;
  markdownContent: string;
  slug: string;
  tags: string[];
  category: string;
  blogId: string;
  tagAutoGen: boolean;
  editorMode: 'markdown' | 'visual' | 'html';
}

export type { BlogPostType, UserType, StatsType, Author, TOCItem, ThemeClasses, BlogState };
export { CATEGORIES };
