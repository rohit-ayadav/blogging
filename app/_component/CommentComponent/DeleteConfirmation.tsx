import { Button } from "@/components/ui/button";
import { useTheme } from "@/context/ThemeContext";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

// Delete confirmation component
export const DeleteConfirmation = ({
    isOpen,
    onClose,
    onConfirm,
    isDeleting
}: {
    isOpen: boolean,
    onClose: () => void,
    onConfirm: () => void,
    isDeleting: boolean
}) => {
    const getThemeClass = useThemeClass();

    if (!isOpen) return null;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
            onClick={onClose}
        >
            <div
                className={`${getThemeClass('bg-white', 'bg-gray-800')} rounded-lg p-6 max-w-md w-full shadow-lg`}
                onClick={e => e.stopPropagation()}
            >
                <h3 className={`text-lg font-semibold mb-2 ${getThemeClass('text-gray-900', 'text-gray-100')}`}>
                    Delete Comment
                </h3>
                <p className={`mb-4 ${getThemeClass('text-gray-600', 'text-gray-300')}`}>
                    Are you sure you want to delete this comment? This action cannot be undone.
                </p>
                <div className="flex justify-end gap-3">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        className={getThemeClass('text-gray-700 hover:bg-gray-100', 'bg-gray-700 text-gray-200 hover:bg-gray-600')}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={onConfirm}
                        className="bg-red-500 hover:bg-red-600 text-white"
                        disabled={isDeleting}
                    >
                        {isDeleting ? (
                            <>
                                <Loader2 size={16} className="mr-2 animate-spin" />
                                Deleting...
                            </>
                        ) : (
                            'Delete'
                        )}
                    </Button>
                </div>
            </div>
        </motion.div>
    );
};

export const useThemeClass = () => {
    const { isDarkMode } = useTheme();
    return (lightClass: string, darkClass: string) => isDarkMode ? darkClass : lightClass;
};