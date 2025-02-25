import { NextResponse } from "next/server";
import { connectDB } from "@/utils/db";
import User from "@/models/users.models";

const BASE_URL = "https://www.food.devblogger.in";

function generateUsername(fullName: string): string {
    if (!fullName || !fullName.trim()) return "user_" + Math.floor(Math.random() * 1000);

    return fullName
        .toLowerCase()
        .replace(/[^a-z0-9 ]/g, "")
        .trim()
        .replace(/\s+/g, "_") +
        "_" + Math.floor(Math.random() * 1000);
}

export async function GET() {
    await connectDB();
    // Fetch all user who wrote at least one blog post
    // update username for those who don't have username
    let authors = await User.find({}).lean();
    for (const author of authors) {
        if (!author.username) {
            author.username = generateUsername(author.fullName);
            // check if username already exists
            let existingUser = await User.findOne({ username: author.username });
            while (existingUser) {
                author.username = generateUsername(author.fullName);
                existingUser = await User.findOne({ username: author.username });
            }
            await User.findByIdAndUpdate(author._id, { username: author.username });
        }
    }
    // Filter out authors who have atleast one blog post noOfBlogs > 0
    authors = authors.filter(author => author.noOfBlogs > 0);

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${authors.map(author => `
            <url>
                <loc>${BASE_URL}/author/${author.username}</loc>
                <lastmod>${new Date().toISOString()}</lastmod>
                <changefreq>daily</changefreq>
                <priority>0.9</priority>
            </url>
        `).join('')}
    </urlset>`;

    return new NextResponse(sitemap, {
        status: 200,
        headers: { "Content-Type": "application/xml" },
    });
}