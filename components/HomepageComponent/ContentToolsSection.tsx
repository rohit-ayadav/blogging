import React from 'react';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Clock, Lightbulb, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';

const ContentToolsSection = () => {
    const { isDarkMode } = useTheme();

    const tools = [
        {
            icon: <BookOpen size={48} />,
            title: "Content Creation Guide",
            description: "Learn best practices for creating engaging technical content that resonates with developers.",
            action: "Read Guide",
            link: "/guides/content-creation"
        },
        {
            icon: <Clock size={48} />,
            title: "Reading Time Calculator",
            description: "Estimate how long it will take readers to consume your content and optimize for engagement.",
            action: "Calculate Time",
            link: "/tools/reading-time"
        },
        {
            icon: <Lightbulb size={48} />,
            title: "Need Blog Ideas?",
            description: "Discover trending topics and get AI-powered suggestions for your next technical blog post.",
            action: "Get Ideas",
            link: "/tools/blog-ideas"
        }
    ];

    return (
        <section className={`py-16 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
            <div className="container mx-auto px-6">
                <h2 className="text-3xl font-bold mb-12 text-center">Content Creation Tools</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {tools.map((tool, index) => (
                        <motion.div
                            key={index}
                            whileHover={{ y: -5 }}
                            transition={{ duration: 0.2 }}
                        >
                            <Card className={`h-full flex flex-col justify-between transition-all duration-300 
                ${isDarkMode ? 'bg-gray-800/50 hover:bg-gray-800' : 'bg-white hover:bg-gray-50'}`}>
                                <CardContent className="pt-6">
                                    <div className="text-blue-600 mb-4 flex justify-center">{tool.icon}</div>
                                    <CardTitle className="text-2xl font-semibold mb-2 text-center">{tool.title}</CardTitle>
                                    <p className="mb-4 text-center text-gray-600 dark:text-gray-300">{tool.description}</p>
                                </CardContent>
                                <CardContent className="pt-0">
                                    <Link href={tool.link}>
                                        <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                                            {tool.action} <ChevronRight className="ml-2 h-4 w-4" />
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ContentToolsSection;