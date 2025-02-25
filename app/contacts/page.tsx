"use client";
import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { sendEmail } from '@/action/email/SendEmail';
import { confirmationToUser, copyToAdmin } from '@/utils/EmailTemplate/contact-email';

const ContactPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    });
    const [submitStatus, setSubmitStatus] = useState<null | 'success' | 'error'>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        toast.promise(sendMessage(formData), {
            loading: 'Sending message...',
            success: 'Message sent!',
            error: 'Failed to send message',
        });
    };
    const sendMessage = async (formData: any) => {
        const response = await fetch('/api/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        });
        await sendEmail({
            to: formData.email,
            subject: `Thank you for contacting us! | TheFoodBlogger`,
            message: confirmationToUser(formData.name, formData.email, Date.now().toString()),
        });
        await sendEmail({
            to: 'rohitkuyada@gmail.com',
            subject: `New Contact Form Submission | TheFoodBlogger`,
            message: copyToAdmin(formData.name, formData.email, Date.now().toString(), formData.subject, formData.message),
        });

        if (response.ok) {
            setSubmitStatus('success');
            setFormData({ name: '', email: '', subject: '', message: '' });
        } else {
            setSubmitStatus('error');
        }
    }
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Contact Us</h1>

            <div className="grid md:grid-cols-2 gap-8">
                <Card>
                    <CardHeader>
                        <h2 className="text-xl font-semibold">Send us a message</h2>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <Input
                                type="text"
                                name="name"
                                placeholder="Your Name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                            <Input
                                type="email"
                                name="email"
                                placeholder="Your Email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                            <Input
                                type="text"
                                name="subject"
                                placeholder="Subject"
                                value={formData.subject}
                                onChange={handleChange}
                                required
                            />
                            <Textarea
                                name="message"
                                placeholder="Your Message"
                                value={formData.message}
                                onChange={handleChange}
                                required
                                rows={4}
                            />
                            <Button type="submit">Send Message</Button>
                        </form>
                        {submitStatus === 'success' && (
                            <Alert className="mt-4">
                                <AlertDescription>
                                    Thank you for your message. We'll get back to you soon!
                                </AlertDescription>
                            </Alert>
                        )}
                    </CardContent>
                </Card>

                <div className="space-y-8">
                    <Card>
                        <CardHeader>
                            <h2 className="text-xl font-semibold">Contact Information</h2>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center">
                                <Mail className="mr-2" /> <span>rohitkuyada@gmail.com</span>
                            </div>
                            <div className="flex items-center">
                                <Phone className="mr-2" /> <span>+91 (639) 217-7974</span>
                            </div>
                            <div className="flex items-center">
                                <MapPin className="mr-2" /> <span>123 Dog Street, Chinhat, Lucknow 226028</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <h2 className="text-xl font-semibold">Follow Us</h2>
                        </CardHeader>
                        <CardContent className="flex space-x-4">
                            <a href="https://whatsapp.com/channel/0029VaVd6px8KMqnZk7qGJ2t" className="text-blue-500 hover:text-blue-600">
                                <Facebook size={24} />
                            </a>
                            <a href="https://whatsapp.com/channel/0029VaVd6px8KMqnZk7qGJ2t" className="text-blue-400 hover:text-blue-500">
                                <Twitter size={24} />
                            </a>
                            <a href="https://www.linkedin.com/company/102726275" className="text-pink-500 hover:text-pink-600">
                                <Instagram size={24} />
                            </a>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
export default ContactPage;