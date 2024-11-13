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
    tagAutoGen: boolean;
    setTagAutoGen: (value: boolean) => void;
    isDarkMode?: boolean;
}

export const TagsSection = ({
    tags,
    setTags,
    content,
    tagAutoGen,
    setTagAutoGen
}: TagsSectionProps) => {
    const [isLoading, setIsLoading] = useState(false);

    const generateTags = async () => {
        if (content.length < 50) {
            toast.error('Content should be at least 50 characters long to generate tags');
            return;
        }

        setIsLoading(true);
        // setTagAutoGen(true);

        try {
            const newTags = await generateTagsFromContent(content);
            if (newTags) {
                // Filter out duplicates
                const uniqueTags = [...new Set([...tags, ...newTags])];
                setTags(uniqueTags);
                toast.success('Tags generated successfully');
            }
        } catch (error) {
            toast.error('Failed to generate tags');
            console.error('Error generating tags:', error);
        } finally {
            setIsLoading(false);
            // setTagAutoGen(false);
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
        <Card className="w-full mt-3">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xl font-bold">Tags</CardTitle>
                {!tagAutoGen && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={generateTags}
                        disabled={isLoading}
                        className="flex items-center gap-2"
                    >
                        {isLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Tag className="h-4 w-4" />
                        )}
                        Generate Tags
                    </Button>
                )}
            </CardHeader>
            <CardContent>
                {!tagAutoGen && (
                    <div className="space-y-4">
                        <Input
                            placeholder="Add tags (separate by comma or press enter)"
                            className="w-full"
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
                    <div className="mt-4">
                        <p className="text-sm text-gray-500 mb-2">Current Tags:</p>
                        <div className="flex flex-wrap gap-2">
                            {tags.map((tag, index) => (
                                <Badge
                                    key={`${tag}-${index}`}
                                    variant="secondary"
                                    className="flex items-center gap-1 px-2 py-1"
                                >
                                    {tag}
                                    <button
                                        onClick={() => removeTag(index)}
                                        className="ml-1 hover:text-red-500 transition-colors"
                                        aria-label={`Remove ${tag} tag`}
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </Badge>
                            ))}
                            {/* Clear all tags  */}
                            <button
                                onClick={() => setTags([])}
                                className="text-sm text-red-500 hover:underline" 
                            >
                                Clear all tags
                            </button>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default TagsSection;