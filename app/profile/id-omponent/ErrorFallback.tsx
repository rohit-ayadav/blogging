import { Button } from "@/components/ui/button";
export const ErrorFallback = ({ error, resetErrorBoundary }: { error: Error, resetErrorBoundary: () => void }) => (
    <div className="text-center p-4">
        <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">{error.message}</p>
        <Button onClick={resetErrorBoundary}>Try again</Button>
    </div>
);