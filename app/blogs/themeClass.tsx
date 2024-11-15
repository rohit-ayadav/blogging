import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface ThemeClasses {
    layout: string;
    container: string;
    header: string;
    title: string;
    controls: string;
    searchContainer: string;
    input: string;
    select: string;
    themeToggle: string;
}

const themeClasses: (isDarkMode: boolean) => ThemeClasses = (isDarkMode: boolean) => {
    const themeClasses: ThemeClasses = {
        layout: `min-h-screen transition-colors duration-300 ease-in-out
        ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`,
        container: 'container mx-auto px-4 py-8',
        header: 'flex justify-between items-center mb-8',
        title: `text-4xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`,
        controls: 'mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4',
        searchContainer: 'relative',
        input: `w-full rounded-lg border pl-10 ${isDarkMode
            ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400'
            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'}`,
        select: `w-full ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`,
        themeToggle: `rounded-full p-2 ${isDarkMode
            ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700'
            : 'bg-gray-100 text-gray-900 hover:bg-gray-200'}`
    };
    return themeClasses;
};





// Loading state component
const LoadingState = ({ message }: { message: string }) => (
    <div className="flex items-center justify-center space-x-2 py-4">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="text-sm text-gray-500">{message}</span>
    </div>
);

// No more posts component
const NoMorePosts = () => (
    <div className="flex flex-col items-center justify-center py-8 space-y-2">
        <span className="text-gray-500">No more posts to load</span>
        <Button
            variant="outline"
            size="sm"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
            Back to top
        </Button>
    </div>
);

// Empty state component
const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-16 space-y-4">
        <div className="text-4xl">📝</div>
        <h3 className="text-xl font-semibold">No posts found</h3>
        <p className="text-gray-500 text-center max-w-md">
            Try adjusting your search or filters to find what you're looking for
        </p>
    </div>
);


export { themeClasses, LoadingState, NoMorePosts, EmptyState };
