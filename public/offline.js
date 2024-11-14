export default function Offline() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h1 className="text-2xl font-bold mb-4">You're Offline</h1>
            <p>Please check your internet connection and try again.</p>
            <p className="mt-4">If you're seeing this page even when you're online, please contact the site owner.</p>
        </div>
    );
}