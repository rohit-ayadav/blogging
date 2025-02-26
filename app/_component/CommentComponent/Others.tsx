import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, MessageCircle, X } from "lucide-react";
import { useThemeClass } from "./DeleteConfirmation";
import { motion } from "framer-motion";

// Loading skeleton component
const CommentSkeleton = () => {
    const getThemeClass = useThemeClass();

    return (
        <Card className={`mb-4 ${getThemeClass('bg-white', 'bg-gray-800')} border ${getThemeClass('border-gray-200', 'border-gray-700')}`}>
            <CardContent className="pt-4">
                <div className="flex items-start space-x-4">
                    <Skeleton className="h-10 w-10 rounded-full shrink-0" />
                    <div className="flex-1 space-y-2">
                        <div className="flex justify-between">
                            <Skeleton className="h-4 w-1/4 rounded" />
                            <Skeleton className="h-4 w-1/6 rounded" />
                        </div>
                        <Skeleton className="h-4 w-full rounded" />
                        <Skeleton className="h-4 w-3/4 rounded" />
                        <Skeleton className="h-4 w-1/6 rounded" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

// Empty state component
const EmptyComments = () => {
    const getThemeClass = useThemeClass();

    return (
        <div className={`text-center py-12 ${getThemeClass('text-gray-600', 'text-gray-400')}`}>
            <MessageCircle size={36} className="mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">No comments yet</p>
            <p className="mt-1">Be the first to share your thoughts!</p>
        </div>
    );
};

// Error state component
const ErrorState = ({ error, onRetry }: { error: string, onRetry: () => void }) => {
    const getThemeClass = useThemeClass();

    return (
        <div className={`text-center py-12 ${getThemeClass('text-gray-600', 'text-gray-400')}`}>
            <AlertCircle size={36} className="mx-auto mb-4 text-red-500" />
            <p className="text-lg font-medium mb-2">Oops! Something went wrong</p>
            <p>{error}</p>
            <Button
                onClick={onRetry}
                variant="outline"
                className="mt-4"
            >
                Try Again
            </Button>
        </div>
    );
};


// Toast notification component
const ToastNotification = ({ message, type, onClose }: { message: string, type: 'success' | 'error' | 'info', onClose: () => void }) => {
    const getThemeClass = useThemeClass();
    const bgColor = type === 'success'
        ? getThemeClass('bg-green-50', 'bg-green-900/20')
        : type === 'error'
            ? getThemeClass('bg-red-50', 'bg-red-900/20')
            : getThemeClass('bg-blue-50', 'bg-blue-900/20');

    const textColor = type === 'success'
        ? 'text-green-500'
        : type === 'error'
            ? 'text-red-500'
            : 'text-blue-500';

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`flex items-center justify-between ${bgColor} ${textColor} p-3 rounded-md mb-4`}
        >
            <div className="flex items-center gap-2">
                {type === 'success' && (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 6L9 17l-5-5" />
                    </svg>
                )}
                {type === 'error' && <AlertCircle size={16} />}
                {type === 'info' && <MessageCircle size={16} />}
                <span>{message}</span>
            </div>
            <button onClick={onClose} className="p-1 rounded-full hover:bg-black/10">
                <X size={14} />
            </button>
        </motion.div>
    );
};


export { CommentSkeleton, EmptyComments, ErrorState, ToastNotification };