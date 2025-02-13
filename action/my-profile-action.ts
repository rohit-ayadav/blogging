"use server";

import { connectDB } from "@/utils/db";
import User from "@/models/users.models";
import checkUsernameAvailability from "@/action/checkUserNameAvailability";
import { ProfileFormData } from "@/app/profile/component/types";

export async function saveEdit(data: ProfileFormData) {
    try {

        if (!data) throw new Error("Data is required");
        if (!data.email) throw new Error("Email is required");
        if (!data.name) throw new Error("Name is required");

        await connectDB();

        if (data.username && !(await checkUsernameAvailability(data.username))) {
            throw new Error("Username already taken");
        }

        const user = await User.findOne({ email: data.email });
        if (!user) {
            throw new Error("User not found");
        }
        if (data.email !== user.email) {
            throw new Error("Email cannot be changed");
        }
        if (!user.isEmailVerified) {
            throw new Error("Please verify your email to update profile");
        }

        const updatedUser = await User.findOneAndUpdate(
            { email: data.email },
            data,
            { new: true }
        );
        if (!updatedUser) {
            throw new Error("Failed to update profile");
        }

        return { success: true };
    } catch (error) {
        console.error(`\nError in saveEdit: ${error}`);
        return { success: false, error: (error as Error).message };
    }
}
