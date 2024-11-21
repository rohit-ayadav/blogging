import React, { ReactNode } from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '../ui/button';
import Link from 'next/link';


const Breadcrumb = ({ href, children }: { href: string; children: ReactNode }) => (
    <Link
        href={href}
        className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 
               dark:hover:text-white transition-colors"
    >
        {children}
    </Link>
);

const NavigationButton = ({
    onClick,
    label,
    icon: Icon
}: {
    onClick: () => void;
    label: string;
    icon: React.ElementType
}) => (
    <TooltipProvider>
        <Tooltip>
            <TooltipTrigger asChild>
                <Button
                    onClick={onClick}
                    variant="ghost"
                    size="icon"
                    className="flex-shrink-0 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
                    aria-label={label}
                >
                    <Icon className="h-5 w-5" />
                </Button>
            </TooltipTrigger>
            <TooltipContent>{label}</TooltipContent>
        </Tooltip>
    </TooltipProvider>
);


export { Breadcrumb, NavigationButton };