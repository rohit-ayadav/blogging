
// SettingsSection.tsx
import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface SettingsSectionProps {
    title: string;
    description: string;
    // action: (arg?: any) => void;
    action: (...args: any[]) => void;
    buttonText: string;
}

export const SettingsSection = ({ title, description, action, buttonText, children }: React.PropsWithChildren<SettingsSectionProps>) => {
    return (
        <div className="flex items-center justify-between">
            <div>
                <h3 className="font-medium">{title}</h3>
                <p className="text-sm text-gray-500">{description}</p>
            </div>
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="outline">{buttonText}</Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{title}</DialogTitle>
                    </DialogHeader>
                    {children}
                </DialogContent>
            </Dialog>
        </div>
    );
};