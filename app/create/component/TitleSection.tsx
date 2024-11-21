import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Loader2, TriangleAlertIcon, Type } from "lucide-react";

interface TitleSectionProps {
    title: string;
    setTitle: (title: string) => void;
    content: string;
    isDarkMode?: boolean;
}

export const TitleSection = ({ title, setTitle, content }: TitleSectionProps) => {
    const [isGenerating, setIsGenerating] = useState(false);
    const MAX_LENGTH = 250;

    const generateTitle = async () => {
        if (content.length < 50) {
            toast.error('Content should be at least 50 characters long to generate title');
            return;
        }

        setIsGenerating(true);

        toast.promise(getTitle(content), {
            loading: 'Generating Title...',
            success: 'Title generated successfully',
            error: 'Failed to generate title',
        }).then(newTitle => {
            if (newTitle) {
                setTitle(newTitle);
            }
        }).catch(error => {
            console.error('Error generating title:', error);
        }).finally(() => {
            setIsGenerating(false);
        });
    };

    const getTitle = async (content: string) => {
        const response = await fetch("/api/generateTitle", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ content }),
        });

        const data = await response.json();
        if (response.ok) return data.title;
        throw new Error(data.error);
    };

    const characterProgress = (title.length / MAX_LENGTH) * 100;

    return (
        <Card className="w-full mt-3 mb-3">
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <Type className="w-5 h-5 mr-2 text-muted-foreground" />
                <CardTitle className="text-xl font-bold">Blog Title</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid w-full items-center gap-2">
                    <Label htmlFor="title" className="text-sm">
                        Enter your blog title
                    </Label>
                    <Input
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter the blog title"
                        maxLength={MAX_LENGTH}
                        className="w-full text-lg"
                    />

                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <Button
                                variant="link"
                                size="sm"
                                onClick={generateTitle}
                                disabled={isGenerating}
                                className="p-0 h-auto font-normal"
                            >
                                {isGenerating ? (
                                    <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                                ) : null}
                                Generate title from content
                            </Button>
                        </div>
                        <span>
                            {title.length} / {MAX_LENGTH}
                        </span>
                    </div>

                    {title.length > 0 && (
                        <Progress
                            value={characterProgress}
                            className={`h-1 ${characterProgress > 80 ? "bg-red-500" : ""}`}
                        />
                    )}

                    {title.length > 200 && (
                        <p className="text-red-500 text-sm">
                            <TriangleAlertIcon className="h-4 w-4 mr-1" /> Approaching maximum length ({MAX_LENGTH} characters)
                        </p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default TitleSection;