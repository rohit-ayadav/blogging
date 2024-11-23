import React from 'react';
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
    isDarkMode: boolean;
    text?: string;
    size?: 'sm' | 'md' | 'lg';
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
    isDarkMode,
    text = 'Loading editor...',
    size = 'md'
}) => {
    const sizeClasses = {
        sm: 'h-6 w-6',
        md: 'h-8 w-8',
        lg: 'h-12 w-12'
    };

    return (
        <div className={cn(
            "flex flex-col items-center justify-center",
            "min-h-[200px] p-8",
            "rounded-lg",
            isDarkMode
                ? "bg-gray-800/50"
                : "bg-gray-50/50",
            "backdrop-blur-sm",
            "animate-in fade-in duration-500"
        )}>
            <div className={cn(
                "relative",
                "flex items-center justify-center"
            )}>
                {/* Outer glow effect */}
                <div className={cn(
                    "absolute",
                    sizeClasses[size],
                    "animate-ping",
                    isDarkMode
                        ? "bg-gray-300/10"
                        : "bg-primary/10",
                    "rounded-full"
                )} />

                {/* Primary spinner */}
                <Loader2 className={cn(
                    sizeClasses[size],
                    "animate-spin",
                    "relative",
                    isDarkMode
                        ? "text-gray-300"
                        : "text-primary",
                    "drop-shadow-lg"
                )} />
            </div>

            <div className="mt-6 space-y-2 text-center">
                <p className={cn(
                    "text-base sm:text-lg font-medium",
                    "transition-colors duration-200",
                    isDarkMode
                        ? "text-gray-300"
                        : "text-gray-700"
                )}>
                    {text}
                </p>
                <div className={cn(
                    "flex justify-center gap-1.5",
                    "animate-pulse"
                )}>
                    {[...Array(3)].map((_, i) => (
                        <div
                            key={i}
                            className={cn(
                                "w-1.5 h-1.5 rounded-full",
                                isDarkMode
                                    ? "bg-gray-500"
                                    : "bg-gray-400"
                            )}
                            style={{
                                animationDelay: `${i * 200}ms`
                            }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LoadingSpinner;