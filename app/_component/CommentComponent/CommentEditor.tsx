import React from 'react';
import { Send } from 'lucide-react';
import { useThemeClass } from './DeleteConfirmation';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';

export const CommentEditor = ({
    content,
    setContent,
    onSubmit,
    onCancel,
    isSubmitting,
    isEditing,
    maxLength = 1000,
    textareaRef
}: {
    content: string,
    setContent: (value: string) => void,
    onSubmit: (e: React.FormEvent) => void,
    onCancel?: () => void,
    isSubmitting: boolean,
    isEditing: boolean,
    maxLength?: number,
    textareaRef: React.RefObject<HTMLTextAreaElement>
}) => {
    const getThemeClass = useThemeClass();

    return (
        <form onSubmit={onSubmit} className="space-y-4">
            <div className="relative">
                <Textarea
                    ref={textareaRef}
                    placeholder="Write your comment here..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className={`min-h-[120px] resize-none p-4 ${getThemeClass(
                        'bg-white text-gray-900 border-gray-300',
                        'bg-gray-800 text-gray-100 border-gray-700'
                    )}`}
                />
                <div className={`absolute bottom-2 right-2 text-xs ${content.length > maxLength
                    ? 'text-red-500'
                    : getThemeClass('text-gray-500', 'text-gray-400')
                    }`}>
                    {content.length}/{maxLength}
                </div>
            </div>

            <div className="flex gap-2">
                <Button
                    type="submit"
                    disabled={isSubmitting || !content.trim() || content.length > maxLength}
                    className={`${getThemeClass(
                        'bg-blue-600 hover:bg-blue-700',
                        'bg-blue-700 hover:bg-blue-800'
                    )} text-white flex items-center justify-center flex-1`}
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 size={16} className="mr-2 animate-spin" />
                            {isEditing ? 'Updating...' : 'Posting...'}
                        </>
                    ) : (
                        <>
                            <Send size={16} className="mr-2" />
                            {isEditing ? 'Update Comment' : 'Post Comment'}
                        </>
                    )}
                </Button>

                {onCancel && (
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onCancel}
                        className={`${getThemeClass(
                            'bg-white text-gray-700 border-gray-300 hover:bg-gray-100',
                            'bg-gray-700 text-gray-200 border-gray-600 hover:bg-gray-600'
                        )}`}
                    >
                        Cancel
                    </Button>
                )}
            </div>
        </form>
    );
};



