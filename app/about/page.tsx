export default function AboutPage() {
    return (
        <>
            <div className="container mx-auto p-4">
                <h1 className="text-4xl font-bold text-center mb-3">About Blogging App</h1>
                <p className="text-center">This is a simple blogging app where you can create, read, update and delete your blogs.</p>
                <div className="flex justify-center mt-5">
                    <a href="/blogs" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">View Blogs</a>

                    <a href="/create" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-3">Create Blog</a>
                </div></div>
        </>
    )
};