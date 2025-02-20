import React, { useState, useEffect } from 'react';
import { AlertCircle, Loader2, Mail, Globe, Check, X, Github } from 'lucide-react';
import { saveEdit } from '@/action/my-profile-action';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { checkUsernameAvailability } from '@/action/checkUserNameAvailability';
import { UserType } from '@/types/blogs-types';
import { Facebook, Instagram, Linkedin, Twitter } from 'react-feather';
import { sendEmailVerification } from '@/action/email/sendEmailVerification';
import { Toaster } from '@/components/ui/toaster';
interface CustomInputProps {
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    disabled?: boolean;
    error?: string;
    type?: string;
    icon?: React.ReactNode;
    rightElement?: React.ReactNode;
}

const CustomInput = ({
    label,
    value,
    onChange,
    disabled = false,
    error = "",
    type = "text",
    icon = null,
    rightElement = null
}: CustomInputProps) => (
    <div className="mb-4">
        <label className="block text-sm font-medium mb-1">{label}</label>
        <div className="relative">
            {icon && (
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    {icon}
                </div>
            )}
            <input
                type={type}
                value={value}
                onChange={onChange}
                disabled={disabled}
                className={`
          w-full px-3 py-2 
          ${icon ? 'pl-10' : ''} 
          ${rightElement ? 'pr-24' : ''}
          rounded-lg border 
          ${error ? 'border-red-300' : 'border-gray-300'}
          focus:outline-none focus:ring-2 focus:ring-blue-500
          disabled:bg-gray-50 disabled:text-gray-500
          transition duration-150
        `}
            />
            {rightElement && (
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    {rightElement}
                </div>
            )}
        </div>
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
);

const SocialIcon = ({ platform }: { platform: string }) => {
    switch (platform) {
        case 'github':
            return <Github className="h-4 w-4" />;
        case 'linkedin':
            return <Linkedin className="h-4 w-4" />;
        case 'twitter':
            return <Twitter className="h-4 w-4" />;
        case 'facebook':
            return <Facebook className="h-4 w-4" />;
        case 'instagram':
            return <Instagram className="h-4 w-4" />;
        case 'website':
            return <Globe className="h-4 w-4" />;
        default:
            return null;
    }
};

interface ProfileInfoTabProps {
    userData: UserType;
    editMode: boolean;
    setEditMode: (mode: boolean) => void;
}

