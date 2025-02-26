"use client";
import React from 'react';
import ReadingTimeBanner from '@/components/HomepageComponent/ReadingTimeBanner';
import { Card, CardContent } from '@/components/ui/card';
import { useTheme } from '@/context/ThemeContext';

const ReadingTimeCalculatorPage = () => {
    const { isDarkMode } = useTheme();

    return (
        <main className={`min-h-screen ${isDarkMode ? 'bg-gray-950 text-white' : 'bg-gray-50 text-gray-900'}`}>
            {/* Page Header */}
            <header className={`py-8 ${isDarkMode ? 'bg-gray-900' : 'bg-white'} border-b ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}`}>
                <div className="container mx-auto px-6">
                    <h1 className="text-3xl md:text-4xl font-bold">Reading Time Calculator</h1>
                    <p className={`mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Estimate how long it will take your audience to read your content
                    </p>
                </div>
            </header>

            {/* Main Calculator Component */}
            <ReadingTimeBanner />

            {/* How It Works Section */}
            <section className={`py-12 ${isDarkMode ? 'bg-gray-900/50' : 'bg-white'}`}>
                <div className="container mx-auto px-6">
                    <h2 className="text-2xl font-bold mb-6">How It Works</h2>

                    <div className="grid md:grid-cols-3 gap-6">
                        <Card className={`border-0 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                            <CardContent className="p-6">
                                <div className={`w-12 h-12 rounded-full mb-4 flex items-center justify-center ${isDarkMode ? 'bg-blue-900/50' : 'bg-blue-100'}`}>
                                    <span className="text-xl font-bold text-blue-600">1</span>
                                </div>
                                <h3 className="text-xl font-semibold mb-2">Paste Your Content</h3>
                                <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                    Enter your article title and paste your content into the text area above.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className={`border-0 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                            <CardContent className="p-6">
                                <div className={`w-12 h-12 rounded-full mb-4 flex items-center justify-center ${isDarkMode ? 'bg-blue-900/50' : 'bg-blue-100'}`}>
                                    <span className="text-xl font-bold text-blue-600">2</span>
                                </div>
                                <h3 className="text-xl font-semibold mb-2">Instant Calculation</h3>
                                <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                    Our algorithm automatically counts words and calculates the estimated reading time at 225 words per minute.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className={`border-0 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                            <CardContent className="p-6">
                                <div className={`w-12 h-12 rounded-full mb-4 flex items-center justify-center ${isDarkMode ? 'bg-blue-900/50' : 'bg-blue-100'}`}>
                                    <span className="text-xl font-bold text-blue-600">3</span>
                                </div>
                                <h3 className="text-xl font-semibold mb-2">Optimize Content</h3>
                                <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                    Use the reading time to optimize your content for your audience's preferences and attention span.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Tips Section */}
            <section className="py-12">
                <div className="container mx-auto px-6">
                    <h2 className="text-2xl font-bold mb-6">Tips for Better Content</h2>

                    <Card className={`border-0 ${isDarkMode ? 'bg-gradient-to-r from-gray-800 to-gray-900' : 'bg-gradient-to-r from-gray-50 to-gray-100'}`}>
                        <CardContent className="p-6 sm:p-8">
                            <ul className="space-y-4">
                                <li className="flex gap-3">
                                    <div className={`flex-shrink-0 w-6 h-6 rounded-full ${isDarkMode ? 'bg-blue-900' : 'bg-blue-100'} flex items-center justify-center mt-1`}>
                                        <span className="text-blue-600 text-sm">✓</span>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold mb-1">Aim for the right length</h3>
                                        <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                            Blog posts of 7-8 minute reading time (1,600-1,800 words) tend to perform best for SEO and engagement.
                                        </p>
                                    </div>
                                </li>
                                <li className="flex gap-3">
                                    <div className={`flex-shrink-0 w-6 h-6 rounded-full ${isDarkMode ? 'bg-blue-900' : 'bg-blue-100'} flex items-center justify-center mt-1`}>
                                        <span className="text-blue-600 text-sm">✓</span>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold mb-1">Break up long content</h3>
                                        <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                            For content with reading times over 5 minutes, use more headings, bullet points, and images to improve readability.
                                        </p>
                                    </div>
                                </li>
                                <li className="flex gap-3">
                                    <div className={`flex-shrink-0 w-6 h-6 rounded-full ${isDarkMode ? 'bg-blue-900' : 'bg-blue-100'} flex items-center justify-center mt-1`}>
                                        <span className="text-blue-600 text-sm">✓</span>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold mb-1">Display reading time</h3>
                                        <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                            Show the estimated reading time on your published articles to set audience expectations.
                                        </p>
                                    </div>
                                </li>
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            </section>
        </main>
    );
};

export default ReadingTimeCalculatorPage;