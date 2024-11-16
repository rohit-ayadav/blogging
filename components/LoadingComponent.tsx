const LoadingSkeleton = () => (
    <div className="space-y-4">
        <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center" />
            <div className="space-y-2">
                <div className="w-24 h-4 bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="w-16 h-3 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
        </div>
        <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex gap-4 p-3 rounded-lg bg-gray-100 dark:bg-gray-800/50">
                    <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-md" />
                    <div className="flex-1 space-y-2">
                        <div className="w-3/4 h-4 bg-gray-200 dark:bg-gray-700 rounded" />
                        <div className="w-2/4 h-3 bg-gray-200 dark:bg-gray-700 rounded" />
                    </div>
                </div>
            ))}
        </div>
    </div>
);

export default LoadingSkeleton;