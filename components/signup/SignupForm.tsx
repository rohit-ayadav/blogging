// components/signup/SignupForm.tsx
// 'use client';
import { FC } from 'react';
import FormHeader from './FormHeader';
import FormFields from './FormFields';
import OTPSection from './OTPSection';
import SocialLogin from './SocialLogin';
import useSignupForm from './useSignupForm';
import { Button } from '../ui/button';
import { Alert, AlertTitle, AlertDescription } from '../ui/alert';
import { Toaster } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import Link from 'next/link';


const SignupForm: FC = () => {
    const {
        formData,
        passwordCriteria,
        isLoading,
        otpRequested,
        timer,
        setTimer,
        error,
        handleChange,
        handleRequestOTP,
        handleResendOTP,
        handleSubmit,
        isUsernameAvailable
    } = useSignupForm();
    const router = useRouter();

    return (
        <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
            <FormHeader />
            <Toaster position="top-right" reverseOrder={false} />
            {error && error.message && (
                <Alert variant="destructive" className="animate-shake mb-6">
                    {error.title && <AlertTitle>{error.title}</AlertTitle>}
                    <AlertDescription>{error.message}</AlertDescription>
                </Alert>
            )}

            <div className="grid gap-6">
                <FormFields
                    formData={formData}
                    handleChange={handleChange}
                    passwordCriteria={passwordCriteria}
                    usernameAvailable={isUsernameAvailable}
                />
                {otpRequested ? (
                    <OTPSection
                        formData={formData}
                        handleChange={handleChange}
                        handleResendOTP={handleResendOTP}
                        handleSubmit={handleSubmit}
                        isLoading={isLoading}
                        timer={timer}
                        setTimer={setTimer}
                    />
                ) : (
                    <div className="grid gap-4">
                        <p className="text-sm text-gray-500">
                            We'll send an OTP to your email to verify your account
                        </p>
                        <Button
                            onClick={handleRequestOTP}
                            disabled={isLoading || !formData.email}
                            className="w-full"
                        >
                            {isLoading ? 'Processing...' : 'Request OTP'}
                        </Button>
                    </div>
                )}
                <SocialLogin isLoading={isLoading} />
                <div className="text-center">
                    <Link href="/login">
                        <Button
                            type="button"
                            variant="link"
                        >
                            Don't have an account? Login
                        </Button>
                    </Link>
                </div>
            </div>
        </div>

    );
};

export default SignupForm;