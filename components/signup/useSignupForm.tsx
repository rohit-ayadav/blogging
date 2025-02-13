import checkUsernameAvailability from '@/action/checkUserNameAvailability';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

interface FormData {
    name: string;
    username: string;
    email: string;
    password: string;
    confirmPass: string;
    otp: string;
}

interface PasswordCriteriaType {
    hasLowercase: boolean;
    hasUppercase: boolean;
    hasNumber: boolean;
    hasSpecialChar: boolean;
    hasEightChars: boolean;
}

interface Error {
    title: string;
    message: string;
}

const useSignupForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        email: '',
        password: '',
        confirmPass: '',
        otp: ''
    });
    const [passwordCriteria, setPasswordCriteria] = useState({
        hasLowercase: false,
        hasUppercase: false,
        hasNumber: false,
        hasSpecialChar: false,
        hasEightChars: false
    });
    const [isLoading, setIsLoading] = useState(false);
    const [otpRequested, setOtpRequested] = useState(false);
    const [timer, setTimer] = useState(0);
    const [error, setError] = useState({
        title: '',
        message: ''
    });
    const [isUsernameAvailable, setIsUsernameAvailable] = useState(false);

    const router = useRouter();
    useEffect(() => {
        if (formData.username !== '') {
            checkUsernameAvailability(formData.username).then((isAvailable) => {
                setIsUsernameAvailable(isAvailable);
            }
            );
        }
    }, [formData.username]);

    useEffect(() => {
        setPasswordCriteria({
            hasLowercase: /[a-z]/.test(formData.password),
            hasUppercase: /[A-Z]/.test(formData.password),
            hasNumber: /\d/.test(formData.password),
            hasSpecialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(formData.password),
            hasEightChars: formData.password.length >= 8
        });
    }, [formData.password]);

    const validateForm = (): boolean => {
        if (formData.password !== formData.confirmPass) {
            setError({
                title: 'Error',
                message: 'Passwords do not match'
            });
            setIsLoading(false);
            return false;
        }

        if (!formData.otp) {
            setError({
                title: 'Error',
                message: 'Please enter OTP'
            });
            setIsLoading(false);
            return false;
        }
        if (!formData.name || !formData.username || !formData.email || !formData.password) {
            setError({
                title: 'Error',
                message: 'Please fill in all fields'
            });
            setIsLoading(false);
            return false;
        }

        if (!passwordCriteria.hasLowercase || !passwordCriteria.hasUppercase || !passwordCriteria.hasNumber || !passwordCriteria.hasSpecialChar || !passwordCriteria.hasEightChars) {
            setError({
                title: 'Error',
                message: 'Password must contain at least 8 characters, including an uppercase letter, a lowercase letter, a number, and a special character'
            });
            setIsLoading(false);
            return false;
        }
        if (formData.otp.length !== 6) {
            setError({
                title: 'Error',
                message: 'OTP must be 6 characters long'
            });
            setIsLoading(false);
            return false;
        }

        if (formData.password.length < 8) {
            setError({
                title: 'Error',
                message: 'Password must be at least 8 characters long'
            });
            setIsLoading(false);
            return false;
        }
        return true;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = e.target;
        setFormData((prevFormData) => {
            const updatedFormData = {
                ...prevFormData,
                [name]: value
            };

            if (name === 'confirmPass' && updatedFormData.password !== value) {
                setError({
                    title: 'Error',
                    message: 'Passwords do not match'
                });
            } else {
                setError({
                    title: '',
                    message: ''
                });
            }

            return updatedFormData;
        });
    };

    const handleRequestOTP = async () => {
        setIsLoading(true);
        if (!formData.email || !formData.name) {
            setError({
                title: 'Error',
                message: 'Please fill in all fields'
            });
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch('/api/send-email-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: formData.email, name: formData.name })
            });
            const data = await response.json();
            if (!response.ok) {
                setError({
                    title: 'Error',
                    message: data.message
                });
            } else {
                setOtpRequested(true);
                toast.success('OTP sent successfully to your email');
                setTimer(60);
            }

        } catch (error) {
            setError({
                title: 'Error',
                message: 'Something went wrong. Please try again.'
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendOTP = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/send-email-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: formData.email, name: formData.name })
            });
            const data = await response.json();
            if (!response.ok) {
                setError({
                    title: 'Error',
                    message: data.message
                });
            } else {
                setTimer(60);
                toast.success('OTP resent successfully to your email');
            }
        } catch (error) {
            setError({
                title: 'Error',
                message: 'Something went wrong. Please try again.'
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async () => {
        setIsLoading(true);

        if (!validateForm()) {
            return;
        }

        try {
            const response = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })
            const data = await response.json()
            if (!response.ok) {
                setError({
                    title: `Error ${response.status}`,
                    message: data.message
                });
            } else {
                toast.success('Account created successfully');
                router.push('/login');
            }
        } catch (error) {
            setError({
                title: 'Error',
                message: `${error}`
            });
        }
        setIsLoading(false);
    }

    return {
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
    };
}

export default useSignupForm;
export type { FormData, PasswordCriteriaType, Error };
