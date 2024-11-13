// ActionButtons.tsx
import { Save } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ActionButtonsProps {
    loading: boolean;
    handleSave: () => void;
    handleSubmit: (e: React.FormEvent) => void;
    isDarkMode?: boolean;
    mode?: 'create' | 'edit';
}

export const ActionButtons = ({ handleSave, handleSubmit, mode }: ActionButtonsProps) => {
    return (
        <div className="flex justify-between mt-20">
            <Button
                type="button"
                onClick={handleSave}
                className="flex items-center space-x-2 bg-yellow-500 text-white rounded cursor-pointer"
            >
                <Save size={16} />
                <span>Save Draft</span>
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
