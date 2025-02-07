export interface UserType {
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
    socialLinks?: SocialLinks;
    isEmailVerified: boolean;
    username: string;
    role: string;
}

export interface ProfileFormData {
    name: string;
    username: string;
    email: string;
    bio: string;
    website?: string;
    socialLinks?: SocialLinks;
}

export interface SocialLinks {
    linkedin?: string;
    github?: string;
    twitter?: string;
    instagram?: string;
    facebook?: string;
}