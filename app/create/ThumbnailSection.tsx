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
        <Card className="w-full mt-3 mb-3">
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <Image className="w-5 h-5 mr-2 text-muted-foreground" />
                <CardTitle className="text-xl font-bold">Thumbnail</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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
                        className="w-full"
                    />
                    <p className="text-sm text-muted-foreground">
                        Optional: You can also add images directly in the content below
                    </p>
                </div>

                {error && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                {isLoading && (
                    <div className="flex items-center justify-center p-8">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                )}

                {thumbnail && !error && !isLoading && (
                    <div className="space-y-2">
                        <Label className="text-sm">Preview</Label>
                        <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-muted">
                            <img
                                src={thumbnail}
                                alt="Thumbnail preview"
                                className="w-full h-full object-cover transition-opacity duration-200 hover:opacity-90"
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