// ActionButtons.tsx
import { Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

interface ActionButtonsProps {
    loading: boolean;
    handleSave?: () => void;
    handleSubmit: (e: React.FormEvent) => void;
    isDarkMode: boolean;
    mode: 'create' | 'edit';
}

export const ActionButtons = ({ handleSubmit, mode, isDarkMode, loading }: ActionButtonsProps) => {
    const router = useRouter();
    return (
        <div className="flex justify-between mt-20">
            <Button
                type="button"
                onClick={router.back}
                className="flex items-center space-x-2 bg-yellow-500 text-white rounded cursor-pointer"
            >
                <Save size={16} />
                <span>
                    {mode === 'create' ? 'Save as Draft' : 'Cancel'}
                </span>
            </Button>
            <button
                type="submit"
                className="px-4 py-2 bg-green-500 text-white rounded cursor-pointer"
                onClick={handleSubmit}
            >
                {mode === 'create' ? 'Create Blog' : 'Update Blog'}
            </button>
        </div>
    );
}
