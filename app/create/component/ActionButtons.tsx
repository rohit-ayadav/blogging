import React from 'react';
import { Save, ArrowLeft, Send, Loader2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

interface ActionButtonsProps {
    loading: boolean;
    handleSave?: () => void;
    handleSubmit: (e: React.FormEvent) => void;
    isDarkMode: boolean;
    mode: 'create' | 'edit';
    clearDraft: () => void;
}

export const ActionButtons = ({
    handleSubmit,
    mode,
    isDarkMode,
    loading,
    clearDraft,
    handleSave
}: ActionButtonsProps) => {
    const router = useRouter();

    const handleDraftOrCancel = () => {
        if (mode === 'create') {
            handleSave?.();
        } else {
            if (window.confirm('Are you sure you want to cancel? Any unsaved changes will be lost.')) {
                clearDraft();
                router.back();
            }
        }
    };

    const handleClearDraft = () => {
        if (window.confirm('Are you sure you want to clear the draft? This action cannot be undone and will clear the form.')) {
            clearDraft();
        }
    };

    return (
        <div className="flex flex-col sm:flex-row justify-between gap-4 mt-8 sm:mt-20">
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <Button
                    type="button"
                    onClick={handleDraftOrCancel}
                    className={`flex items-center justify-center bg-yellow-500 hover:bg-yellow-600 text-white rounded ${loading ? 'opacity-50' : ''}`}
                    disabled={loading}
                >
                    {
                        mode === 'create' ? (
                            <Save className="w-4 h-4 mr-2" />
                        ) : (
                            <ArrowLeft className="w-4 h-4 mr-2" />
                        )
                    }

                    <span>
                        {mode === 'create' ? 'Save as Draft' : 'Cancel'}
                    </span>
                </Button>

                {mode === 'create' && (
                    <Button
                        type="button"
                        onClick={handleClearDraft}
                        className={`flex items-center justify-center bg-red-500 hover:bg-red-600 text-white rounded ${loading ? 'opacity-50' : ''}`}
                        disabled={loading}
                    >
                        <Trash2 className="w-4 h-4 mr-2" />
                        <span>Clear Draft</span>
                    </Button>
                )}
            </div>

            <Button
                type="submit"
                onClick={handleSubmit}
                className={`flex items-center justify-center bg-green-500 hover:bg-green-600 text-white rounded w-full sm:w-auto ${loading ? 'opacity-50' : ''}`}
                disabled={loading}
            >
                {loading ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                    <Send className="w-4 h-4 mr-2" />
                )}
                <span>
                    {mode === 'create' ? 'Create Blog' : 'Update Blog'}
                </span>
            </Button>
        </div>
    );
};

export default ActionButtons;