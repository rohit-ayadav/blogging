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

async function findEmailFromUserName(username: string) {
    await connectDB();
    if (!username) {
        return '';
    }
    const user = await User.findOne({ username: username });
    return user ? user.email : '';
}

export { checkUsernameAvailability, findEmailFromUserName };
export default checkUsernameAvailability;