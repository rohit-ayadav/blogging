import { NextResponse } from "next/server";
import { connectDB } from "@/utils/db";
import Blog from "@/models/blogs.models";

const BASE_URL = "https://www.food.devblogger.in";

export async function GET() {
    await connectDB();
    const posts = await Blog.find({}).lean();

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${posts.map(post => `
            <url>
                <loc>${BASE_URL}/blogs/${post.slug}</loc>
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