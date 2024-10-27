import React from "react";
import { Check, Copy } from "lucide-react";

interface CopyButtonProps {
    isDarkMode: boolean;
    code: string;
}

const CopyButton = ({ isDarkMode, code }: CopyButtonProps) => {
    const [isCopied, setIsCopied] = React.useState(false);

    const handleCopy = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        try {
            await navigator.clipboard.writeText(code);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    return (
        <button
            onClick={handleCopy}
            className={`
        group absolute right-4 top-4
        hidden md:opacity-0 md:group-hover:opacity-100
        sm:flex sm:items-center sm:gap-2
        rounded-md px-2 py-1 text-sm
        transition-all duration-200
        ${isDarkMode
                    ? 'hover:bg-gray-700 text-gray-300'
                    : 'hover:bg-gray-200 text-gray-600'}
      `}
            aria-label="Copy code"
        >
            {isCopied ? (
                <>
                    <Check className="h-4 w-4" />
                    <span className="sm:inline hidden">Copied!</span>
                </>
            ) : (
                <>
                    <Copy className="h-4 w-4" />
                    <span className="sm:inline hidden">Copy</span>
                </>
            )}
        </button>
    );
};

interface MobileCopyButtonProps {
    isDarkMode: boolean;
    code: string;
}

const MobileCopyButton = ({ isDarkMode, code }: MobileCopyButtonProps) => {
    const [isCopied, setIsCopied] = React.useState(false);

    const handleCopy = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        try {
            await navigator.clipboard.writeText(code);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    return (
        <button
            onClick={handleCopy}
            className={`
        md:hidden flex items-center gap-2
        absolute right-4 top-4
        rounded-md px-2 py-1 text-sm
        transition-all duration-200
        ${isDarkMode
                    ? 'bg-gray-700 text-gray-300'
                    : 'bg-gray-200 text-gray-600'}
      `}
            aria-label="Copy code"
        >
            {isCopied ? (
                <>
                    <Check className="h-4 w-4" />
                    <span>Copied!</span>
                </>
            ) : (
                <>
                    <Copy className="h-4 w-4" />
                    <span>Copy</span>
                </>
            )}
        </button>
    );
};

export { CopyButton, MobileCopyButton };