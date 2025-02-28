"use client";
import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CountUp from 'react-countup';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
// import { SkeletonStatsCard } from './SkeletonStatsCard';
import { StatsCard } from './StatsCard';
import { Skeleton } from '@/components/ui/skeleton';
interface DashboardGridProps {
    totalBlogs: number;
    totalViews: number;
    totalLikes: number;
    totalUsers: number;
    loading: boolean;
    compact?: boolean;
}

const DashboardGrid: React.FC<DashboardGridProps> = ({
    totalBlogs,
    totalViews,
    totalLikes,
    totalUsers,
    loading,
    compact = false
}) => {
    const { isDarkMode } = useTheme();
    const [isMobile, setIsMobile] = React.useState(false);

    React.useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 640);
        };

        // Set initial value
        checkMobile();

        // Add event listener for window resize
        window.addEventListener('resize', checkMobile);

        // Clean up
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15
            }
        }
    };

    const statsData = [
        {
            title: "Total Posts",
            value: totalBlogs,
            icon: "📚",
            trend: { value: 12, label: 'vs last month' },
            color: "blue"
        },
        {
            title: "Total Views",
            value: totalViews,
            icon: "👀",
            trend: { value: 8, label: 'vs last month' },
            color: "green"
        },
        {
            title: "Total Likes",
            value: totalLikes,
            icon: "❤️",
            trend: { value: -5, label: 'vs last month' },
            color: "red"
        },
        {
            title: "Total Users",
            value: totalUsers,
            icon: "👥",
            trend: { value: 15, label: 'vs last month' },
            color: "purple"
        }
    ];

    if (loading) {
        return (
            <div className={`w-full py-2 ${compact ? 'px-1' : 'px-2 sm:px-4 md:px-6 lg:px-8 py-4'}`}>
                {isMobile ? (
                    <div className="h-24">
                        <SkeletonStatsCard />
                    </div>
                ) : (
                    <motion.div
                        className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6"
                        variants={containerVariants}
                        initial="hidden"
                        animate="show"
                    >
                        {Array(4).fill(null).map((_, index) => (
                            <SkeletonStatsCard key={index} />
                        ))}
                    </motion.div>
                )}
            </div>
        );
    }

    // Mobile carousel view
    if (isMobile) {
        return (
            <div className={`w-full ${compact ? 'py-2' : 'py-4'}`}>
                <Swiper
                    spaceBetween={10}
                    slidesPerView={1.2}
                    centeredSlides={false}
                    className="stats-swiper"
                >
                    {statsData.map((stat, index) => (
                        <SwiperSlide key={index} className="pb-2">
                            <StatsCard
                                title={stat.title}
                                value={stat.value}
                                icon={stat.icon}
                                trend={stat.trend}
                                isDarkMode={isDarkMode}
                                color={stat.color as 'blue' | 'green' | 'red' | 'purple'}
                                compact={compact}
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        );
    }

    // Desktop grid view
    return (
        <div className={`w-full ${compact ? 'px-1 py-2' : 'px-2 sm:px-4 md:px-6 lg:px-8 py-4'}`}>
            <motion.div
                className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6"
                variants={containerVariants}
                initial="hidden"
                animate="show"
            >
                {statsData.map((stat, index) => (
                    <StatsCard
                        key={index}
                        title={stat.title}
                        value={stat.value}
                        icon={stat.icon}
                        trend={stat.trend}
                        isDarkMode={isDarkMode}
                        color={stat.color as 'blue' | 'green' | 'red' | 'purple'}
                        compact={compact}
                    />
                ))}
            </motion.div>
        </div>
    );
};

export default DashboardGrid;

interface SkeletonStatsCardProps {
    compact?: boolean;
}

export const SkeletonStatsCard: React.FC<SkeletonStatsCardProps> = ({ compact = false }) => {
    const { isDarkMode } = useTheme();

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
          relative overflow-hidden h-full
          ${isDarkMode
                        ? 'bg-gray-800/95 border-gray-700'
                        : 'bg-white border-gray-200'
                    }
          ${compact ? 'p-2' : ''}
        `}
            >
                <CardHeader className={`pb-1 space-y-0 ${compact ? 'p-2' : ''}`}>
                    <div className="flex items-center justify-between">
                        <Skeleton
                            className={`
                h-4 w-24
                ${compact ? 'h-3 w-16' : 'h-4 sm:h-5 w-24 sm:w-32'}
                ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}
              `}
                        />
                        <Skeleton
                            className={`
                rounded-lg
                ${compact ? 'h-6 w-6' : 'h-8 w-8 sm:h-10 sm:w-10'} 
                ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}
              `}
                        />
                    </div>
                </CardHeader>

                <CardContent className={`space-y-2 ${compact ? 'p-2 pt-0 space-y-1' : ''}`}>
                    <Skeleton
                        className={`
              ${compact ? 'h-6 w-16' : 'h-8 sm:h-10 w-24 sm:w-32'} 
              ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}
            `}
                    />
                    <div className="flex items-center space-x-1.5">
                        <Skeleton
                            className={`
                h-4 w-12 rounded-full
                ${compact ? 'h-3 w-10' : 'h-4 w-12'} 
                ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}
              `}
                        />
                        <Skeleton
                            className={`
                h-4 w-16
                ${compact ? 'h-3 w-12' : 'h-4 w-16'} 
                ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}
              `}
                        />
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
};