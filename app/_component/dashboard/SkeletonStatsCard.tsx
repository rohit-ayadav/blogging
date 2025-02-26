import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useTheme } from '@/context/ThemeContext';

export const SkeletonStatsCard = () => {
    const { isDarkMode } = useTheme();

    return (
        <Card className={`
            h-full animate-pulse
            ${isDarkMode ? 'bg-gray-800/95' : 'bg-white'}
        `}>
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <div className={`h-4 sm:h-5 w-1/2 rounded ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`} />
                    <div className={`h-8 sm:h-9 w-8 sm:w-9 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`} />
                </div>
            </CardHeader>
            <CardContent className="space-y-3">
                <div className={`h-8 sm:h-10 w-2/3 rounded ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`} />
                <div className="flex items-center space-x-2">
                    <div className={`h-5 w-14 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`} />
                    <div className={`h-5 w-20 rounded ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`} />
                </div>
            </CardContent>
        </Card>
    );
};
