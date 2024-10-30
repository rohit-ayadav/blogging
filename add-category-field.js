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

        const result = await client.db("blogging").collection("users").updateMany(
            { role: { $exists: false } },
            { $set: { role: "user" } }
        );
        // const result = await client.db("blogging").collection("blogs").updateMany(
        //   { category: { $exists: false } },
        //   { $set: { category: "Others" } }
        // );

        // Find and print the updated documents
        const cursor = client.db("blogging").collection("users").find();
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