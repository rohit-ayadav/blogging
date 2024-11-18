const { MongoClient } = require('mongodb');
// No import will work
// No env will work

const uri = process.env.MONGODB_URI;

// node add-category-field.js

async function addCategoryField() {
    if (!uri) {
        console.error("MongoDB URI not provided");
        return;
    }
    const client = new MongoClient(uri);

    try {
        await client.connect();
        console.log("Connected to MongoDB");

        // const result = await client.db("blogging").collection("blogs").updateMany(
        //     { slug: { $exists: false } },
        //     { $set: { language: "1" } }
        // );
        // const result = await client.db("blogging").collection("blogs").updateMany(
        //     { language: "1" }, // Match documents modified by the original script
        //     { $set: { language: "html" } } // Restore to "html" or another known value
        // );
        // const result = await client.db("blogging").collection("users").updateMany(
        //     { role: { $exists: false } },
        //     { $set: { role: "user" } }
        // );
        // const result = await client.db("blogging").collection("blogs").updateMany(
        //   { category: { $exists: false } },
        //   { $set: { category: "Others" } }
        // );

        // delete with {active: false} all documents
        const result = await client.db("blogging").collection("notifications").deleteMany(
            { active: false }
        );


        // Find and print the updated documents
        const cursor = client.db("blogging").collection("notifications").find();
        const results = await cursor.toArray();
        console.log(results);
        // console.log(results.map(blog =>blog.title + " - " + blog.category));


        console.log(`${result.modifiedCount} documents updated`);
    } catch (error) {
        console.error("Error updating documents:", error);
    } finally {
        await client.close();
        console.log("Disconnected from MongoDB");
    }
}

addCategoryField().catch(console.error);

// const { MongoClient } = require('mongodb');


// async function addUrlFriendlySlug() {
//     if (!uri) {
//         console.error("MongoDB URI not provided");
//         return;
//     }
//     const client = new MongoClient(uri);

//     try {
//         await client.connect();
//         console.log("Connected to MongoDB");

//         // Fetch all blogs without a slug field
//         const cursor = client.db("blogging").collection("blogs").find({ slug: { $exists: false } });
//         const blogs = await cursor.toArray();

//         for (const blog of blogs) {
//             // Generate a URL-friendly slug
//             const slug = blog.title
//                 .toLowerCase() // Convert to lowercase
//                 .trim() // Remove leading/trailing whitespace
//                 .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
//                 .replace(/\s+/g, "-"); // Replace spaces with hyphens

//             // Update the document with the generated slug
//             await client.db("blogging").collection("blogs").updateOne(
//                 { _id: blog._id },
//                 { $set: { slug: slug } }
//             );
//         }

//         console.log(`${blogs.length} documents updated with URL-friendly slug`);
//     } catch (error) {
//         console.error("Error adding URL-friendly slug field:", error);
//     } finally {
//         await client.close();
//         console.log("Disconnected from MongoDB");
//     }
// }

// addUrlFriendlySlug().catch(console.error);
