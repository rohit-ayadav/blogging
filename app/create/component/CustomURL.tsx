import React, { useEffect, useState } from 'react';
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Link } from "lucide-react";
import { generateSeoSlug, makeValidSlug } from '@/lib/common-function';

interface UrlSectionProps {
    customUrl: string;
    setCustomUrl: (url: string) => void;
    title: string;
}

export const UrlSection = ({
    customUrl,
    setCustomUrl,
    title
}: UrlSectionProps) => {
    const [inputValue, setInputValue] = useState('');

    useEffect(() => {
        if (!customUrl && title) {
            // wait for 5000ms before setting the custom url
            const timeout = setTimeout(() => {
                setCustomUrl(generateSeoSlug(title));
            }, 5000);
        }
    }, [title, customUrl]);

    const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const input = e.target.value;
        // Only allow alphanumeric characters, hyphens, and spaces in input
        if (!/^[a-zA-Z0-9\s-]*$/.test(input)) {
            return;
        }
        setInputValue(input);
        const formatted = generateSeoSlug(input);
        setCustomUrl(formatted);
    };

    const displayUrl = customUrl || generateSeoSlug(title);
    const baseUrl = 'https://www.food.devblogger.in/blogs';

    return (
        <Card className="w-full mt-2 sm:mt-3">
            <CardHeader className="flex flex-row items-center space-y-0 pb-2 px-3 sm:px-6">
                <Link className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-muted-foreground" />
                <CardTitle className="text-lg sm:text-xl font-bold">Custom URL</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 px-3 sm:px-6">
                <div className="grid w-full items-center gap-2">
                    <Label
                        htmlFor="customUrl"
                        className="text-sm text-muted-foreground"
                    >
                        Enter a custom URL for your blog post (optional)
                    </Label>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                        <div className="flex-shrink-0 text-xs sm:text-sm text-muted-foreground font-mono break-all">
                            {baseUrl}/
                        </div>
                        <div className="w-full">
                            <Input
                                id="customUrl"
                                value={inputValue || displayUrl}
                                onChange={handleUrlChange}
                                placeholder="my-awesome-blog-post"
                                className="w-full text-sm sm:text-base bg-background font-mono"
                                maxLength={100}
                            />
                        </div>
                    </div>
                    {!displayUrl && (
                        <p className="text-xs sm:text-sm text-muted-foreground">
                            Add a custom URL to make your blog post easy to find and share
                        </p>
                    )}
                    {displayUrl && (
                        <p className="text-xs sm:text-sm text-muted-foreground">
                            Your blog post will be available at: {baseUrl}/{displayUrl}
                        </p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default UrlSection;