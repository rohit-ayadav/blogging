import React from 'react';

interface TableWrapperProps {
    children: string;
}

export const TableWrapper: React.FC<TableWrapperProps> = ({ children }) => {
    return (

        <div className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <div className="overflow-x-auto">
                <table className="min-w-full">
                    {children}
                </table>
            </div>
        </div>
    );
}