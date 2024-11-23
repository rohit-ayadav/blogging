import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Image, AlertCircle, Loader2 } from "lucide-react";

interface ThumbnailSectionProps {
    thumbnail: string | null;
    setThumbnail: (thumbnail: string) => void;
    isDarkMode?: boolean;
}

export const ThumbnailSection = ({
    thumbnail,
    setThumbnail
}: ThumbnailSectionProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const validateImageUrl = (url: string) => {
        setIsLoading(true);
        setError(null);

        const img = new window.Image();
        img.onload = () => {
            setIsLoading(false);
            setThumbnail(url);
        };
        img.onerror = () => {
            setIsLoading(false);
            setError('Unable to load image. Please check the URL and try again.');
            setThumbnail('');
        };
        img.src = url;
    };

    const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const url = e.target.value.trim();
        if (!url) {
            setThumbnail('');
            setError(null);
            return;
        }

        try {
            new URL(url);
            validateImageUrl(url);
        } catch {
            setError('Please enter a valid URL');
        }
    };

    return (
        <Card className="w-full mt-2 mb-2 sm:mt-3 sm:mb-3">
            <CardHeader className="flex flex-row items-center space-y-0 pb-2 px-3 sm:px-6">
                <Image className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-muted-foreground" />
                <CardTitle className="text-lg sm:text-xl font-bold">Thumbnail</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4 px-3 sm:px-6">
                <div className="grid w-full items-center gap-2">
                    <Label htmlFor="thumbnail" className="text-sm">
                        Thumbnail Image URL
                    </Label>
                    <Input
                        id="thumbnail"
                        type="url"
                        placeholder="https://example.com/image.jpg"
                        onChange={handleThumbnailChange}
                        defaultValue={thumbnail || ''}
                        className="w-full text-base sm:text-lg bg-background"
                    />
                    <p className="text-sm text-muted-foreground">
                        Optional: You can also add images directly in the content below
                    </p>
                </div>

                {error && (
                    <Alert variant="destructive" className="text-sm">
                        <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                        <AlertDescription className="ml-2">{error}</AlertDescription>
                    </Alert>
                )}

                {isLoading && (
                    <div className="flex items-center justify-center p-4 sm:p-8">
                        <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin text-muted-foreground" />
                    </div>
                )}

                {thumbnail && !error && !isLoading && (
                    <div className="space-y-2">
                        <Label className="text-sm">Preview</Label>
                        <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-muted">
                            <div className="absolute inset-0 bg-background/5 dark:bg-background/10" />
                            <img
                                src={thumbnail}
                                alt="Thumbnail preview"
                                className="w-full h-full object-cover transition-all duration-200 
                                         hover:opacity-90 
                                         dark:brightness-90 dark:hover:brightness-100"
                                loading="lazy"
                            />
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default ThumbnailSection;