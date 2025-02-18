"use client";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import React from "react";


const Dashboard = () => {
    const router = useRouter();
    const handleSignOut = async () => {
        router.push("/signout");
    };
    return (
        <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 py-3 px-4 sm:px-6 lg:px-8">
            <div>
                <h2 className="mt-0 text-center text-3xl font-extrabold text-gray-900">
                    Welcome to Dashboard
                </h2>
                <p className="text-center">You can manage your blogs here.</p>
                <div className="flex justify-center mt-5">
                    <a href="/blogs" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        View Blogs
                    </a>

                    <a href="/create" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-3">
                        Create Blog
                    </a>
                </div>

                <button
                    onClick={handleSignOut}
                    className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mt-4"
                >
                    Sign out
                </button>
            </div>
        </div>
    );
}

export default Dashboard;