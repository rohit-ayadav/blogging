// ReadingProgress

import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

export const ReadingProgress = () => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const calculateReadingProgress = () => {
            const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollTop = window.scrollY;
            const calculatedProgress = (scrollTop / scrollableHeight) * 100;

            setProgress(calculatedProgress);
        };

        window.addEventListener('scroll', calculateReadingProgress);

        return () => {
            window.removeEventListener('scroll', calculateReadingProgress);
        };
    }, []);

    return ReactDOM.createPortal(
        <div
            className="fixed top-0 left-0 w-full h-1 bg-blue-600 dark:bg-blue-400 z-50"
            style={{ width: `${progress}%` }}
        />,
        document.body
    );
};

export default ReadingProgress;
