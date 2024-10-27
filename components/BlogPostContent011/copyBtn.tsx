import React, { useState, useEffect } from "react";
import { Check, Copy } from "lucide-react";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

interface CopyButtonProps {
    isDarkMode: boolean;
    code: string;
}

const CopyButton: React.FC<CopyButtonProps> = ({ isDarkMode, code }) => {
    const [isCopied, setIsCopied] = useState(false);

    useEffect(() => {
        let timeout: NodeJS.Timeout;
        if (isCopied) {
            timeout = setTimeout(() => setIsCopied(false), 3000);
        }
        return () => clearTimeout(timeout);
    }, [isCopied]);

    const handleCopy = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        try {
            await navigator.clipboard.writeText(code);
            setIsCopied(true);
            toast.success("Copied to clipboard!");
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    return (
        <button
            onClick={handleCopy}
            className={`
        absolute right-2 top-2
        flex items-center justify-center
        w-8 h-8 rounded-md
        transition-all duration-200
        ${isDarkMode
                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-600'
                }
        md:opacity-0 md:group-hover:opacity-100
      `}
            aria-label={isCopied ? "Copied" : "Copy code"}
        >
            {isCopied ? (
                <>
                    <Check className="h-4 w-4 text-green-500" />
                </>
            ) : (
                <Copy className="h-4 w-4" />
            )}
        </button>
    );
};

export default CopyButton;