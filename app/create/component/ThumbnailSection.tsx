import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Image, AlertCircle, Loader2, Search } from "lucide-react";
import { fetchUnsplashImages } from '@/utils/getUnsplashImages';

interface UnsplashImage {
    id: string;
    urls: {
        regular: string;
        small: string;
    };
    user: {
        name: string;
        username: string;
    };
    links: {
        html: string;
    };
}

interface ThumbnailSectionProps {
    thumbnail: string | null;
    setThumbnail: (thumbnail: string) => void;
    thumbnailCredit?: string | null;
    setThumbnailCredit?: (credit: string) => void;
    isDarkMode?: boolean;
}

const ThumbnailSection = ({
    thumbnail,
    setThumbnail,
    thumbnailCredit,
    setThumbnailCredit
}: ThumbnailSectionProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [query, setQuery] = useState<string>("");
    const [images, setImages] = useState<UnsplashImage[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState<UnsplashImage | null>(null);
    const [page, setPage] = useState(1);

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
            setSelectedImage(null);
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

    const handleImageSearch = async () => {
        if (!query.trim()) {
            setError('Please enter a search term');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const fetchedImages = await fetchUnsplashImages(query);
            setImages(fetchedImages.images);
            setPage(1);
            setIsModalOpen(true);
        } catch (error: any) {
            setError(error.message || 'Failed to fetch images');
        } finally {
            setIsLoading(false);
        }
    };

    const handleLoadMore = async () => {
        setIsLoading(true);
        try {
            const moreImages = await fetchUnsplashImages(query, page + 1, 9);
            setPage(page + 1);
            setImages([...images, ...moreImages.images]);
        } catch (error: any) {
            setError(error.message || 'Failed to load more images');
        } finally {
            setIsLoading(false);
        }
    };

    const handleImageSelect = (image: UnsplashImage) => {
        if (!image || !image.user) return; // Ensure valid image object

        setThumbnail(image.urls.regular);
        const credit = image.user.username || 'Unsplash';
        setThumbnailCredit && setThumbnailCredit(credit);
        setSelectedImage(image);
        setIsModalOpen(false);
    };


    return (
        <>
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
                        <div className="flex gap-2">
                            <Input
                                id="thumbnail"
                                type="url"
                                placeholder="https://example.com/image.jpg"
                                onChange={handleThumbnailChange}
                                value={thumbnail || ''}
                                className="w-full text-base sm:text-lg bg-background"
                            />
                            <Button
                                variant="outline"
                                className="shrink-0"
                                onClick={() => setIsModalOpen(true)}
                            >
                                Browse
                            </Button>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Enter a URL directly or browse Unsplash images
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
                            {selectedImage && (
                                <p className="text-sm text-muted-foreground">
                                    Photo by{" "}
                                    <a
                                        href={`https://unsplash.com/@${selectedImage.user.username}?utm_source=TheFoodBlogger&utm_medium=referral`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="font-medium hover:underline"
                                    >
                                        {selectedImage.user.name}
                                    </a > {" "}
                                    on{" "}
                                    <a
                                        href="https://unsplash.com/?utm_source=TheFoodBlogger&utm_medium=referral"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="font-medium hover:underline"
                                    >
                                        Unsplash
                                    </a>
                                </p >
                            )}
                        </div >
                    )}
                </CardContent >
            </Card >

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Select Thumbnail Image</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="flex gap-2">
                            <Input
                                placeholder="Search Unsplash images..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleImageSearch()}
                            />
                            <Button onClick={handleImageSearch} className="shrink-0">
                                <Search className="w-4 h-4 mr-2" />
                                Search
                            </Button>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {images.map((img) => (
                                <div
                                    key={img.id}
                                    className="aspect-video relative rounded-lg overflow-hidden cursor-pointer 
                                             group hover:ring-2 hover:ring-primary transition-all duration-200"
                                    onClick={() => handleImageSelect(img)}
                                >
                                    <img
                                        src={img.urls.small}
                                        alt={`Photo by ${img.user.name}`}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 
                                                  transition-opacity duration-200 flex items-center justify-center">
                                        <span className="text-white font-medium">Select</span>
                                    </div>
                                    <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/70 text-white text-xs">
                                        Photo by {img.user.name}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {images.length > 0 && (
                            <div className="flex justify-center pt-4">
                                <Button
                                    onClick={handleLoadMore}
                                    variant="outline"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    ) : null}
                                    Load More
                                </Button>
                            </div>
                        )}

                        {images.length === 0 && !isLoading && (
                            <p className="text-center text-muted-foreground">
                                Search for images to get started
                            </p>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default ThumbnailSection;