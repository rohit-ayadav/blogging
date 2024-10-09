"use client";
import React, { use } from 'react';
import { useEffect } from 'react';



function HomePage() {
  
  return (
    <>
      <div className="container mx-auto p-4">
        <h1 className="text-4xl font-bold text-center mb-3">Welcome to Blogging App</h1>
        <p className="text-center">This is a simple blogging app where you can create, read, update and delete your blogs.</p>
        <div className="flex justify-center mt-5">
          <a href="/blogs" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">View Blogs</a>

          <a href="/create" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-3">Create Blog</a>
        </div>

        <h1 className="text-4xl font-bold text-center mt-10">Features</h1>
        <ul className="list-disc list-inside mt-3">
          <li>View all blogs</li>
          <li>Create a new blog</li>
          <li>Update an existing blog</li>
          <li>Delete a blog</li>
        </ul>

        <h1 className="text-4xl font-bold text-center mt-10">Technologies</h1>

        <div className="flex justify-center mt-3">
          <span className="px-3 py-1 bg-gray-200 rounded-full text-sm">Next.js</span>
          <span className="px-3 py-1 bg-gray-200 rounded-full text-sm ml-2">Tailwind CSS</span>
          <span className="px-3 py-1 bg-gray-200 rounded-full text-sm ml-2">React</span>
          <span className="px-3 py-1 bg-gray-200 rounded-full text-sm ml-2">TypeScript</span>
          <span className="px-3 py-1 bg-gray-200 rounded-full text-sm ml-2">Supabase</span>

          <span className="px-3 py-1 bg-gray-200 rounded-full text-sm ml-2">React Quill</span>

        </div>
      </div>
    </>
  )
}

export default HomePage;