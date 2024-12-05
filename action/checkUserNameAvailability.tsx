"use server";
import User from "@/models/users.models";
import { connectDB } from "@/utils/db";

async function checkUsernameAvailability(username: string) {
    await connectDB();
    if (!username) {
        return false;
    }
    const user = await User.findOne({ username: username });
    return user ? false : true;
}

export default checkUsernameAvailability;