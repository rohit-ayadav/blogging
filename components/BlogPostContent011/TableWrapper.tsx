import React, { useEffect, useRef, useState } from 'react';
import { ChevronRight } from 'lucide-react';

const TableWrapper = ({ children }: { children: React.ReactNode }) => {
    const [hasHorizontalScroll, setHasHorizontalScroll] = useState(false);
    const [scrollPosition, setScrollPosition] = useState(0);
    const tableRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const checkScroll = () => {
            if (tableRef.current) {
                const hasScroll = tableRef.current.scrollWidth > tableRef.current.clientWidth;
                setHasHorizontalScroll(hasScroll);
            }
        };

        // Check on mount and window resize
        checkScroll();
        window.addEventListener('resize', checkScroll);

        // Cleanup
        return () => window.removeEventListener('resize', checkScroll);
    }, []);

    // Handle scroll position for fade effect
    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const target = e.target as HTMLDivElement;
        const position = target.scrollLeft / (target.scrollWidth - target.clientWidth);
        setScrollPosition(position);
    };

    return (
        <div className="relative my-4 sm:my-6">
            {/* Gradient Indicators */}
            {hasHorizontalScroll && (
                <>
                    <div
                        className={`absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent dark:from-gray-900 pointer-events-none z-10 transition-opacity duration-200
                            ${scrollPosition <= 0 ? 'opacity-0' : 'opacity-100'}`}
                    />
                    <div
                        className={`absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent dark:from-gray-900 pointer-events-none z-10 transition-opacity duration-200
                            ${scrollPosition >= 0.99 ? 'opacity-0' : 'opacity-100'}`}
                    />
                </>
            )}

            {/* Table Container */}
            <div
                ref={tableRef}
                onScroll={handleScroll}
                className="overflow-x-auto border border-gray-200 dark:border-gray-700 
                    rounded-lg shadow-sm bg-white dark:bg-gray-800 
                    scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600
                    scrollbar-track-transparent"
                style={{
                    WebkitOverflowScrolling: 'touch',  // Smooth scrolling on iOS
                    scrollbarWidth: 'thin',  // Firefox
                    msOverflowStyle: 'none'  // IE/Edge
                }}
            >
                <div className="min-w-full">
                    {children}
                </div>
            </div>

            {/* Scroll Indicator */}
            {hasHorizontalScroll && (
                <div className="flex items-center justify-center gap-1 text-xs text-gray-500 dark:text-gray-400 mt-2 animate-fade-in">
                    <span className="italic">Scroll to see more</span>
                    <ChevronRight className="w-4 h-4 animate-pulse" />
                </div>
            )}
        </div>
    );
};

export default TableWrapper;