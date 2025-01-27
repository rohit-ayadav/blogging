// components/signup/SignupContainer.tsx
import { FC } from 'react';
import SignupForm from './SignupForm';

const SignupContainer: FC = () => {
    return (
        <div className="min-h-screen grid place-items-center bg-gray-50 p-4">
            <div className="w-full max-w-4xl">
                <div className="grid gap-8 md:grid-cols-[2fr,1fr]">
                    <SignupForm />
                    <div className="hidden md:block">
                        {/* Brand section / illustration can go here */}
                        <div className="bg-indigo-100 rounded-lg p-6 h-full flex items-center justify-center">
                            <h3 className="text-2xl font-bold text-indigo-800 text-center">
                                Welcome to Our DevBlogger
                            </h3>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignupContainer;