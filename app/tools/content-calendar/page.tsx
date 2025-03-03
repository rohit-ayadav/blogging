"use client";
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useTheme } from '@/context/ThemeContext';
import { Calendar, PlusCircle, Save, Download, Filter, Share2, Trash2 } from 'lucide-react';
import Link from 'next/link';

interface Event {
    id: number;
    title: string;
    date: string;
    type: 'blog' | 'email';
    status: 'planned' | 'in-progress';
}

const ContentCalendarPage = () => {
    const { isDarkMode } = useTheme();
    const [events, setEvents] = useState<Event[]>([
        { id: 1, title: 'How to Start a Successful Blog', date: '2025-02-05', type: 'blog', status: 'planned' },
        { id: 2, title: '10 SEO Tips for Content Creators', date: '2025-03-12', type: 'blog', status: 'in-progress' },
        { id: 3, title: 'Social Media Marketing Strategies', date: '2025-02-19', type: 'blog', status: 'planned' },
        { id: 4, title: 'Email Newsletter: March Update', date: '2025-03-08', type: 'email', status: 'planned' }
    ]);

    // Current month for display purposes
    const currentMonth = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });

    // Days in the current month for calendar view
    const getDaysInMonth = () => {
        const date = new Date();
        const year = date.getFullYear();
        const month = date.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const firstDayOfMonth = new Date(year, month, 1).getDay();

        return { daysInMonth, firstDayOfMonth };
    };

    const { daysInMonth, firstDayOfMonth } = getDaysInMonth();

    // Generate calendar days
    const generateCalendarDays = () => {
        const days = [];
        // Add empty cells for days before the 1st of the month
        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push(null);
        }
        // Add actual days
        for (let i = 1; i <= daysInMonth; i++) {
            days.push(i);
        }
        return days;
    };

    const calendarDays = generateCalendarDays();

    const getEventsForDay = (day: number | null): Event[] => {
        if (!day) return [];

        const date = new Date();
        const year = date.getFullYear();
        const month = date.getMonth();
        const formattedDate = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

        return events.filter(event => event.date === formattedDate);
    };

    return (
        <main className={`min-h-screen ${isDarkMode ? 'bg-gray-950 text-white' : 'bg-gray-50 text-gray-900'}`}>
            {/* Hero Section */}
            <header className={`py-16 ${isDarkMode ? 'bg-gradient-to-br from-purple-900/30 to-indigo-900/30' : 'bg-gradient-to-br from-purple-50 to-indigo-50'}`}>
                <div className="container mx-auto px-6 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Content Calendar</h1>
                    <p className={`text-xl max-w-2xl mx-auto ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        Plan, organize, and schedule your content for maximum impact and consistent publishing.
                    </p>
                </div>
            </header>

            {/* Calendar Section */}
            <section className="py-12">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Calendar Tools Sidebar */}
                        <div className="lg:w-1/4">
                            <Card className={`mb-6 ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white'}`}>
                                <CardContent className="p-6">
                                    <div className="flex justify-between items-center mb-6">
                                        <h2 className="text-xl font-bold">Tools</h2>
                                        <button className={`p-2 rounded-full ${isDarkMode ? 'bg-purple-900/20 text-purple-400 hover:bg-purple-900/30' : 'bg-purple-100 text-purple-700 hover:bg-purple-200'}`}>
                                            <PlusCircle size={20} />
                                        </button>
                                    </div>

                                    <ul className="space-y-3">
                                        <li>
                                            <button className={`w-full text-left py-2 px-4 rounded ${isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'} flex items-center gap-2`}>
                                                <PlusCircle size={16} />
                                                <span>Add Content</span>
                                            </button>
                                        </li>
                                        <li>
                                            <button className={`w-full text-left py-2 px-4 rounded ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'} flex items-center gap-2`}>
                                                <Filter size={16} />
                                                <span>Filter View</span>
                                            </button>
                                        </li>
                                        <li>
                                            <button className={`w-full text-left py-2 px-4 rounded ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'} flex items-center gap-2`}>
                                                <Save size={16} />
                                                <span>Save Calendar</span>
                                            </button>
                                        </li>
                                        <li>
                                            <button className={`w-full text-left py-2 px-4 rounded ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'} flex items-center gap-2`}>
                                                <Download size={16} />
                                                <span>Export Calendar</span>
                                            </button>
                                        </li>
                                        <li>
                                            <button className={`w-full text-left py-2 px-4 rounded ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'} flex items-center gap-2`}>
                                                <Share2 size={16} />
                                                <span>Share Calendar</span>
                                            </button>
                                        </li>
                                    </ul>

                                    <div className="mt-6">
                                        <h3 className="text-lg font-semibold mb-3">Content Types</h3>
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                                                <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Blog Post</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                                <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Social Media</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                                                <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Email Newsletter</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                                <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Video Content</span>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className={`${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white'}`}>
                                <CardContent className="p-6">
                                    <h2 className="text-xl font-bold mb-4">Upcoming Content</h2>
                                    <div className="space-y-4">
                                        {events.map(event => (
                                            <div key={event.id} className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                                                <div className="flex justify-between items-start">
                                                    <h3 className="font-medium">{event.title}</h3>
                                                    <button className={`text-gray-500 hover:${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                                <div className="mt-2 flex items-center text-sm">
                                                    <Calendar size={14} className="mr-1" />
                                                    <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{event.date}</span>
                                                </div>
                                                <div className="mt-2 flex gap-2">
                                                    <span className={`text-xs px-2 py-1 rounded-full ${event.type === 'blog'
                                                        ? isDarkMode ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-800'
                                                        : isDarkMode ? 'bg-purple-900/30 text-purple-400' : 'bg-purple-100 text-purple-800'
                                                        }`}>
                                                        {event.type === 'blog' ? 'Blog Post' : 'Email'}
                                                    </span>
                                                    <span className={`text-xs px-2 py-1 rounded-full ${event.status === 'planned'
                                                        ? isDarkMode ? 'bg-yellow-900/30 text-yellow-400' : 'bg-yellow-100 text-yellow-800'
                                                        : isDarkMode ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-800'
                                                        }`}>
                                                        {event.status === 'planned' ? 'Planned' : 'In Progress'}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Main Calendar */}
                        <div className="lg:w-3/4">
                            <Card className={`${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white'}`}>
                                <CardContent className="p-6">
                                    <div className="flex justify-between items-center mb-6">
                                        <h2 className="text-2xl font-bold">{currentMonth}</h2>
                                        <div className="flex gap-2">
                                            <button className={`p-2 rounded ${isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'}`}>
                                                Month
                                            </button>
                                            <button className={`p-2 rounded ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}>
                                                Week
                                            </button>
                                            <button className={`p-2 rounded ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}>
                                                List
                                            </button>
                                        </div>
                                    </div>

                                    {/* Calendar Grid */}
                                    <div>
                                        {/* Days of Week */}
                                        <div className="grid grid-cols-7 mb-2">
                                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
                                                <div key={index} className="text-center font-medium p-2">
                                                    {day}
                                                </div>
                                            ))}
                                        </div>

                                        {/* Calendar Dates */}
                                        <div className="grid grid-cols-7 gap-2">
                                            {calendarDays.map((day, index) => (
                                                <div
                                                    key={index}
                                                    className={`min-h-24 p-2 rounded-lg ${day === null
                                                        ? ''
                                                        : isDarkMode
                                                            ? 'bg-gray-800 hover:bg-gray-750'
                                                            : 'bg-gray-100 hover:bg-gray-200'
                                                        }`}
                                                >
                                                    {day !== null && (
                                                        <>
                                                            <div className="font-medium">{day}</div>
                                                            <div className="mt-1 space-y-1">
                                                                {getEventsForDay(day).map(event => (
                                                                    <div
                                                                        key={event.id}
                                                                        className={`text-xs p-1 rounded truncate ${event.type === 'blog'
                                                                            ? isDarkMode ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-800'
                                                                            : isDarkMode ? 'bg-purple-900/30 text-purple-400' : 'bg-purple-100 text-purple-800'
                                                                            }`}
                                                                    >
                                                                        {event.title}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className={`py-16 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
                <div className="container mx-auto px-6">
                    <h2 className="text-3xl font-bold mb-12 text-center">Streamline Your Content Strategy</h2>

                    <div className="grid md:grid-cols-3 gap-8">
                        <Card className={`border-0 ${isDarkMode ? 'bg-gray-800 hover:bg-gray-750' : 'bg-gray-50 hover:bg-gray-100'} transition-all`}>
                            <CardContent className="p-6 flex flex-col items-center text-center">
                                <div className={`w-16 h-16 rounded-full mb-4 flex items-center justify-center ${isDarkMode ? 'bg-indigo-900/30' : 'bg-indigo-100'}`}>
                                    <Calendar className={`h-8 w-8 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
                                </div>
                                <h3 className="text-xl font-semibold mb-3">Visual Planning</h3>
                                <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                    See your entire content schedule at a glance and identify gaps or opportunities in your publishing plan.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className={`border-0 ${isDarkMode ? 'bg-gray-800 hover:bg-gray-750' : 'bg-gray-50 hover:bg-gray-100'} transition-all`}>
                            <CardContent className="p-6 flex flex-col items-center text-center">
                                <div className={`w-16 h-16 rounded-full mb-4 flex items-center justify-center ${isDarkMode ? 'bg-purple-900/30' : 'bg-purple-100'}`}>
                                    <Share2 className={`h-8 w-8 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                                </div>
                                <h3 className="text-xl font-semibold mb-3">Team Collaboration</h3>
                                <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                    Share your calendar with team members to coordinate content creation, editing, and publishing workflows.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className={`border-0 ${isDarkMode ? 'bg-gray-800 hover:bg-gray-750' : 'bg-gray-50 hover:bg-gray-100'} transition-all`}>
                            <CardContent className="p-6 flex flex-col items-center text-center">
                                <div className={`w-16 h-16 rounded-full mb-4 flex items-center justify-center ${isDarkMode ? 'bg-blue-900/30' : 'bg-blue-100'}`}>
                                    <Download className={`h-8 w-8 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                                </div>
                                <h3 className="text-xl font-semibold mb-3">Export & Integrate</h3>
                                <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                    Download your calendar or integrate with other tools to keep your content strategy aligned across platforms.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* How to Use Section */}
            <section className="py-16">
                <div className="container mx-auto px-6">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-3xl font-bold mb-6 text-center">How to Use Your Content Calendar</h2>
                        <p className={`text-center mb-12 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            Follow these steps to maximize your content planning effectiveness
                        </p>

                        <Card className={`border-0 ${isDarkMode ? 'bg-gradient-to-br from-gray-800 to-gray-900' : 'bg-gradient-to-br from-gray-50 to-gray-100'}`}>
                            <CardContent className="p-8">
                                <ol className="space-y-6 list-decimal pl-6">
                                    <li>
                                        <h3 className="text-lg font-semibold mb-1">Generate Content Ideas First</h3>
                                        <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                            Use our <Link href="/tools/blog-ideas" className={`${isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'} underline`}>Blog Idea Generator</Link> to create a bank of content ideas before planning your calendar.
                                        </p>
                                    </li>

                                    <li>
                                        <h3 className="text-lg font-semibold mb-1">Plan Content Types Strategically</h3>
                                        <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                            Distribute different content formats (blogs, videos, social posts, emails) throughout your calendar to maintain variety.
                                        </p>
                                    </li>

                                    <li>
                                        <h3 className="text-lg font-semibold mb-1">Consider Seasonality and Events</h3>
                                        <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                            Align content with upcoming holidays, industry events, and seasonal trends to maximize relevance.
                                        </p>
                                    </li>

                                    <li>
                                        <h3 className="text-lg font-semibold mb-1">Build Topic Clusters</h3>
                                        <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                            Group related content together over several weeks to build authority on specific subjects and improve SEO.
                                        </p>
                                    </li>

                                    <li>
                                        <h3 className="text-lg font-semibold mb-1">Set Realistic Deadlines</h3>
                                        <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                            Factor in time for content creation, editing, approval processes, and unexpected delays.
                                        </p>
                                    </li>
                                </ol>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Related Tools Section */}
            <section className={`py-16 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
                <div className="container mx-auto px-6">
                    <h2 className="text-2xl font-bold mb-8 text-center">Complete Your Content Toolkit</h2>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <Link href="/tools/blog-ideas">
                            <Card className={`h-full border-0 ${isDarkMode ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white hover:bg-gray-100'} transition-all cursor-pointer`}>
                                <CardContent className="p-6 flex flex-col h-full">
                                    <h3 className="text-lg font-semibold mb-2">Blog Idea Generator</h3>
                                    <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-auto`}>
                                        Generate fresh blog post ideas tailored to your niche and audience.
                                    </p>
                                    <span className={`text-sm mt-4 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>Try it →</span>
                                </CardContent>
                            </Card>
                        </Link>

                        {/* <Link href="/tools/headline-analyzer"> */}
                            <Card className={`h-full border-0 ${isDarkMode ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white hover:bg-gray-100'} transition-all cursor-pointer`}>
                                <CardContent className="p-6 flex flex-col h-full">
                                    <h3 className="text-lg font-semibold mb-2">Headline Analyzer</h3>
                                    <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-auto`}>
                                        Score and improve your blog post titles for better engagement.
                                    </p>
                                    <span className={`text-sm mt-4 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>Try it →</span>
                                </CardContent>
                            </Card>
                        {/* </Link> */}

                        {/* <Link href="/tools/seo-optimizer"> */}
                            <Card className={`h-full border-0 ${isDarkMode ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white hover:bg-gray-100'} transition-all cursor-pointer`}>
                                <CardContent className="p-6 flex flex-col h-full">
                                    <h3 className="text-lg font-semibold mb-2">SEO Content Optimizer</h3>
                                    <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-auto`}>
                                        Analyze and improve your content for better search rankings.
                                    </p>
                                    <span className={`text-sm mt-4 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>Try it →</span>
                                </CardContent>
                            </Card>
                        {/* </Link> */}

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
                    </div>
                </div>
            </section>
        </main>
    );
};

export default ContentCalendarPage;