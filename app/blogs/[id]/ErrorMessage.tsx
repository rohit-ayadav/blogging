'use client';

import React from 'react';
import { AlertCircle, ChevronLeft, Home } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

interface ErrorMessageProps {
    message: string;
    title?: string;
    variant?: 'default' | 'destructive';
    className?: string;
    showNavigation?: boolean;
    customBackPath?: string;
    customHomePath?: string;
}

const ErrorMessage = ({
    message,
    title = 'Error',
    variant = 'destructive',
    className = '',
    showNavigation = true,
    customBackPath,
    customHomePath = '/'
}: ErrorMessageProps) => {
    const router = useRouter();

    return (
        <div className="min-h-[200px] flex flex-col items-center justify-center max-w-lg mx-auto p-4 space-y-6">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-2xl font-bold text-destructive">
                        {/* <AlertCircle className="h-6 w-6" />
                        {title} */}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Alert
                        variant={variant}
                        className={`w-full border-2 ${className}`}
                        role="alert"
                    >
                        <AlertCircle className="h-5 w-5" />
                        <AlertTitle className="text-lg font-semibold">
                            {title}
                        </AlertTitle>
                        <AlertDescription className="mt-2 text-sm">
                            {message}
                        </AlertDescription>
                    </Alert>
                </CardContent>
                {showNavigation && (
                    <CardFooter className="flex justify-between">
                        <Button variant="outline" onClick={() => router.back()}>
                            Go Back
                        </Button>
                        <Button asChild>
                            <Link href="/blogs">Return to Home</Link>
                        </Button>
                    </CardFooter>
                )}
            </Card>

        </div>
    );
};

export { ErrorMessage };