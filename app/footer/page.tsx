"use client";
import { Button } from "@/components/ui/button";

export default function Footer() {
    return (
        <footer className="bg-gray-800 text-white py-8">
            <div className="container mx-auto px-6 text-center lg:flex lg:justify-between lg:items-center">

                <div className="mt-4 space-x-4 lg:mt-0">
                    <Button variant="link" className="text-white" onClick={() => window.location.href = '/tos'}
                    >Terms of Service</Button>
                    <Button variant="link" className="text-white" onClick={() => window.location.href = '/privacy'}
                    >Privacy Policy</Button>
                    <Button variant="link" className="text-white" onClick={() => window.location.href = '/contacts'}
                    >Contact Us</Button>
                </div>
                <p>&copy; 2024 DevBlogger. All rights reserved.</p>
            </div>
        </footer>
    );
};