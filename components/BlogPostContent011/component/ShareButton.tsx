// ShareButton

import { FaTwitter } from 'react-icons/fa';
import { FaLinkedin } from 'react-icons/fa';
import { FaFacebook } from 'react-icons/fa';
import { FaReddit } from 'react-icons/fa';
import { FaWhatsapp } from 'react-icons/fa';
import { FaTelegram } from 'react-icons/fa';
import { FaEnvelope } from 'react-icons/fa';
import { FaCopy } from 'react-icons/fa';
import { useState } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { title } from 'process';

export const ShareButton = ({ title, url }: { title: string, url: string }) => {
    const { isDarkMode } = useTheme();
    const [copied, setCopied] = useState(false);

    const shareOptions = [
        {
            icon: <FaTwitter />,
            label: 'Twitter',
            url: `https://twitter.com/intent/tweet?text=${title}&url=${url}`,
        },
        {
            icon: <FaLinkedin />,
            label: 'LinkedIn',
            url: `https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${title}`,
        },
        {
            icon: <FaFacebook />,
            label: 'Facebook',
            url: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
        },
        {
            icon: <FaReddit />,
            label: 'Reddit',
            url: `https://www.reddit.com/submit?url=${url}&title=${title}`,
        },
        {
            icon: <FaWhatsapp />,
            label: 'WhatsApp',
            url: `https://api.whatsapp.com/send?text=${title} ${url}`,
        },
        {
            icon: <FaTelegram />,
            label: 'Telegram',
            url: `https://t.me/share/url?url=${url}&text=${title}`,
        },
        {
            icon: <FaEnvelope />,
            label: 'Email',
            url: `mailto:?subject=${title}&body=${url}`,
        },
    ];

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
        } catch (err) {
            console.error('Failed to copy to clipboard', err);
        }
    };

    return (
        <div className="flex items-center space-x-4">
            {shareOptions.map((option, index) => (
                <a
                    key={index}
                    href={option.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                    aria-label={`Share on ${option.label}`}
                >
                    {option.icon}
                </a>
            ))}
            <button
                onClick={copyToClipboard}
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                aria-label="Copy link"
            >
                <FaCopy />
            </button>
            {copied && (
                <span className="text-sm text-gray-600 dark:text-gray-400">Copied!</span>
            )}
        </div>
    );
}
export default ShareButton;
