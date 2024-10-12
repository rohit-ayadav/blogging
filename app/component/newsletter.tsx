import React from "react";
import { Alert, AlertDescription, AlertTitle } from "../../components/ui/alert";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import toast from "react-hot-toast";

const NewsLetter = () => {
    const [email, setEmail] = React.useState('');
    const validateEmail = (email: string) => {
        const re = /\S+@\S+\.\S+/;
        return re.test(email);
    };
    const handleSubscribe = (event: React.FormEvent) => {
        event.preventDefault();
        try {
            toast.promise(callApi(), {
                loading: 'Subscribing...',
                success: 'Subscribed successfully!',
                error: throwError => `${throwError.message}`,
            });
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    const callApi = async () => {
        if (!validateEmail(email)) {
            throw new Error('Invalid email');
        }
        const response = await fetch('/api/subscribe', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Something went wrong');
        }
        return data;
    };

    return (
        <>
            <Alert className="mb-8">
                <AlertTitle>Stay updated!</AlertTitle>
                <AlertDescription>
                    <div className="mt-2 flex space-x-2">
                        <Input
                            type="email"
                            placeholder="Enter your email"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <Button onClick={handleSubscribe}>Subscribe</Button>
                    </div>
                </AlertDescription>
            </Alert>
        </>
    );
};

export default NewsLetter;
