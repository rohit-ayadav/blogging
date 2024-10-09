export default function ContactPage() {
    return (
        <>
            <div className="container mx-auto p-4">
                <h1 className="text-4xl font-bold text-center mb-3">Contact Us</h1>
                <p className="text-center">You can contact us through the following means:</p>
                <div className="flex justify-center mt-5">
                    <ul className="list-disc list-inside mt-5">
                        <button className="bg-white text-emerald-800 px-4 py-2 rounded-md">
                            Email Us
                        </button>
                        <button className="bg-white text-emerald-800 px-4 py-2 rounded-md ml-3">
                            Call Us
                        </button>
                        <button className="bg-white text-emerald-800 px-4 py-2 rounded-md ml-3">
                            Visit Us
                        </button>

                    </ul>
                </div>
            </div>
        </>
    )
};