export const ProfileInfoTab = ({ userData, editMode, setEditMode }: ProfileInfoTabProps) => {
    const toast = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: userData?.name || '',
        username: userData?.username || '',
        email: userData?.email || '',
        bio: userData?.bio || '',
        website: userData?.website || '',
        socialLinks: {
            github: userData?.socialLinks?.github || '',
            linkedin: userData?.socialLinks?.linkedin || '',
            twitter: userData?.socialLinks?.twitter || ''
        }
    });
    const [errors, setErrors] = useState<{ name?: string; username?: string }>({});
    const [isCheckingUsername, setIsCheckingUsername] = useState(false);
    const [isUsernameAvailable, setIsUsernameAvailable] = useState(true);

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));

        if (field === 'username') {
            setIsCheckingUsername(true);
            checkUsernameAvailability(value)
                .then((available) => {
                    setIsUsernameAvailable(available);
                })
                .finally(() => {
                    setIsCheckingUsername(false);
                });
        }
    };

    const handleSocialChange = (platform: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            socialLinks: {
                ...prev.socialLinks,
                [platform]: value
            }
        }));
    };

    const handleSendVerificationEmail = async () => {
        try {
            const response = await sendEmailVerification(userData.email);
            if (response.success) {
                toast.toast({
                    title: "Success",
                    description: "Verification email sent successfully",
                });
                // alert("Verification email sent successfully");
            }
        } catch (error) {
            toast.toast({
                title: "Error",
                description: (error instanceof Error ? error.message : "An unexpected error occurred"),
                variant: "destructive",
            });
            // alert(error);
        }
    };

    const validateForm = () => {
        const newErrors: { name?: string; username?: string } = {};
        if (formData.name.length < 2) newErrors.name = 'Name must be at least 2 characters';
        if (formData.username.length < 3) newErrors.username = 'Username must be at least 3 characters';
        if (!isUsernameAvailable) newErrors.username = 'Username is not available';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsSubmitting(true);
        try {
            const response = await saveEdit(formData);
            if (!response.success) {
                toast.toast({
                    title: "Error",
                    description: response.message,
                    variant: "destructive",
                });
                // alert(response.message);
            } else {
                toast.toast({
                    title: "Success",
                    description: "Profile updated successfully",
                });
                setEditMode(false);
                // alert(response.message);
            }
        } catch (error) {
            toast.toast({
                title: "Error",
                description: (error instanceof Error ? error.message : "An unexpected error occurred"),
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Card className="w-full max-w-2xl mx-auto p-6">
            <Toaster />
            <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2">Profile Information</h2>
                {!userData.isEmailVerified && (
                    <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-6">
                        <div className="flex items-center">
                            <AlertCircle className="h-5 w-5 text-amber-400 mr-2" />
                            <p className="text-sm text-amber-700">
                                Please verify your email to make changes to your profile.
                                <button
                                    className="ml-2 text-amber-600 hover:text-amber-500 font-medium"
                                    onClick={() => handleSendVerificationEmail()}
                                >
                                    Resend verification email
                                </button>
                            </p>
                        </div>
                    </div>
                )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                    <CustomInput
                        label="Full Name"
                        value={formData.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        disabled={!editMode || isSubmitting}
                        error={errors.name}
                    />

                    <CustomInput
                        label="Username"
                        value={formData.username}
                        onChange={(e) => handleChange('username', e.target.value)}
                        disabled={!editMode || isSubmitting}
                        error={errors.username}
                        rightElement={
                            formData.username !== userData.username && formData.username !== '' && (
                                isCheckingUsername ? (
                                    <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                                ) : isUsernameAvailable ? (
                                    <Check className="h-4 w-4 text-green-500" />
                                ) : (
                                    <X className="h-4 w-4 text-red-500" />
                                )
                            )
                        }
                    />
                </div>

                <CustomInput
                    label="Email"
                    value={formData.email}
                    type="email"
                    onChange={() => { }}
                    disabled={true}
                    icon={<Mail className="h-4 w-4" />}
                    rightElement={
                        !userData.isEmailVerified && (
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => handleSendVerificationEmail()}
                                className="text-blue-600 hover:text-blue-500"
                            >
                                Verify
                            </Button>
                        )
                    }
                />

                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Bio</label>
                    <textarea
                        value={formData.bio}
                        onChange={(e) => handleChange('bio', e.target.value)}
                        disabled={!editMode || isSubmitting}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px] resize-y"
                    />
                </div>

                <div className="space-y-4">
                    <h3 className="text-lg font-medium">Social Links</h3>
                    {Object.entries(formData.socialLinks).map(([platform, value]) => (
                        <CustomInput
                            key={platform}
                            label={platform.charAt(0).toUpperCase() + platform.slice(1)}
                            value={value}
                            onChange={(e) => handleSocialChange(platform, e.target.value)}
                            disabled={!editMode || isSubmitting}
                            icon={<SocialIcon platform={platform} />}
                        />
                    ))}
                </div>

                {editMode && (
                    <div className="flex justify-end space-x-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                                setFormData({
                                    name: userData?.name || '',
                                    username: userData?.username || '',
                                    email: userData?.email || '',
                                    bio: userData?.bio || '',
                                    website: userData?.website || '',
                                    socialLinks: {
                                        github: userData?.socialLinks?.github || '',
                                        linkedin: userData?.socialLinks?.linkedin || '',
                                        twitter: userData?.socialLinks?.twitter || ''
                                    }
                                });
                                setEditMode(false);
                            }}
                            disabled={isSubmitting}
                            className="px-4 py-2"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                'Save Changes'
                            )}
                        </Button>
                    </div>
                )}
            </form>
        </Card>
    );
};

export default ProfileInfoTab;