"use client";
import { useEffect, useState } from "react";
import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { useTheme } from "@/context/ThemeContext";

const ReadingTimeBanner = () => {
    const { isDarkMode } = useTheme();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [readingTime, setReadingTime] = useState(0);

    const calculateReadingTime = () => {
        // Average reading speed: 200-250 words per minute
        const wordsPerMinute = 225;
        const textLength = content.split(/\s+/).length;
        const time = Math.ceil(textLength / wordsPerMinute);
        setReadingTime(time);
    };

    useEffect(() => {
        // Reset reading time when inputs change
        const timer = setTimeout(() => {
            if (content.trim()) {
                calculateReadingTime();
            } else {
                setReadingTime(0);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [content]);

    return (
        <section className={`py-8 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
            <div className="container mx-auto px-6">
                <Card className={`overflow-hidden border-0 ${isDarkMode ? 'bg-gradient-to-r from-blue-900/50 to-indigo-900/50' : 'bg-gradient-to-r from-blue-50 to-indigo-50'}`}>
                    <CardContent className="p-6 sm:p-8">
                        <div className="flex flex-col md:flex-row items-center gap-6">
                            <div className="flex-shrink-0 md:w-1/3 text-center md:text-left">
                                <h3 className="text-xl sm:text-2xl font-bold mb-2">Reading Time Calculator</h3>
                                <p className="text-gray-600 dark:text-gray-300">
                                    Paste your draft to see how long it will take readers to consume your content
                                </p>
                            </div>

                            <div className="flex-grow w-full md:w-auto">
                                <div className="flex flex-col sm:flex-row gap-3 mb-3">
                                    <Input
                                        type="text"
                                        placeholder="Article title (optional)"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
                                    />
                                    <div className="hidden sm:block w-32">
                                        <Card className={`text-center h-full flex items-center justify-center ${isDarkMode ? 'bg-blue-800' : 'bg-blue-100'}`}>
                                            <CardContent className="p-3">
                                                <p className="text-xs text-gray-600 dark:text-gray-300">Reading Time</p>
                                                <p className="text-2xl font-bold text-blue-600">{readingTime || 0} min</p>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </div>

                                <div className="relative">
                                    <textarea
                                        placeholder="Paste your article content here..."
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                        className={`w-full rounded-lg border border-gray-300 p-3 min-h-24 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}
                                    />

                                    <div className="sm:hidden mt-3">
                                        <Card className={`text-center ${isDarkMode ? 'bg-blue-800' : 'bg-blue-100'}`}>
                                            <CardContent className="p-3">
                                                <p className="text-xs text-gray-600 dark:text-gray-300">Reading Time</p>
                                                <p className="text-2xl font-bold text-blue-600">{readingTime || 0} min</p>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </section>
    );
};

export default ReadingTimeBanner;