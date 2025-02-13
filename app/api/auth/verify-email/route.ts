// "use server";

import { connectDB } from "@/utils/db";
import User from "@/models/users.models";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
    try {
        // Extract token from query string
        const { searchParams } = new URL(req.url);
        const token = searchParams.get("token");

        if (!token) {
            return new Response(JSON.stringify({ error: "Token is required" }), { status: 400 });
        }

        // Verify JWT token
        if (!process.env.JWT_SECRET) {
            return new Response(JSON.stringify({ error: "JWT_SECRET is not defined" }), { status: 500 });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (typeof decoded === 'string' || !('email' in decoded)) {
            return new Response(JSON.stringify({ error: "Invalid token" }), { status: 400 });
        }
        const email = (decoded as jwt.JwtPayload).email; // Extract email from decoded token

        // Connect to database
        await connectDB();
        const user = await User.findOne({ email });

        if (!user) {
            return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
        }

        if (user.isEmailVerified) {
            return new Response(JSON.stringify({ error: "Email is already verified" }), { status: 400 });
        }

        // Update user email verification status
        user.isEmailVerified = true;
        await user.save();
        
        return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/login?verified=true`);
        return new Response(JSON.stringify({ message: "Email verified successfully!" }), { status: 200 });

    } catch (error) {
        if (error instanceof Error) {
            console.error(`\nError in verifyEmail: ${error.message}`);
        } else {
            console.error(`\nError in verifyEmail: ${JSON.stringify(error)}`);
        }
        // return new Response(JSON.stringify({ error: "Invalid or expired token" }), { status: 400 });
        return new Response(JSON.stringify({ error: "Invalid or expired token" }), { status: 400 });
    }
}