import React from 'react';
import Footer from '../components/Footer';

const Privacy = () => {
    return (
        <><div className="max-padd-container max-xl:mt-8p-6 sm:p-8 font-sans text-gray-800 max-w-5xl max-xl:mt-8">


            <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg">
                <h1 className="text-1xl sm:text-2xl font-extrabold text-center text-blue-900 mb-2 sm:mb-2">
                    Privacy Policy for RSikder Corporation
                </h1>
                {sections.map((section, index) => (
                    <section key={index} className="mb-6">
                        <h2 className="text-md sm:text-xl font-semibold text-indigo-800 mb-3 sm:mb-4">{section.title}</h2>
                        {Array.isArray(section.content) ? (
                            <ul className="list-disc pl-4 sm:pl-6 space-y-2 text-base sm:text-lg text-gray-700">
                                {section.content.map((item, i) => (
                                    <li key={i} dangerouslySetInnerHTML={{ __html: item }}></li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-base sm:text-lg text-gray-700">{section.content}</p>
                        )}
                    </section>
                ))}
                <footer className="text-center text-gray-600 mt-6 sm:mt-8 p-4 sm:p-6">
                <p className="text-base sm:text-lg font-semibold">RSikder Corporation | Empowering Wholesale Excellence</p>
                <p className="text-sm sm:text-base">
                    This policy aligns with global standards such as GDPR, CCPA, and COPPA. For further details, review our full Terms of Service or contact our legal team.
                </p>
            </footer>
            </div>

            
        </div><Footer /></>
    );
};

const sections = [
    {
        title: "1. Acceptance of Terms",
        content: "By accessing or using RSikder Corporation (www.rsikdercorporation.com), you agree to the terms of this Privacy Policy. Continued use of our website constitutes acceptance of these practices."
    },
    {
        title: "2. Information We Collect",
        content: [
            "<strong>Non-Personal Information:</strong> Automatically tracked data, including IP addresses, browser type, device information, pages visited, and session duration.",
            "<strong>Personal Information:</strong> Voluntarily provided details during account registration, such as name, email, and payment information.",
            "<strong>Business Information:</strong> Data submitted for wholesale account verification, including business license numbers and tax IDs."
        ]
    },
    {
        title: "3. Use of Your Personal Information",
        content: [
            "Process orders, manage accounts, and fulfill contractual obligations.",
            "Communicate about promotions, order updates, or policy changes via email or phone.",
            "Improve website functionality, analyze user behavior, and optimize marketing strategies."
        ]
    },
    {
        title: "4. Sharing of Information",
        content: [
            "<strong>Third-Party Service Providers:</strong> Partners involved in payment processing (e.g., Stripe, PayPal), shipping (e.g., FedEx, DHL), or analytics (e.g., Google Analytics).",
            "<strong>Legal Compliance:</strong> Disclosures required by law, court orders, or mergers/acquisitions.",
            "<strong>No Marketing Sales:</strong> We do not sell or rent personal data to third parties for marketing purposes."
        ]
    },
    {
        title: "5. Use of Cookies",
        content: [
            "<strong>Functional Cookies:</strong> Enhance user experience (e.g., saved login details, cart items).",
            "<strong>Analytical Cookies:</strong> Track engagement metrics to improve site performance.",
            "<strong>User Control:</strong> Adjust cookie settings via your browser preferences, though some features may be limited."
        ]
    },
    {
        title: "6. Third-Party Links",
        content: "Our website may link to external sites (e.g., suppliers, social media). These platforms operate under their privacy policies, and we are not responsible for their practices."
    },
    {
        title: "7. Security Measures",
        content: [
            "<strong>SSL Encryption:</strong> All sensitive transactions (e.g., payments) are secured via SSL/TLS protocols.",
            "<strong>Data Protection:</strong> Firewalls, access controls, and regular audits to prevent unauthorized access or breaches.",
            "<strong>Disclaimer:</strong> While we employ industry-standard measures, no online system is 100% secure."
        ]
    },
    {
        title: "8. Children’s Privacy",
        content: "Our services are not intended for users under 18. Parents/guardians may contact us to request the removal of inadvertently collected minor data."
    },
    {
        title: "9. Reviewing & Updating Information",
        content: [
            "<strong>Account Management:</strong> Log in to your wholesale account to update details.",
            "<strong>Customer Support:</strong> Email <a href='mailto:tabrez@rsikdercorporation.com' class='text-indigo-600 hover:underline'>tabrez@rsikdercorporation.com</a> for assistance with data corrections or deletions."
        ]
    },
    {
        title: "10. Policy Changes & Updates",
        content: "We reserve the right to modify this policy. Significant changes will be notified via email or website banners. Regularly review this page for updates."
    },
    {
        title: "11. Contact Information",
        content: [
            "<strong>Email:</strong> <a href='mailto:tabrez@rsikdercorporation.com' class='text-indigo-600 hover:underline'>tabrez@rsikdercorporation.com</a>",
            "<strong>Phone:</strong> +1 (631) 455-0077",
            "<strong>Address:</strong> RSikder Corporation, 198 Canal Street, Ellenville, NY 12428"
        ]
    }
];

export default Privacy;
