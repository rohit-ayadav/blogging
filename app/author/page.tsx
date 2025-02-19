"use server";
import { ErrorMessage } from '../blogs/[id]/ErrorMessage';
import { connectDB } from '@/utils/db';
import User from '@/models/users.models';
import Blog from '@/models/blogs.models';
import AuthorsPage from './AuthorsPage';

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

async function getAuthorData() {
    try {
        await connectDB();
        const authors = await User.find({
            email: { $in: (await Blog.distinct('createdBy')) }
        }).lean();

        authors.forEach((author) => {
            const user = author as UserType;
            user.createdAt = user.createdAt.toString();
            user._id = user._id.toString();
        });

        return {
            success: true,
            authors: authors as UserType[],
            totalAuthors: authors.length,
            message: ''
        };
    } catch (err: any) {
        return {
            success: false,
            authors: [],
            message: err.message || '',
            totalAuthors: 0
        };
    }
}

const AurhorsHomePage = async function() {
    
    return (
        <AuthorsPage {...await getAuthorData()} />
    );
}

export default AurhorsHomePage;