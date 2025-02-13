// components/auth/SignupForm/PasswordCriteria.tsx
import { FaCheck, FaTimes } from 'react-icons/fa';
import { PasswordCriteriaType } from './useSignupForm';

const PasswordCriteria = ({ criteria }: { criteria: PasswordCriteriaType }) => {
    const allCriteriaMet = Object.values(criteria).every(c => c);
  
    if (allCriteriaMet) {
        return (
            <div className="flex items-center text-sm">
                <FaCheck className="text-green-500" />
                <span className="ml-2">Valid password</span>
            </div>
        );
    }

    return (
        <div className="space-y-1 text-sm">
            {!criteria.hasUppercase && (
                <div className="flex items-center">
                    <FaTimes className="text-red-500" />
                    <span className="ml-2">At least one uppercase letter</span>
                </div>
            )}
            {!criteria.hasLowercase && (
                <div className="flex items-center">
                    <FaTimes className="text-red-500" />
                    <span className="ml-2">At least one lowercase letter</span>
                </div>
            )}
            {!criteria.hasNumber && (
                <div className="flex items-center">
                    <FaTimes className="text-red-500" />
                    <span className="ml-2">At least one number</span>
                </div>
            )}
            {!criteria.hasSpecialChar && (
                <div className="flex items-center">
                    <FaTimes className="text-red-500" />
                    <span className="ml-2">At least one special character</span>
                </div>
            )}
            {!criteria.hasEightChars && (
                <div className="flex items-center">
                    <FaTimes className="text-red-500" />
                    <span className="ml-2">At least 8 characters</span>
                </div>
            )}
        </div>
    );
};

export default PasswordCriteria;