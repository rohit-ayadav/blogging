// components/signup/FormHeader.tsx
import { FC } from 'react';

const FormHeader: FC = () => (
    <div className="text-center mb-8">
        <h2 className="text-3xl font-extrabold text-gray-900">
            Create your account
        </h2>
        <p className="mt-2 text-sm text-gray-600">
            Join us to get started
        </p>
    </div>
);

export default FormHeader;