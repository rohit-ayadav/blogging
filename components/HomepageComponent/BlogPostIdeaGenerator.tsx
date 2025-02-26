"use client";
import { useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const BlogIdeaGenerator = () => {
    const { isDarkMode } = useTheme();
    const [selectedCategory, setSelectedCategory] = useState("WebDev");
    const [format, setFormat] = useState("tutorial");
    const [generating, setGenerating] = useState(false);
    const [generatedIdeas, setGeneratedIdeas] = useState<string[]>([]);

    const categories = [
        { value: "WebDev", label: "Web Development" },
        { value: "DSA", label: "Data Structures & Algorithms" },
        { value: "AI", label: "Artificial Intelligence" },
        { value: "ML", label: "Machine Learning" },
        { value: "Job Posting", label: "Career Advice" }
    ];

    const formats = [
        { value: "tutorial", label: "Tutorial" },
        { value: "guide", label: "Comprehensive Guide" },
        { value: "list", label: "List Post" },
        { value: "opinion", label: "Opinion Piece" },
        { value: "showcase", label: "Project Showcase" }
    ];

    // Pre-defined ideas for demo purposes
    const ideasByCategory: Record<string, Record<string, string[]>> = {
        "WebDev": {
            "tutorial": [
                "How to Build a React Component Library from Scratch",
                "Creating a Responsive Dashboard with Tailwind CSS",
                "Implementing Authentication with Next.js and NextAuth",
                "Building a Real-time Chat Application with Socket.io"
            ],
            "guide": [
                "The Complete Guide to CSS Grid Layout in 2025",
                "Modern JavaScript: Everything You Need to Know",
                "Frontend Performance Optimization Techniques",
                "Mastering TypeScript: From Basics to Advanced"
            ],
            "list": [
                "10 Must-Have VS Code Extensions for Web Developers",
                "15 React Hooks You Should Be Using",
                "7 Ways to Improve Your Website's Accessibility",
                "Top 8 Frontend Frameworks to Consider in 2025"
            ],
            "opinion": [
                "Why I Switched from Angular to React (and Never Looked Back)",
                "Is Server-Side Rendering Still Relevant in 2025?",
                "The Future of CSS: Where Are We Heading?",
                "Why TypeScript Should Be Your Default Choice for New Projects"
            ],
            "showcase": [
                "How I Built a Portfolio Site That Got Me Hired",
                "Creating a Blog Platform: My Journey and Tech Stack",
                "Building a Weather App with React and OpenWeather API",
                "Developing an E-commerce Site with Next.js and Stripe"
            ]
        },
        "AI": {
            "tutorial": [
                "Building a Sentiment Analysis Tool with Hugging Face",
                "Creating a Custom ChatGPT Plugin from Scratch",
                "Implementing Image Recognition with TensorFlow.js",
                "How to Fine-tune an LLM for Your Specific Use Case"
            ],
            "guide": [
                "The Complete Guide to Prompt Engineering",
                "Understanding Large Language Models: Architecture and Capabilities",
                "AI Ethics: Building Responsible AI Applications",
                "From Data to Insights: The AI Development Process"
            ],
            "list": [
                "7 Open Source AI Tools Every Developer Should Know",
                "10 Practical Applications of AI in Web Development",
                "5 AI APIs That Will Supercharge Your Next Project",
                "8 Common Pitfalls When Implementing AI (And How to Avoid Them)"
            ],
            "opinion": [
                "Will AI Replace Programmers? My Perspective",
                "The Real Limitations of Current AI Systems",
                "Why Every Developer Should Understand AI Fundamentals",
                "The Impact of AI on the Future of Web Development"
            ],
            "showcase": [
                "How I Built an AI Writing Assistant for Technical Documentation",
                "Creating a Voice-Controlled Smart Home Dashboard",
                "Building a Recommendation Engine for My Blog",
                "Developing a Code Review Assistant with GPT"
            ]
        }
    };

    // Add placeholder data for other categories
    ["DSA", "ML", "Job Posting"].forEach(category => {
        ideasByCategory[category] = {
            "tutorial": [
                `Building a ${category} Tutorial Example 1`,
                `Building a ${category} Tutorial Example 2`,
                `Building a ${category} Tutorial Example 3`,
                `Building a ${category} Tutorial Example 4`
            ],
            "guide": [
                `Comprehensive ${category} Guide Example 1`,
                `Comprehensive ${category} Guide Example 2`,
                `Comprehensive ${category} Guide Example 3`,
                `Comprehensive ${category} Guide Example 4`
            ],
            "list": [
                `Top 10 ${category} List Example 1`,
                `Top 10 ${category} List Example 2`,
                `Top 10 ${category} List Example 3`,
                `Top 10 ${category} List Example 4`
            ],
            "opinion": [
                `Opinion on ${category} Example 1`,
                `Opinion on ${category} Example 2`,
                `Opinion on ${category} Example 3`,
                `Opinion on ${category} Example 4`
            ],
            "showcase": [
                `${category} Project Showcase Example 1`,
                `${category} Project Showcase Example 2`,
                `${category} Project Showcase Example 3`,
                `${category} Project Showcase Example 4`
            ]
        };
    });

    const generateIdeas = () => {
        setGenerating(true);

        // Simulate API call delay
        setTimeout(() => {
            const ideas = ideasByCategory[selectedCategory]?.[format] || [];
            // Shuffle ideas to make it feel dynamic
            const shuffled = [...ideas].sort(() => 0.5 - Math.random());
            setGeneratedIdeas(shuffled.slice(0, 4));
            setGenerating(false);
        }, 1500);
    };

    return (
        <section className={`py-16 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
            <div className="container mx-auto px-6">
                <div className="max-w-4xl mx-auto">
                    <Card className={`overflow-hidden border-0 ${isDarkMode ? 'bg-gradient-to-br from-blue-900/20 to-purple-900/20' : 'bg-gradient-to-br from-blue-50 to-purple-50'
                        }`}>
                        <CardContent className="p-8">
                            <h2 className="text-3xl font-bold mb-6 text-center">Need Blog Ideas?</h2>
                            <p className="text-center mb-8 text-gray-600 dark:text-gray-300">
                                Generate relevant blog post ideas based on your interests and preferred content format
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        I want to write about:
                                    </label>
                                    <select
                                        value={selectedCategory}
                                        onChange={(e) => setSelectedCategory(e.target.value)}
                                        className={`w-full p-3 rounded-lg border ${isDarkMode
                                            ? 'bg-gray-800 border-gray-700'
                                            : 'bg-white border-gray-300'
                                            }`}
                                    >
                                        {categories.map((cat) => (
                                            <option key={cat.value} value={cat.value}>{cat.label}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Content format:
                                    </label>
                                    <select
                                        value={format}
                                        onChange={(e) => setFormat(e.target.value)}
                                        className={`w-full p-3 rounded-lg border ${isDarkMode
                                            ? 'bg-gray-800 border-gray-700'
                                            : 'bg-white border-gray-300'
                                            }`}
                                    >
                                        {formats.map((fmt) => (
                                            <option key={fmt.value} value={fmt.value}>{fmt.label}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="text-center mb-8">
                                <Button
                                    onClick={generateIdeas}
                                    disabled={generating}
                                    size="lg"
                                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                                >
                                    {generating ? (
                                        <span className="flex items-center">
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Generating Ideas...
                                        </span>
                                    ) : (
                                        <span>Generate Ideas</span>
                                    )}
                                </Button>
                            </div>

                            {generatedIdeas.length > 0 && (
                                <div>
                                    <h3 className="text-xl font-semibold mb-4">Here are some ideas for you:</h3>
                                    <div className="space-y-3">
                                        {generatedIdeas.map((idea, index) => (
                                            <motion.div
                                                key={index}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.1 }}
                                            >
                                                <Card className={`${isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'
                                                    } transition-colors`}>
                                                    <CardContent className="p-4 flex justify-between items-center">
                                                        <p className="font-medium">{idea}</p>
                                                        <Link href={`/create?title=${encodeURIComponent(idea)}`}>
                                                            <Button size="sm" variant="outline">
                                                                Use This
                                                            </Button>
                                                        </Link>
                                                    </CardContent>
                                                </Card>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    );
};

export default BlogIdeaGenerator;