import React from 'react';
import CountUp from 'react-countup';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface StatsCardProps {
    title: string;
    value: number;
    icon: string;
    isDarkMode: boolean;
    color: 'blue' | 'green' | 'red' | 'purple';
    trend?: {
        value: number;
        label: string;
    };
}

export const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, trend, isDarkMode, color }) => {
    const colorClasses = {
        blue: isDarkMode ? 'text-blue-400 bg-blue-400/10' : 'text-blue-600 bg-blue-100',
        green: isDarkMode ? 'text-green-400 bg-green-400/10' : 'text-green-600 bg-green-100',
        red: isDarkMode ? 'text-red-400 bg-red-400/10' : 'text-red-600 bg-red-100',
        purple: isDarkMode ? 'text-purple-400 bg-purple-400/10' : 'text-purple-600 bg-purple-100'
    };

    return (
        <motion.div
            variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0 }
            }}
            className="h-full"
        >
            <Card
                className={`
                    relative overflow-hidden group h-full
                    ${isDarkMode
                        ? 'bg-gray-800/95 border-gray-700 text-white'
                        : 'bg-white border-gray-200 text-gray-900'
                    }
                    shadow hover:shadow-lg transition-all duration-300
                    transform hover:-translate-y-1
                `}
            >
                <div
                    className={`
                        absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300
                        bg-gradient-to-br ${colorClasses[color].replace('text-', 'from-')}/5
                    `}
                />

                <CardHeader className="pb-2 space-y-0">
                    <CardTitle className="flex items-center justify-between">
                        <span className={`text-sm sm:text-base font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                            {title}
                        </span>
                        <span className={`
                            p-1.5 sm:p-2 rounded-lg text-base sm:text-lg
                            ${colorClasses[color]}
                        `}>
                            {icon}
                        </span>
                    </CardTitle>
                </CardHeader>

                <CardContent className="space-y-2">
                    <p className={`
                        text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight
                        ${colorClasses[color].split(' ')[0]}
                    `}>
                        <CountUp
                            end={value}
                            duration={2}
                            separator=","
                            useEasing={true}
                        />
                    </p>

                    {trend && (
                        <div className="flex items-center text-xs sm:text-sm space-x-1.5">
                            <span className={`
                                flex items-center font-medium px-1.5 py-0.5 rounded-full
                                ${trend.value >= 0
                                    ? (isDarkMode ? 'text-green-400 bg-green-400/10' : 'text-green-600 bg-green-100')
                                    : (isDarkMode ? 'text-red-400 bg-red-400/10' : 'text-red-600 bg-red-100')
                                }
                            `}>
                                {trend.value >= 0 ? '↑' : '↓'} {Math.abs(trend.value)}%
                            </span>
                            <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                {trend.label}
                            </span>
                        </div>
                    )}
                </CardContent>
            </Card>
        </motion.div>
    );
};