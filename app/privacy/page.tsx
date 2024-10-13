import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const PrivacyPolicy = () => {
    const policyData = [
        {
            title: "1. Information We Collect",
            content: "We collect information you provide directly to us, such as when you create an account, submit a form, make a purchase, or communicate with us. This may include your name, email address, postal address, phone number, and payment information. We may also collect information automatically when you use our services, including your IP address, device information, and browsing history."
        },
        {
            title: "2. How We Use Your Information",
            content: "We use the information we collect to provide, maintain, and improve our services, process transactions, send you technical notices and support messages, and respond to your comments and questions. We may also use your information to send you marketing communications, subject to your right to opt-out."
        },
        {
            title: "3. Information Sharing and Disclosure",
            content: "We do not sell your personal information. We may share your information with third-party vendors, consultants, and other service providers who need access to such information to carry out work on our behalf. We may also release information when its release is appropriate to comply with the law, enforce our site policies, or protect ours or others' rights, property, or safety."
        },
        {
            title: "4. Data Retention",
            content: "We retain personal information for as long as necessary to fulfill the purposes for which it was collected, including for the purposes of satisfying any legal, accounting, or reporting requirements, or to resolve disputes."
        },
        {
            title: "5. Your Rights and Choices",
            content: "Depending on your location, you may have certain rights regarding your personal information, such as the right to access, correct, delete, or restrict use of your information. You may also have the right to object to certain processing and, where we have asked for your consent to process your data, to withdraw this consent."
        },
        {
            title: "6. Cookies and Similar Technologies",
            content: "We use cookies and similar tracking technologies to track the activity on our service and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent."
        },
        {
            title: "7. Data Security",
            content: "We implement appropriate technical and organizational measures to protect the security of your personal information. However, please note that no method of transmission over the Internet or method of electronic storage is 100% secure."
        },
        {
            title: "8. Children's Privacy",
            content: "Our service is not directed to children under the age of 13, and we do not knowingly collect personal information from children under 13. If we learn we have collected or received personal information from a child under 13 without verification of parental consent, we will delete that information."
        },
        {
            title: "9. Changes to This Privacy Policy",
            content: "We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the 'Last updated' date at the top of this Privacy Policy."
        },
        {
            title: "10. Contact Us",
            content: "If you have any questions about this Privacy Policy, please contact us at 6392177974."
        }
    ];

    return (
        <div className="container mx-auto px-4 py-8">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">Privacy Policy</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="mb-4">Last updated: 12 October 2024</p>
                    <p className="mb-6">This Privacy Policy describes how Blogging ("we", "our", or "us") collects, uses, and shares your personal information when you use our website or services. Please read this Privacy Policy carefully to understand our practices regarding your personal information.</p>
                    <div className="mb-6">
                        <p className='font-semibold'>This is Ai generated content.</p>
                    </div>
                    <Accordion type="single" collapsible className="w-full">
                        {policyData.map((policy, index) => (
                            <AccordionItem value={`item-${index}`} key={index}>
                                <AccordionTrigger>{policy.title}</AccordionTrigger>
                                <AccordionContent>
                                    <p>{policy.content}</p>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </CardContent>
            </Card>
        </div>
    );
};

export default PrivacyPolicy;