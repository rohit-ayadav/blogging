// import { generateSeoSlug, isValidSEOSlug } from "@/lib/common-function";
// import Blog from "@/models/blogs.models";
// import { connectDB } from "@/utils/db";
// async function improveSlug() {
//     await connectDB(); // Ensure DB is connected

//     const posts = await Blog.find({}).lean().exec();
//     const bulkUpdates = [];

//     for (const post of posts) {
//         if (!isValidSEOSlug(post.slug)) {
//             let newSlug = generateSeoSlug(post.title);
//             let counter = 1;

//             // Ensure uniqueness
//             while (await Blog.findOne({ slug: newSlug })) {
//                 newSlug = generateSeoSlug(post.title, counter++);
//             }

//             bulkUpdates.push({
//                 updateOne: {
//                     filter: { _id: post._id },
//                     update: { $set: { slug: newSlug } },
//                 },
//             });
//         }
//     }

//     if (bulkUpdates.length > 0) {
//         await Blog.bulkWrite(bulkUpdates);
//         console.log(`Updated ${bulkUpdates.length} slugs successfully.`);
//     } else {
//         console.log("All slugs are already valid.");
//     }
// }
// export default async function Page() {
//     const testTitle = `--- This is 40 characters long title with special characters: !@#$%^&*()_+{}|:"<>?[];',./ --- Again this is 40 characters long title with special characters: !@#$%^&*()_+{}|:"<>?[];',./ ---`;
//     const testSlug = generateSeoSlug(testTitle);
//     return (
//         <div className="p-6">
//             <h1 className="text-3xl font-bold">Generated SEO Slug</h1>
//             <p className="mt-4">Title: {testTitle}</p>
//             <p>Generated Slug: {testSlug}</p>
//         </div>
//     )
// }

"use client";
import React from 'react'

const page = () => {
    return (
        <div className='p-6'>
            <h1 className='text-3xl font-bold'>Test Page</h1>
            <button
                title="Go to HomePage"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                onClick={() => {
                    window.location.href = '/';
                }}
            >
                Home
            </button>

        </div>
    )
}

export default page
