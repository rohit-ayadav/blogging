const ErrorMessage = ({ message }: { message: string }) => (
    <div className="min-h-[60vh] flex items-center justify-center">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 max-w-[65vh] w-full rounded-lg shadow-md">
            <div className="flex">
                <div>
                    <p className="text-red-700">Error</p>
                    <p className="text-red-700 mt-1">{message}</p>
                </div>
            </div>
        </div>
    </div>
);

export { ErrorMessage };