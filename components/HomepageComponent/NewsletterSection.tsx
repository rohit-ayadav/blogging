import { useState } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PenTool } from 'react-feather';
import { motion } from 'framer-motion';

export const NewsletterSection = () => {
    const { isDarkMode } = useTheme();
    const [email, setEmail] = useState('');
    const [isSubscribing, setIsSubscribing] = useState(false);

    const handleSubscribe = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubscribing(true);

        // Simulate API call
        setTimeout(() => {
            setIsSubscribing(false);
            setEmail('');
            // Add toast notification here
        }, 1500);
    };

    return (
        <section className={`py-16 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
            <div className="container mx-auto px-6 max-w-4xl">
                <Card className={`overflow-hidden border-0 ${isDarkMode ? 'bg-gray-800' : 'bg-blue-50'}`}>
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-indigo-600/20" />
                        <CardContent className="relative py-12 flex flex-col items-center text-center">
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 0.5 }}
                            >
                                <div className="mb-6 p-4 rounded-full bg-blue-100 inline-block">
                                    <PenTool size={32} className="text-blue-600" />
                                </div>
                                <h3 className="text-3xl font-bold mb-4">Stay in the Loop</h3>
                                <p className="mb-8 max-w-lg mx-auto text-gray-600 dark:text-gray-300">
                                    Subscribe to our weekly newsletter and get the latest tech articles,
                                    job opportunities, and coding tips delivered straight to your inbox.
                                </p>

                                <form onSubmit={handleSubscribe} className="w-full max-w-md mx-auto">
                                    <div className="flex gap-2 flex-col sm:flex-row">
                                        <Input
                                            type="email"
                                            placeholder="Enter your email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            className={`flex-grow ${isDarkMode ? 'bg-gray-700' : 'bg-white'}`}
                                        />
                                        <Button
                                            type="submit"
                                            disabled={isSubscribing}
                                            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                                        >
                                            {isSubscribing ? (
                                                <span className="flex items-center">Subscribing...</span>
                                            ) : (
                                                <span>Subscribe</span>
                                            )}
                                        </Button>
                                    </div>
                                </form>
                            </motion.div>
                        </CardContent>
                    </div>
                </Card>
            </div>
        </section>
    );
};