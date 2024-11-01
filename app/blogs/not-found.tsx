// app/blogs/not-found.tsx
export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 max-w-2xl w-full">
                <div className="flex">
                    <div>
                        <p className="text-yellow-700">Blog Post Not Found</p>
                        <p className="text-yellow-700 mt-1">
                            The blog post you're looking for doesn't exist or has been removed.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}