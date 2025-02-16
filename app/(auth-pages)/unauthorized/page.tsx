"use client";
import Link from 'next/link'
import { useRouter } from 'next/navigation';
import { AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { useEffect, useState } from 'react';

export default function UnauthorizedPage() {
    const router = useRouter()
    const [isClient, setIsClient] = useState(false)
    useEffect(() => {
        setIsClient(true)
    }, [])
    if (!isClient) return null
    return (
        <div className="flex items-center justify-center min-h-[75vh] bg-background">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-2xl font-bold text-destructive">
                        <AlertCircle className="h-6 w-6" />
                        Unauthorized Access
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">
                        {/* {message || "Sorry, you don't have permission to access this page. If you believe this is an error, please contact the administrator."} */}
                        Sorry, you don't have permission to access this page. If you believe this is an error, please contact the administrator.
                    </p>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button variant="outline" onClick={() => router.back()}>
                        Go Back
                    </Button>
                    <Button asChild>
                        <Link href="/blogs">Return to Home</Link>
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}