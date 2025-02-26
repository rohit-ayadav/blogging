"use client";
import Link from "next/link";
import { Button } from "../ui/button";
import { CheckCircle2, CheckSquare, ChevronDown, Lightbulb, ListChecks, PenTool } from "lucide-react";
import { Card } from "../ui/card";
import { useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { motion } from "framer-motion";

const ContentCreationGuide = () => {
    const { isDarkMode } = useTheme();
    const [expandedStep, setExpandedStep] = useState<number | null>(null);

    const steps = [
        {
            title: "Choose Your Topic",
            description: "Select a topic you're passionate about and aligns with your expertise. Research what's trending in the tech community.",
            icon: <Lightbulb size={24} />,
            tips: [
                "Consider what unique perspective you can bring",
                "Use tools like Google Trends to verify interest",
                "Check what's popular on DevBlogger"
            ]
        },
        {
            title: "Structure Your Content",
            description: "Create a clear outline with introduction, main points, and conclusion. Break content into digestible sections.",
            icon: <ListChecks size={24} />,
            tips: [
                "Start with an attention-grabbing introduction",
                "Use headers to organize your thoughts",
                "Include a call-to-action at the end"
            ]
        },
        {
            title: "Write & Format",
            description: "Focus on clarity and value. Use our rich editor to enhance readability with formatting, code blocks, and images.",
            icon: <PenTool size={24} />,
            tips: [
                "Write in a conversational tone",
                "Use code examples when relevant",
                "Include diagrams or screenshots for complex concepts"
            ]
        },
        {
            title: "Review & Publish",
            description: "Proofread for accuracy and clarity. Add tags, select a category, and publish to share with the community.",
            icon: <CheckSquare size={24} />,
            tips: [
                "Have someone else review if possible",
                "Check code examples for correctness",
                "Use relevant tags to increase discoverability"
            ]
        }
    ];

    return (
        <section className={`py-16 ${isDarkMode ? 'bg-gray-800/50' : 'bg-gray-100'}`}>
            <div className="container mx-auto px-6">
                {/* <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold mb-4">Create Great Content</h2>
                    <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                        Follow these steps to create engaging, valuable content that resonates with the developer community
                    </p>
                </div> */}

                <div className="max-w-4xl mx-auto">
                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            layout
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="mb-4"
                        >
                            <Card
                                className={`overflow-hidden transition-all duration-300 
                  ${expandedStep === index
                                        ? (isDarkMode ? 'bg-blue-900/20' : 'bg-blue-50')
                                        : (isDarkMode ? 'bg-gray-800' : 'bg-white')}`}
                            >
                                <div
                                    className="p-6 flex items-center cursor-pointer"
                                    onClick={() => setExpandedStep(expandedStep === index ? null : index)}
                                >
                                    <div className={`flex-shrink-0 mr-4 w-10 h-10 rounded-full flex items-center justify-center
                    ${isDarkMode ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-600'}`}>
                                        {step.icon}
                                    </div>
                                    <div className="flex-grow">
                                        <h3 className="text-xl font-semibold">Step {index + 1}: {step.title}</h3>
                                        <p className="text-gray-600 dark:text-gray-300">{step.description}</p>
                                    </div>
                                    <div className="flex-shrink-0 ml-4">
                                        <ChevronDown
                                            className={`h-5 w-5 transition-transform ${expandedStep === index ? 'rotate-180' : 'rotate-0'
                                                }`}
                                        />
                                    </div>
                                </div>

                                {expandedStep === index && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <div className={`px-6 pb-6 pt-0 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'
                                            }`}>
                                            <h4 className="font-medium mb-2">Pro Tips:</h4>
                                            <ul className="space-y-2">
                                                {step.tips.map((tip, tipIndex) => (
                                                    <li key={tipIndex} className="flex items-start">
                                                        <CheckCircle2 className="h-4 w-4 text-green-500 mr-2 mt-1 flex-shrink-0" />
                                                        <span>{tip}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </motion.div>
                                )}
                            </Card>
                        </motion.div>
                    ))}

                    <div className="text-center mt-8">
                        <Link href="/create">
                            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                                Start Creating Now
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ContentCreationGuide;