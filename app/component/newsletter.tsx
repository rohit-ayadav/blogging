import React, { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { useEffect } from "react";
import { useTheme } from "@/context/ThemeContext";

const Newsletter = () => {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isTouched, setIsTouched] = useState(false);
    const { toast } = useToast();
    const { isDarkMode } = useTheme();

    useEffect(() => {
        document.body.classList.toggle('dark', isDarkMode);
    }, [isDarkMode]);
    
    const validateEmail = (email: string) => {
        const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return re.test(email);
    };

    const isEmailValid = email.length === 0 || validateEmail(email);

    const handleSubscribe = async (event: React.FormEvent) => {
        event.preventDefault();
        setIsLoading(true);

        try {
            if (!validateEmail(email)) {
                throw new Error("Please enter a valid email address");
            }

            const response = await fetch("/api/subscribe", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email: email.toLowerCase().trim() }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to subscribe. Please try again later.");
            }

            toast({
                title: "Success!",
                description: "Successfully subscribed to newsletter! 🎉",
                duration: 5000,
            });

            setEmail("");
            setIsTouched(false);
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Error",
                description: error.message || "An error occurred",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Alert className="mb-8 relative overflow-hidden bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-800 border-blue-100 dark:border-gray-700 opacity-100">
            <Toaster />
            <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-blue-500 dark:text-blue-400" />
                <AlertTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Stay updated!
                </AlertTitle>
            </div>

            <AlertDescription>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                    Subscribe to our newsletter for the latest updates, articles, and resources.
                </p>

                <form onSubmit={handleSubscribe} className="mt-4 flex flex-col sm:flex-row gap-3">
                    <div className="flex-1">
                        <Input
                            type="email"
                            placeholder="your-email@example.com"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                setIsTouched(true);
                            }}
                            className={`w-full bg-white dark:bg-gray-900 
                                ${!isEmailValid && isTouched
                                    ? "border-red-300 focus:border-red-400 dark:border-red-500"
                                    : "border-gray-200 dark:border-gray-700"
                                }`}
                            aria-invalid={!isEmailValid && isTouched}
                            aria-describedby={!isEmailValid && isTouched ? "email-error" : undefined}
                            disabled={isLoading}
                        />
                        {!isEmailValid && isTouched && (
                            <p id="email-error" className="mt-1 text-sm text-red-500 dark:text-red-400">
                                Please enter a valid email address
                            </p>
                        )}
                    </div>

                    <Button
                        type="submit"
                        disabled={isLoading || !email || !isEmailValid}
                        className="min-w-[120px] bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Subscribing
                            </>
                        ) : (
                            "Subscribe"
                        )}
                    </Button>
                </form>
            </AlertDescription>

            {/* <div className="absolute inset-0 bg-grid-pattern opacity-10" /> */}
        </Alert>
    );
};

export default Newsletter;