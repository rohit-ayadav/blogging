import { FC } from 'react';
import SignupForm from './SignupForm';
import { Check } from 'lucide-react';

const BrandFeature: FC<{ text: string }> = ({ text }) => (
    <div className="flex items-center space-x-2">
        <Check className="w-5 h-5 text-indigo-600" />
        <span className="text-gray-700">{text}</span>
    </div>
);

const SignupContainer: FC = () => {
    return (
        <div className="min-h-screen grid place-items-center bg-gray-50 p-4">
            <div className="w-full max-w-4xl">
                <div className="grid gap-8 md:grid-cols-[2fr,1fr]">
                    <SignupForm />
                    <div className="hidden md:flex flex-col">
                        {/* Brand section */}
                        <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg p-8 h-full flex flex-col">
                            {/* Logo Section */}
                            <div className="mb-8 text-center">
                                <div className="w-16 h-16 bg-white rounded-full shadow-md flex items-center justify-center mx-auto mb-4">
                                    <img
                                        src="/logo.png"
                                        alt="TheFoodBlogger Logo"
                                        className="w-12 h-auto rounded-full"
                                    />
                                </div>
                                <h3 className="text-2xl font-bold text-indigo-800 mb-2">
                                    Welcome to TheFoodBlogger
                                </h3>
                                <p className="text-indigo-600 text-sm">
                                    Your platform for tech insights
                                </p>
                            </div>

                            {/* Features List */}
                            <div className="space-y-4 mb-8">
                                <BrandFeature text="Write and share technical articles" />
                                <BrandFeature text="Connect with fellow developers" />
                                <BrandFeature text="Build your tech portfolio" />
                                <BrandFeature text="Stay updated with latest trends" />
                            </div>

                            {/* Social Proof */}
                            <div className="mt-auto">
                                <div className="bg-white rounded-lg p-4 shadow-sm">
                                    <div className="flex justify-between mb-2">
                                        <div className="text-sm text-gray-600">Active Writers</div>
                                        <div className="text-sm font-semibold">10K+</div>
                                    </div>
                                    <div className="flex justify-between mb-4">
                                        <div className="text-sm text-gray-600">Articles Published</div>
                                        <div className="text-sm font-semibold">50K+</div>
                                    </div>
                                    <div className="flex -space-x-2">
                                        {[...Array(5)].map((_, i) => (
                                            <div
                                                key={i}
                                                className="w-8 h-8 rounded-full border-2 border-white bg-indigo-100 flex items-center justify-center"
                                            >
                                                <img
                                                    src="/api/placeholder/24/24"
                                                    alt={`User ${i + 1}`}
                                                    className="w-6 h-6 rounded-full"
                                                    onError={(e) => {
                                                        e.currentTarget.onerror = null;
                                                        e.currentTarget.src = '';
                                                        if (e.currentTarget.parentElement) {
                                                            e.currentTarget.parentElement.innerHTML = `<span class="text-indigo-600">${String.fromCharCode(65 + i)}</span>`;
                                                        }
                                                    }}
                                                />
                                            </div>
                                        ))}
                                        <div className="w-8 h-8 rounded-full border-2 border-white bg-indigo-600 flex items-center justify-center text-white text-xs">
                                            +99
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Trust Badge */}
                            <div className="mt-4 text-center">
                                <p className="text-xs text-gray-500">
                                    Trusted by developers worldwide 🌍
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignupContainer;