import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useTheme } from "@/context/ThemeContext";
import { MessageCircle } from "lucide-react";
import Link from "next/link";

export const SignInBanner = () => {
    const useThemeClass = () => {
        const { isDarkMode } = useTheme();
        return (lightClass: string, darkClass: string) => isDarkMode ? darkClass : lightClass;
    };
    const getThemeClass = useThemeClass();

    return (
        <Card className={`mb-8 border ${getThemeClass('bg-white border-gray-200', 'bg-gray-800 border-gray-700')}`}>
            <CardContent className="pt-6 flex flex-col items-center p-8">
                <MessageCircle size={36} className={`mb-4 ${getThemeClass('text-blue-500', 'text-blue-400')}`} />
                <h3 className={`text-xl font-semibold mb-2 ${getThemeClass('text-gray-800', 'text-gray-200')}`}>
                    Join the conversation
                </h3>
                <p className={`text-center mb-6 ${getThemeClass('text-gray-600', 'text-gray-400')}`}>
                    Sign in to share your thoughts and connect with other readers
                </p>
                <Link href="/login" className="inline-block">
                    <Button className={`${getThemeClass(
                        'bg-blue-600 hover:bg-blue-700',
                        'bg-blue-700 hover:bg-blue-800'
                    )} text-white px-8`}>
                        Sign in to Comment
                    </Button>
                </Link>
            </CardContent>
        </Card>
    );
};
