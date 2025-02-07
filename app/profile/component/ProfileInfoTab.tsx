
// ProfileInfoTab.tsx
import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { ProfileFormData, UserType } from './types';
import { saveEdit } from '@/action/my-profile-action';
import toast from 'react-hot-toast';
import { title } from 'process';
import { useToast } from '@/hooks/use-toast';

const profileSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    username: z.string().min(3, 'Username must be at least 3 characters'),
    email: z.string().email('Invalid email address'),
    bio: z.string().max(500, 'Bio must be less than 500 characters'),
    website: z.string().url('Invalid URL').optional().or(z.literal('')),
    socialLinks: z.object({
        linkedin: z.string().url('Invalid LinkedIn URL').optional().or(z.literal('')),
        github: z.string().url('Invalid GitHub URL').optional().or(z.literal('')),
        twitter: z.string().url('Invalid Twitter URL').optional().or(z.literal('')),
    }).optional(),
});

interface ProfileInfoTabProps {
    userData: UserType;
    editMode: boolean;
    setEditMode: (editMode: boolean) => void;
}

export const ProfileInfoTab = ({ userData, editMode, setEditMode }: ProfileInfoTabProps) => {
    const toast = useToast();
    const form = useForm<ProfileFormData>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: userData?.name || '',
            username: userData?.username || '',
            email: userData?.email || '',
            bio: userData?.bio || '',
            website: userData?.website || '',
            socialLinks: userData?.socialLinks || {},
        },
    });

    const updateProfile = async () => {
        try {
            const data = form.getValues();
            const response = await saveEdit(data);
            if (response.error) {
                toast.toast({
                    title: 'Error',
                    description: response.error,
                    variant: 'destructive',
                })
                alert(response.error);
            }
            else {
                toast.toast({
                    title: 'Success',
                    description: 'Profile updated successfully',
                    variant: 'default',
                });
                alert(response.success);
                setEditMode(false);
            }
        } catch (error) {
            toast.toast({
                title: 'Error',
                description: (error as Error).message,
                variant: 'destructive',
            });
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(updateProfile)}>
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Full Name</FormLabel>
                                    <FormControl>
                                        <Input {...field} disabled={!editMode} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input {...field} disabled={!editMode} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input {...field} disabled={!editMode} type="email" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="bio"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Bio</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            {...field}
                                            disabled={!editMode}
                                            className="min-h-[100px]"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {editMode && (
                            <div className="flex justify-end space-x-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        form.reset();
                                        setEditMode(false);
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit">Save Changes</Button>
                            </div>
                        )}
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
};
