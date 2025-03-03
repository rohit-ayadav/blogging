"use client";
import React from 'react';
import ContentCreationGuide from '@/components/HomepageComponent/ContentCreationGuide';
import { Card, CardContent } from '@/components/ui/card';
import { useTheme } from '@/context/ThemeContext';
import { Lightbulb, PenTool, BarChart, Clock, BookOpen } from 'lucide-react';
import Link from 'next/link';

const ContentCreationGuidePage = () => {
    const { isDarkMode } = useTheme();

    return (
        <main className={`min-h-screen ${isDarkMode ? 'bg-gray-950 text-white' : 'bg-gray-50 text-gray-900'}`}>
            {/* Hero Section */}
            <header className={`py-16 ${isDarkMode ? 'bg-gradient-to-br from-blue-900/30 to-purple-900/30' : 'bg-gradient-to-br from-blue-50 to-purple-50'}`}>
                <div className="container mx-auto px-6 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Content Creation Guide</h1>
                    <p className={`text-xl max-w-2xl mx-auto ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        Learn how to create engaging, valuable content that resonates with the developer community.
                    </p>
                </div>
            </header>

            {/* Main Guide Component */}
            <ContentCreationGuide />

            {/* Benefits Section */}
            <section className={`py-16 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
                <div className="container mx-auto px-6">
                    <h2 className="text-3xl font-bold mb-12 text-center">Benefits of Great Content</h2>

                    <div className="grid md:grid-cols-3 gap-8">
                        <Card className={`border-0 ${isDarkMode ? 'bg-gray-800 hover:bg-gray-750' : 'bg-gray-50 hover:bg-gray-100'} transition-all`}>
                            <CardContent className="p-6 flex flex-col items-center text-center">
                                <div className={`w-16 h-16 rounded-full mb-4 flex items-center justify-center ${isDarkMode ? 'bg-blue-900/30' : 'bg-blue-100'}`}>
                                    <Lightbulb className={`h-8 w-8 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                                </div>
                                <h3 className="text-xl font-semibold mb-3">Establish Authority</h3>
                                <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                    Quality content positions you as an expert and thought leader in your technical field.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className={`border-0 ${isDarkMode ? 'bg-gray-800 hover:bg-gray-750' : 'bg-gray-50 hover:bg-gray-100'} transition-all`}>
                            <CardContent className="p-6 flex flex-col items-center text-center">
                                <div className={`w-16 h-16 rounded-full mb-4 flex items-center justify-center ${isDarkMode ? 'bg-purple-900/30' : 'bg-purple-100'}`}>
                                    <BarChart className={`h-8 w-8 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                                </div>
                                <h3 className="text-xl font-semibold mb-3">Build Your Audience</h3>
                                <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                    Engage with readers who share your interests and grow your professional network.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className={`border-0 ${isDarkMode ? 'bg-gray-800 hover:bg-gray-750' : 'bg-gray-50 hover:bg-gray-100'} transition-all`}>
                            <CardContent className="p-6 flex flex-col items-center text-center">
                                <div className={`w-16 h-16 rounded-full mb-4 flex items-center justify-center ${isDarkMode ? 'bg-indigo-900/30' : 'bg-indigo-100'}`}>
                                    <BookOpen className={`h-8 w-8 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
                                </div>
                                <h3 className="text-xl font-semibold mb-3">Improve Your Skills</h3>
                                <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                    Writing about technical topics deepens your own understanding and reinforces learning.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Content Strategy Tips */}
            <section className="py-16">
                <div className="container mx-auto px-6">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-3xl font-bold mb-6 text-center">Content Strategy Tips</h2>
                        <p className={`text-center mb-12 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            Maximize the impact of your content with these proven strategies
                        </p>

                        <Card className={`border-0 ${isDarkMode ? 'bg-gradient-to-br from-gray-800 to-gray-900' : 'bg-gradient-to-br from-gray-50 to-gray-100'}`}>
                            <CardContent className="p-8">
                                <ul className="space-y-6">
                                    <li className="flex gap-4">
                                        <div className="flex-shrink-0">
                                            <PenTool className={`h-6 w-6 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold mb-1">Develop Your Voice</h3>
                                            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                                Inject personality into your writing to make technical content more approachable and memorable.
                                            </p>
                                        </div>
                                    </li>

                                    <li className="flex gap-4">
                                        <div className="flex-shrink-0">
                                            <BarChart className={`h-6 w-6 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold mb-1">Analyze Performance</h3>
                                            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                                Use metrics to understand what resonates with your audience and refine your content strategy.
                                            </p>
                                        </div>
                                    </li>

                                    <li className="flex gap-4">
                                        <div className="flex-shrink-0">
                                            <Clock className={`h-6 w-6 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold mb-1">Consistency Matters</h3>
                                            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                                Establish a regular publishing schedule to keep your audience engaged and build momentum.
                                            </p>
                                        </div>
                                    </li>
                                </ul>

                                {/* <div className="mt-8 text-center">
                                    <Link href="/content-calendar">
                                        <span className={`inline-block px-6 py-2 rounded-full ${isDarkMode ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-100 hover:bg-blue-200 text-blue-800'} transition-colors font-medium`}>
                                            Plan Your Content Calendar →
                                        </span>
                                    </Link>
                                </div> */}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Related Tools Section */}
            {/* <section className={`py-16 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
                <div className="container mx-auto px-6">
                    <h2 className="text-2xl font-bold mb-8 text-center">Content Creation Tools</h2>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <Link href="/tools/blog-ideas">
                            <Card className={`h-full border-0 ${isDarkMode ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white hover:bg-gray-100'} transition-all cursor-pointer`}>
                                <CardContent className="p-6 flex flex-col h-full">
                                    <h3 className="text-lg font-semibold mb-2">Blog Idea Generator</h3>
                                    <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-auto`}>
                                        Never run out of topics with our AI-powered idea generator.
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

                        <Link href="/tools/code-snippet-formatter">
                            <Card className={`h-full border-0 ${isDarkMode ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white hover:bg-gray-100'} transition-all cursor-pointer`}>
                                <CardContent className="p-6 flex flex-col h-full">
                                    <h3 className="text-lg font-semibold mb-2">Code Snippet Formatter</h3>
                                    <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-auto`}>
                                        Create beautiful, syntax-highlighted code examples for your posts.
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

export default ContentCreationGuidePage;