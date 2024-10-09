export default function ServicePage() {
    return (
        <>
            <div className="container mx-auto p-4">
                <h1 className="text-4xl font-bold text-center mb-3">Services</h1>
                <p className="text-center">We provide the following services:</p>
                <div className="flex justify-center mt-5">
                    <ul className="list-disc list-inside mt-5">
                        <li>Web Development</li>
                        <li>Mobile Development</li>
                        <li>SEO</li>
                        <li>Digital Marketing</li>
                        <li>Content Writing</li>
                    </ul>
                </div>
            </div>
        </>
    )
}