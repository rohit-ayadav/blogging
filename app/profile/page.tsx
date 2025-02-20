import { UserType } from "@/types/blogs-types";
import { connectDB } from "@/utils/db";
import User from "@/models/users.models";
import { Metadata } from "next";
import { getSessionAtHome } from "@/auth";
import UserProfile from "./component/page";
import { ErrorMessage } from "../blogs/[id]/ErrorMessage";
import serializeDocument from "@/utils/date-formatter";

async function getPostData() {
    try {
        await connectDB();
        const session = await getSessionAtHome();
        const email = session.user.email;
        if (!email) {
            return { success: false, statusCode: 401 };
        }

        // Convert Mongoose document to plain JSON object
        let user = await User.findOne({ email }).lean() as UserType;
        if (!user) {
            return { success: false, statusCode: 404 };
        }

        user = serializeDocument(user) as UserType;
        return {
            success: true,
            userData: user
        };
    } catch (error) {
        return { success: false, error: (error as Error).message };
    }
}

export async function generateMetadata(): Promise<Metadata> {
    const response = await getPostData();
    if (!response || !response.success) {
        return { title: 'User not found' };
    }
    if (!response.userData) {
        return { title: 'User not found' };
    }
    const title: string = `${response.userData.name}'s Profile`;
    const description: string = response.userData.bio;
    const thumbnail: string = response.userData.image || '/default-thumbnail.jpg';


    return {
        title,
        description,
        openGraph: {
            title,
            description,
            images: [{ url: thumbnail }]
        }
    };
}

export default async function IndividualProfile() {
    const response = await getPostData();
    if (!response || !response.success) {
        switch (response.statusCode) {
            case 404:
                // notFound(); // This will render the 404 page
                return <ErrorMessage message="User not found" />; // This will render the error message
            case 403:
                return <ErrorMessage message="You don't have permission to view this blog post" />;
            case 401:
                return <ErrorMessage message="Please login to view this blog post" />;
            default:
                return <ErrorMessage message={response.error || 'Failed to load blog post'} />;
        }
    }
    if (!response.userData) {
        return <ErrorMessage message="User not found" />;
    }

    return <UserProfile
        userData={response.userData}
    />;

}
