import React from "react";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const PageHeader = ({ isDarkMode, error }: { isDarkMode: boolean; error: string | null }) => (
    <div className="flex items-center justify-between">
        <h1 className={cn(
            "text-3xl font-bold tracking-tight",
            isDarkMode ? "text-white" : "text-gray-900"
        )}>Create Blog Post</h1>
        {error && (
            <Alert variant="destructive" className={cn(
                "mt-4",
                isDarkMode && "bg-red-900 border-red-800"
            )}>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}
    </div>
);

export default PageHeader;