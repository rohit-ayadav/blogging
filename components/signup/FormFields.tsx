// components/signup/FormFields.tsx
import { FC } from 'react';
import PasswordInput from './PasswordInput';
import PasswordCriteria from './PasswordCriteria';
import { FormData, PasswordCriteriaType } from './useSignupForm';

interface FormFieldsProps {
    formData: FormData
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    passwordCriteria: PasswordCriteriaType;
    usernameAvailable: boolean;
}

const FormFields: FC<FormFieldsProps> = ({
    formData,
    handleChange,
    passwordCriteria,
    usernameAvailable
}) => {
    return (
        <div className="grid gap-4">
            <div className="grid md:grid-cols-2 gap-4">
                <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={handleChange}
                    className="input-field"
                    required
                    autoComplete="name"
                />
                <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={formData.username}
                    onChange={handleChange}
                    className="input-field"
                    required
                    autoComplete="username"
                />
            </div>
            {formData.username && usernameAvailable && (
                <p className="text-sm text-green-500">Username is available</p>
            )}
            {formData.username && !usernameAvailable && (
                <p className="text-sm text-red-500">Username is not available</p>
            )}


            <input
                type="email"
                name="email"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
                className="input-field"
                required
                autoComplete="email"
            />
            <PasswordInput
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                showPassword={false}
                togglePassword={() => { }}
            />
            {formData.password && (
                <PasswordCriteria criteria={passwordCriteria} />
            )}
            <PasswordInput
                name='confirmPass'
                placeholder='Confirm Password'
                value={formData.confirmPass}
                onChange={handleChange}
                showPassword={false}
                togglePassword={() => { }}
            />
            {formData.password !== formData.confirmPass && formData.confirmPass && (
                <p className="text-sm text-red-500">Passwords do not match</p>
            )}
        </div>
    );
};

export default FormFields;