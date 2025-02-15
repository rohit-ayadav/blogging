import Footer from "./footer/page";
import { Toaster } from 'react-hot-toast';
import NavbarComponent from "../navComponent/navigation/navbar/navbarComponent";
import { Toaster as Toast } from "react-hot-toast";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {


    return (
        <html lang="en">
            <body className="flex flex-col min-h-screen">
                <Toaster position="top-right" reverseOrder={false} />
                <Toast />
                <NavbarComponent />
                <main className="flex-grow">
                    {children}
                </main>
                <Footer />
            </body>
        </html>
    );
}