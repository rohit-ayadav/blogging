import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const TermsOfService = () => {
    const termsData = [
        {
            title: "1. Acceptance of Terms",
            content: "By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement. Additionally, when using this website's particular services, you shall be subject to any posted guidelines or rules applicable to such services."
        },
        {
            title: "2. Description of Service",
            content: "Our website provides users with access to a rich collection of resources, including various communication tools, forums, shopping services, personalized content, and more. The service may be modified or updated at any time without prior notice."
        },
        {
            title: "3. User Conduct",
            content: "You agree to use our website only for lawful purposes. You are prohibited from posting or transmitting any unlawful, threatening, libelous, defamatory, obscene, scandalous, inflammatory, pornographic, or profane material or any material that could constitute or encourage conduct that would be considered a criminal offense, give rise to civil liability, or otherwise violate any law."
        },
        {
            title: "4. Intellectual Property Rights",
            content: "The content, organization, graphics, design, compilation, magnetic translation, digital conversion, and other matters related to the Site are protected under applicable copyrights, trademarks, and other proprietary rights. The copying, redistribution, use, or publication by you of any such matters or any part of the Site is strictly prohibited."
        },
        {
            title: "5. Disclaimer of Warranties",
            content: "The site is provided on an 'as is' basis without warranties of any kind, either express or implied, including, but not limited to, warranties of title or implied warranties of merchantability or fitness for a particular purpose."
        },
        {
            title: "6. Limitation of Liability",
            content: "In no event shall we be liable for any direct, indirect, incidental, consequential, special, or exemplary damages arising out of or in connection with the site or the content, even if advised of the possibility of such damages."
        },
        {
            title: "7. Indemnification",
            content: "You agree to indemnify, defend and hold us and our partners, attorneys, staff, and affiliates harmless from any liability, loss, claim, and expense, including reasonable attorney's fees, related to your violation of this agreement or use of the site."
        },
        {
            title: "8. Changes to Terms",
            content: "We reserve the right to modify these terms at any time. Please check this page periodically for changes. Your continued use of the site following the posting of changes to these terms will mean you accept those changes."
        },
        // {
        //   title: "9. Governing Law",
        //   content: "This agreement shall be governed by and construed in accordance with the laws of [Your Jurisdiction], without giving effect to any principles of conflicts of law."
        // },
        {
            title: "10. Contact Information",
            content: "If you have any questions about these Terms, please contact us at 6392177974."
        }
    ];

    return (
        <div className="container mx-auto px-4 py-8">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">Terms of Service</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="mb-4">Last updated: 12 October 2024

                    </p>
                    <p className="mb-6">Please read these Terms of Service carefully before using our website. Your access to and use of the service is conditioned on your acceptance of and compliance with these Terms.</p>
                    {/* Notice Ai Generated */}
                    <div className="mb-6">
                        <p className="mb-2">Notice Ai Generated</p>
                        <p className="text-sm text-gray-500">This is an AI-generated version of the Terms of Service.</p>
                    </div>

                    <Accordion type="single" collapsible className="w-full">
                        {termsData.map((term, index) => (
                            <AccordionItem value={`item-${index}`} key={index}>
                                <AccordionTrigger>{term.title}</AccordionTrigger>
                                <AccordionContent>
                                    <p>{term.content}</p>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </CardContent>
            </Card>
        </div>
    );
};

export default TermsOfService;