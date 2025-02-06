
// ProfileInfoTab.tsx
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

interface ProfileInfoTabProps {
    editMode: boolean;
    editData: any;
    handleEditChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    handleSaveProfile: () => void;
    setEditMode: (editMode: boolean) => void;
}

export const ProfileInfoTab = ({ editMode, editData, handleEditChange, handleSaveProfile, setEditMode }: ProfileInfoTabProps) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div>
                        <label className="text-sm font-medium">Full Name</label>
                        <Input name="name" value={editData?.name ?? ''} readOnly={!editMode} onChange={handleEditChange} />
                    </div>
                    <div>
                        <label className="text-sm font-medium">Username</label>
                        <Input name="username" value={editData?.username ?? editData?.email} readOnly={!editMode} onChange={handleEditChange} />
                    </div>
                    <div>
                        <label className="text-sm font-medium">Email</label>
                        <Input name="email" value={editData?.email ?? ''} readOnly={!editMode} onChange={handleEditChange} />
                    </div>
                    <div>
                        <label className="text-sm font-medium">Bio</label>
                        <Textarea name="bio" value={editData?.bio ?? ''} readOnly={!editMode} onChange={handleEditChange} />
                    </div>
                </div>
                {editMode && (
                    <div className="mt-4 flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setEditMode(false)}>Cancel</Button>
                        <Button onClick={handleSaveProfile}>Save</Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
