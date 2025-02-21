"use client";
import React, { useState } from 'react';
import { LogOut, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/context/ThemeContext';
import { signOut } from 'next-auth/react';

const SignOutPage = () => {
    const { isDarkMode } = useTheme();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleSignOut = async () => {
        setIsLoading(true);

        try {
            await signOut();
            router.push('/blogs');
        } catch (error) {
            console.error('Error signing out:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        router.back();
    };

    return (
        <div className={`${isDarkMode ? 'dark' : ''}`
        }>
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4" >
                <Card className="w-full max-w-md border-0 shadow-lg" >
                    <CardHeader className="text-center" >
                        <div className="mx-auto mb-4 p-3 bg-red-100 dark:bg-red-900/30 rounded-full" >
                            <LogOut className="h-8 w-8 text-red-600 dark:text-red-400" />
                        </div>
                        < CardTitle className="text-2xl font-bold" > Sign Out </CardTitle>
                        < CardDescription className="text-gray-600 dark:text-gray-400 mt-2" >
                            Are you sure you want to sign out of your account ?
                        </CardDescription>
                    </CardHeader>

                    < CardContent >
                        <div className="flex items-start p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg" >
                            <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5 mr-3 flex-shrink-0" />
                            <p className="text-sm text-amber-800 dark:text-amber-300" >
                                You'll need to sign in again to access your account and personalized features.
                            </p>
                        </div>
                    </CardContent>

                    < CardFooter className="flex flex-col sm:flex-row gap-3 sm:gap-4" >
                        <Button
                            variant="outline"
                            onClick={handleCancel}
                            className="w-full sm:w-1/2 border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                            Cancel
                        </Button>
                        < Button
                            variant="destructive"
                            onClick={handleSignOut}
                            disabled={isLoading}
                            className="w-full sm:w-1/2"
                        >
                            {
                                isLoading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" >
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" > </circle>
                                            < path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" > </path>
                                        </svg>
                                        Signing out...
                                    </>
                                ) : (
                                    "Sign Out"
                                )}
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
};

export default SignOutPage;