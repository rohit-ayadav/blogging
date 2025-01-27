// components/signup/OTPSection.tsx
import { FC, useEffect } from 'react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { FormData } from './useSignupForm';


interface OTPSectionProps {
    formData: FormData;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleResendOTP: () => void;
    handleSubmit: () => void;
    isLoading: boolean;
    timer: number;
    setTimer: React.Dispatch<React.SetStateAction<number>>;
}

const OTPSection: FC<OTPSectionProps> = ({
    formData,
    handleChange,
    handleResendOTP,
    handleSubmit,
    isLoading,
    timer,
    setTimer

}) => {
    useEffect(() => {
        if (timer > 0) {
            const interval = setInterval(() => {
                setTimer((prevTimer) => prevTimer - 1);
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [timer, setTimer]);

    return (
        <div className="grid gap-4">
            <div className="relative">
                <input
                    type="text"
                    name="otp"
                    placeholder="Enter OTP"
                    value={formData.otp}
                    onChange={handleChange}
                    className="input-field"
                    required
                />
                <div className="mt-2 flex items-center justify-between">
                    <button
                        onClick={handleResendOTP}
                        disabled={timer > 0}
                        className={`text-sm ${timer > 0 ? 'text-gray-400' : 'text-indigo-600 hover:text-indigo-500'}`}
                    >
                        Resend OTP {timer > 0 && `(${timer}s)`}
                    </button>
                    {timer > 0 && (
                        <Badge variant="secondary" className="animate-pulse">
                            Wait {timer}s
                        </Badge>
                    )}
                </div>
            </div>
            <Button
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full"
            >
                {isLoading ? 'Creating Account...' : 'Create Account'}
            </Button>
        </div>
    );
};

export default OTPSection;