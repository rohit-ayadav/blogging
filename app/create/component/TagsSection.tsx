import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Tag, X } from "lucide-react";

interface TagsSectionProps {
    tags: string[];
    setTags: (tags: string[]) => void;
    content: string;
    isDarkMode?: boolean;
}

export const TagsSection = ({
    tags,
    setTags,
    content,
}: TagsSectionProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const [tagAutoGen, setTagAutoGen] = useState(false);

    const generateTags = async () => {
        if (content.length < 50) {
            toast.error('Content should be at least 50 characters long to generate tags');
            return;
        }

        setIsLoading(true);

        try {
            const newTags = await generateTagsFromContent(content);
            if (newTags) {
                const uniqueTags = [...new Set([...tags, ...newTags])];
                setTags(uniqueTags);
                toast.success('Tags generated successfully');
            }
        } catch (error) {
            toast.error('Failed to generate tags');
            console.error('Error generating tags:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const generateTagsFromContent = async (content: string) => {
        const response = await fetch('/api/generateTags', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content }),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error);
        return data.tags;
    };

    const handleTagInput = (value: string) => {
        const newTags = value
            .split(/[,#\n]/)
            .map(tag => tag.trim().toLowerCase())
            .filter(tag => tag && !tags.includes(tag));

        if (newTags.length) {
            setTags([...tags, ...newTags]);
        }
    };

    const removeTag = (indexToRemove: number) => {
        setTags(tags.filter((_, index) => index !== indexToRemove));
    };

    return (
        <Card className="w-full mt-2 sm:mt-3">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 sm:px-6">
                <div className="flex items-center">
                    <Tag className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-muted-foreground" />
                    <CardTitle className="text-lg sm:text-xl font-bold">Tags</CardTitle>
                </div>
                {!tagAutoGen && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={generateTags}
                        disabled={isLoading}
                        className="flex items-center gap-1.5 text-xs sm:text-sm h-8 sm:h-9"
                    >
                        {isLoading ? (
                            <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                        ) : (
                            <Tag className="h-3 w-3 sm:h-4 sm:w-4" />
                        )}
                        <span className="hidden sm:inline">Generate</span> Tags
                    </Button>
                )}
            </CardHeader>
            <CardContent className="space-y-3 px-3 sm:px-6">
                {!tagAutoGen && (
                    <div className="space-y-3 sm:space-y-4">
                        <Input
                            placeholder="Add tags (separate by comma or press enter)"
                            className="w-full text-sm sm:text-base bg-background"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ',') {
                                    e.preventDefault();
                                    handleTagInput(e.currentTarget.value);
                                    e.currentTarget.value = '';
                                }
                            }}
                        />
                    </div>
                )}

                {tags.length > 0 && (
                    <div className="mt-3 sm:mt-4">
                        <p className="text-xs sm:text-sm text-muted-foreground mb-2">Current Tags:</p>
                        <div className="flex flex-wrap gap-1.5 sm:gap-2">
                            {tags.map((tag, index) => (
                                <Badge
                                    key={`${tag}-${index}`}
                                    variant="secondary"
                                    className="flex items-center gap-1 px-2 py-0.5 sm:py-1 text-xs sm:text-sm 
                                             bg-secondary/50 hover:bg-secondary/70 transition-colors"
                                >
                                    {tag}
                                    <button
                                        onClick={() => removeTag(index)}
                                        className="ml-0.5 text-muted-foreground hover:text-destructive 
                                                 transition-colors focus:outline-none focus:ring-2 
                                                 focus:ring-ring focus:ring-offset-1 rounded-full"
                                        aria-label={`Remove ${tag} tag`}
                                    >
                                        <X className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                                    </button>
                                </Badge>
                            ))}
                        </div>
                        {tags.length > 0 && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setTags([])}
                                className="mt-2 text-xs sm:text-sm h-7 text-destructive hover:text-destructive/90 
                                         hover:bg-destructive/10 px-2"
                            >
                                Clear all tags
                            </Button>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default TagsSection;