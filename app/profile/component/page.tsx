"use client";
import React, { useState, useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, BookOpen, Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/context/ThemeContext";
import { ProfileCard } from "./ProfileCard";
import { ProfileInfoTab } from "./ProfileInfoTab";
import { SettingsTab } from "./SettingsTab";
import { BlogPostType, UserType } from "@/types/blogs-types";
import { ErrorFallback } from "../id-omponent/ErrorFallback";
import toast from "react-hot-toast";

interface UserProfileProps {
    userData: UserType;
}

export default function UserProfile({ userData }: UserProfileProps) {
    const { toggleDarkMode } = useTheme();
    const { data: session } = useSession();
    const [error, setError] = useState<string | null>(null);
    const [editMode, setEditMode] = useState(false); const [activeTab, setActiveTab] = useState("profile");

    const changePassword = async (oldPassword: string, newPassword: string) => {
        if (!session?.user?.email) throw new Error('Login again to change password');
        if (!oldPassword || !newPassword) throw new Error('Please enter old and new password');

        const response = await fetch(`/api/user/password`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ oldPassword, newPassword }),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to change password');
        return data.message;
    };

    const manageLinkedAccounts = () => {
        toast.error('We are working on this feature. Please check back later.');
    };

    if (!userData) return <ErrorFallback error={new Error("User not found")} resetErrorBoundary={() => { window.location.reload() }} />;
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-1">
                    {userData && (
                        <ProfileCard
                            userData={userData as UserType}
                            setEditMode={setEditMode}
                        />
                    )}
                </div>
                <div className="md:col-span-2">
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                        <TabsList className="grid grid-cols-2 gap-4">
                            <TabsTrigger value="profile" className="flex items-center justify-center">
                                <User className="w-4 h-4 mr-2" /> Profile
                            </TabsTrigger>
                            <TabsTrigger value="settings" className="flex items-center justify-center">
                                <Settings className="w-4 h-4 mr-2" /> Settings
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="profile">
                            {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
                            <ProfileInfoTab
                                userData={userData as UserType}
                                editMode={editMode}
                                setEditMode={setEditMode}
                            />
                        </TabsContent>
                        <TabsContent value="settings">
                            <SettingsTab
                                changePassword={changePassword}
                                updateThemeSettings={toggleDarkMode}
                                manageLinkedAccounts={manageLinkedAccounts}
                            />
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    );
}