
// SettingsTab.tsx
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SettingsSection } from './SettingsSection';
import { useRouter } from 'next/navigation';
import Link from 'next/link';


interface SettingsTabProps {
    changePassword: (oldPassword: string, newPassword: string) => Promise<any>;
    manageLinkedAccounts: () => void;
    updateThemeSettings: (theme: { darkMode: boolean }) => void;
}

export const SettingsTab = ({
    changePassword,
    manageLinkedAccounts,
    updateThemeSettings,
}: SettingsTabProps) => {
    const router = useRouter();
    return (
        <Card>
            <CardHeader>
                <CardTitle>Account Settings</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    <SettingsSection
                        title="Change Password"
                        description="Update your account password"
                        action={changePassword}
                        buttonText="Change"
                    />
                    <SettingsSection
                        title="Linked Accounts"
                        description="Manage your linked social accounts"
                        action={manageLinkedAccounts}
                        buttonText="Manage"
                    />
                    <SettingsSection
                        title="Theme Settings"
                        description="Customize your app appearance"
                        action={updateThemeSettings}
                        buttonText="Customize"
                    />
                    <div className="pt-4">
                        <Link href="/signout">
                            <Button variant="destructive" className="w-full">
                                Log Out
                            </Button>
                        </Link>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
