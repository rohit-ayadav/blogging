"use client";
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { Card, CardContent, CardTitle } from '@/components/ui/card';

import { Grid3X3, Briefcase, Code2, Brain, Database, Lightbulb, FileSpreadsheet, FileQuestion, Newspaper, Backpack } from 'lucide-react';

const CategoryBrowser = () => {
    const { isDarkMode } = useTheme();
    const router = useRouter();

    // Add icons to categories
    const CATEGORIES_WITH_ICONS = [
        { value: "DSA", label: "DSA", icon: <Database size={24} /> },
        { value: "Job Posting", label: "Job Posting", icon: <Briefcase size={24} /> },
        { value: "WebDev", label: "Web Development", icon: <Code2 size={24} /> },
        { value: "AI", label: "Artificial Intelligence", icon: <Brain size={24} /> },
        { value: "ML", label: "Machine Learning", icon: <Grid3X3 size={24} /> },
        { value: "Skill Development", label: "Skill Development", icon: <Lightbulb size={24} /> },
        { value: "Resume and Cover Letter Guidance", label: "Resume & Cover Letter", icon: <FileSpreadsheet size={24} /> },
        { value: "Interview Preparation", label: "Interview Prep", icon: <FileQuestion size={24} /> },
        { value: "Tech-news", label: "Tech News", icon: <Newspaper size={24} /> },
        { value: "Internship", label: "Internship", icon: <Backpack size={24} /> }
    ];

    const handleCategoryClick = (category: string) => {
        router.push(`/blogs?category=${category}`);
    };

    return (
        <section className={`py-16 ${isDarkMode ? 'bg-gray-800/50' : 'bg-gray-100'}`}>
            <div className="container mx-auto px-6">
                <h2 className="text-3xl font-bold mb-8 text-center">Explore by Category</h2>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {CATEGORIES_WITH_ICONS.map((category, index) => (
                        <motion.div
                            key={category.value}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            onClick={() => handleCategoryClick(category.value)}
                            className="cursor-pointer"
                        >
                            <Card className={`h-full transition-all duration-300 overflow-hidden
                ${isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-blue-50'}`}
                            >
                                <div className={`h-1 w-full bg-gradient-to-r from-blue-500 to-indigo-600`}></div>
                                <CardContent className="flex flex-col items-center justify-center py-6">
                                    <div className="text-blue-600 mb-4">
                                        {category.icon}
                                    </div>
                                    <CardTitle className="text-center text-sm sm:text-base">
                                        {category.label}
                                    </CardTitle>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CategoryBrowser;