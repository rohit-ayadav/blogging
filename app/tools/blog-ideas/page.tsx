"use client";
import React from 'react';
import BlogIdeaGenerator from '@/components/HomepageComponent/BlogPostIdeaGenerator';
import { Card, CardContent } from '@/components/ui/card';
import { useTheme } from '@/context/ThemeContext';
import { Lightbulb, PenTool, BarChart, Clock, Zap } from 'lucide-react';
import Link from 'next/link';

const BlogIdeaGeneratorPage = () => {
    const { isDarkMode } = useTheme();

    return (
        <main className={`min-h-screen ${isDarkMode ? 'bg-gray-950 text-white' : 'bg-gray-50 text-gray-900'}`}>
            {/* Hero Section */}
            <header className={`py-16 ${isDarkMode ? 'bg-gradient-to-br from-blue-900/30 to-purple-900/30' : 'bg-gradient-to-br from-blue-50 to-purple-50'}`}>
                <div className="container mx-auto px-6 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Blog Idea Generator</h1>
                    <p className={`text-xl max-w-2xl mx-auto ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        Never run out of content ideas again. Generate engaging blog topics tailored to your niche and content format.
                    </p>
                </div>
            </header>

            {/* Main Generator Component */}
            <BlogIdeaGenerator />

            {/* Why Use This Tool Section */}
            <section className={`py-16 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
                <div className="container mx-auto px-6">
                    <h2 className="text-3xl font-bold mb-12 text-center">Why Use Our Blog Idea Generator</h2>

                    <div className="grid md:grid-cols-3 gap-8">
                        <Card className={`border-0 ${isDarkMode ? 'bg-gray-800 hover:bg-gray-750' : 'bg-gray-50 hover:bg-gray-100'} transition-all`}>
                            <CardContent className="p-6 flex flex-col items-center text-center">
                                <div className={`w-16 h-16 rounded-full mb-4 flex items-center justify-center ${isDarkMode ? 'bg-blue-900/30' : 'bg-blue-100'}`}>
                                    <Lightbulb className={`h-8 w-8 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                                </div>
                                <h3 className="text-xl font-semibold mb-3">Overcome Writer's Block</h3>
                                <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                    Get instant inspiration when you're stuck or running low on fresh content ideas for your audience.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className={`border-0 ${isDarkMode ? 'bg-gray-800 hover:bg-gray-750' : 'bg-gray-50 hover:bg-gray-100'} transition-all`}>
                            <CardContent className="p-6 flex flex-col items-center text-center">
                                <div className={`w-16 h-16 rounded-full mb-4 flex items-center justify-center ${isDarkMode ? 'bg-purple-900/30' : 'bg-purple-100'}`}>
                                    <BarChart className={`h-8 w-8 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                                </div>
                                <h3 className="text-xl font-semibold mb-3">Audience-Focused Content</h3>
                                <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                    Generate ideas tailored to specific niches and formats that resonate with your target audience.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className={`border-0 ${isDarkMode ? 'bg-gray-800 hover:bg-gray-750' : 'bg-gray-50 hover:bg-gray-100'} transition-all`}>
                            <CardContent className="p-6 flex flex-col items-center text-center">
                                <div className={`w-16 h-16 rounded-full mb-4 flex items-center justify-center ${isDarkMode ? 'bg-indigo-900/30' : 'bg-indigo-100'}`}>
                                    <Zap className={`h-8 w-8 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
                                </div>
                                <h3 className="text-xl font-semibold mb-3">Save Time and Energy</h3>
                                <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                    Focus your creative energy on writing great content rather than brainstorming what to write about.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Content Calendar Tips */}
            <section className="py-16">
                <div className="container mx-auto px-6">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-3xl font-bold mb-6 text-center">Tips for Your Content Calendar</h2>
                        <p className={`text-center mb-12 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            Make the most of your generated ideas with these content planning strategies
                        </p>

                        <Card className={`border-0 ${isDarkMode ? 'bg-gradient-to-br from-gray-800 to-gray-900' : 'bg-gradient-to-br from-gray-50 to-gray-100'}`}>
                            <CardContent className="p-8">
                                <ul className="space-y-6">
                                    <li className="flex gap-4">
                                        <div className="flex-shrink-0">
                                            <PenTool className={`h-6 w-6 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold mb-1">Mix Content Formats</h3>
                                            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                                Balance tutorials, guides, and opinion pieces to keep your content fresh and engaging for different reader preferences.
                                            </p>
                                        </div>
                                    </li>

                                    <li className="flex gap-4">
                                        <div className="flex-shrink-0">
                                            <BarChart className={`h-6 w-6 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold mb-1">Track Performance</h3>
                                            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                                Monitor which content types and topics perform best with your audience, then generate more ideas in those areas.
                                            </p>
                                        </div>
                                    </li>

                                    <li className="flex gap-4">
                                        <div className="flex-shrink-0">
                                            <Clock className={`h-6 w-6 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold mb-1">Consistent Schedule</h3>
                                            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                                Use the generator to plan content weeks in advance, maintaining a consistent publishing schedule your readers can rely on.
                                            </p>
                                        </div>
                                    </li>
                                </ul>

                                <div className="mt-8 text-center">
                                    <Link href="/tools/content-calendar">
                                        <span className={`inline-block px-6 py-2 rounded-full ${isDarkMode ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-100 hover:bg-blue-200 text-blue-800'} transition-colors font-medium`}>
                                            Create Your Content Calendar →
                                        </span>
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Related Tools Section */}
            {/* <section className={`py-16 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
                <div className="container mx-auto px-6">
                    <h2 className="text-2xl font-bold mb-8 text-center">More Content Creation Tools</h2>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <Link href="/tools/reading-time">
                            <Card className={`h-full border-0 ${isDarkMode ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white hover:bg-gray-100'} transition-all cursor-pointer`}>
                                <CardContent className="p-6 flex flex-col h-full">
                                    <h3 className="text-lg font-semibold mb-2">Reading Time Calculator</h3>
                                    <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-auto`}>
                                        Estimate how long it will take readers to consume your content.
                                    </p>
                                    <span className={`text-sm mt-4 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>Try it →</span>
                                </CardContent>
                            </Card>
                        </Link>

                        <Link href="/tools/headline-analyzer">
                            <Card className={`h-full border-0 ${isDarkMode ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white hover:bg-gray-100'} transition-all cursor-pointer`}>
                                <CardContent className="p-6 flex flex-col h-full">
                                    <h3 className="text-lg font-semibold mb-2">Headline Analyzer</h3>
                                    <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-auto`}>
                                        Score and improve your blog post titles for better engagement.
                                    </p>
                                    <span className={`text-sm mt-4 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>Try it →</span>
                                </CardContent>
                            </Card>
                        </Link>

                        <Link href="/tools/seo-optimizer">
                            <Card className={`h-full border-0 ${isDarkMode ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white hover:bg-gray-100'} transition-all cursor-pointer`}>
                                <CardContent className="p-6 flex flex-col h-full">
                                    <h3 className="text-lg font-semibold mb-2">SEO Content Optimizer</h3>
                                    <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-auto`}>
                                        Analyze and improve your content for better search rankings.
                                    </p>
                                    <span className={`text-sm mt-4 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>Try it →</span>
                                </CardContent>
                            </Card>
                        </Link>

                        <Link href="/tools/content-templates">
                            <Card className={`h-full border-0 ${isDarkMode ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white hover:bg-gray-100'} transition-all cursor-pointer`}>
                                <CardContent className="p-6 flex flex-col h-full">
                                    <h3 className="text-lg font-semibold mb-2">Content Templates</h3>
                                    <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-auto`}>
                                        Ready-to-use templates for various content formats.
                                    </p>
                                    <span className={`text-sm mt-4 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>Try it →</span>
                                </CardContent>
                            </Card>
                        </Link>
                    </div>
                </div>
            </section> */}
        </main>
    );
};

export default BlogIdeaGeneratorPage;