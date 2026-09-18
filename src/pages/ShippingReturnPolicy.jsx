import React from 'react';
import Footer from '../components/Footer';

const ShippingReturnPolicy = () => {
    return (
        <><div className="max-padd-container max-xl:mt-8 p-6 sm:p-8 font-sans text-gray-800 max-w-5xl max-xl:mt-8">
            <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg">
                <h1 className="text-xl sm:text-2xl font-extrabold text-center text-blue-900 mb-6 sm:mb-8">
                    RSikder Corporation Shipping & Return Policy
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
              
              <p className="text-sm sm:text-base">
              This policy aligns with the Terms and Conditions of RSikder Corporation, ensuring
              consistency in legal, operational, and compliance standards.
              </p>
          </footer>
            </div>
           
        </div><Footer /></>
    );
};

const sections = [
    {
        title: "1. Shipping Policy",
        content: [
            "<strong>1.1 Order Processing & Fulfillment:</strong> Orders are processed within <strong><em>3–5 business days</em></strong>, subject to stock availability. Orders placed after <strong><em>12:00 PM EST</em></strong> may incur a minimum one-business-day delay.",
            "<strong>Expedited Shipping:</strong> Available upon request at additional cost. Delivery timelines are estimates; Seller disclaims liability for carrier delays.",
            "<strong>1.2 Shipping Terms:</strong> <strong><em>FOB Origin</em></strong>: All shipments are <strong><em>Freight on Board (FOB) Origin</em></strong> from our warehouse. Title and risk of loss transfer to the Buyer upon carrier pickup.",
            "<strong>Carrier Liability:</strong> Seller is not responsible for delays, damages, or losses incurred during transit.",
            "<strong>1.3 Local Pickup:</strong> Location: 198 Canal Street, Ellenville, NY 12428. Hours: Monday–Friday, 8:00 AM – 5:00 PM EST (excluding holidays).",
            "<strong>Storage Fees:</strong> Unclaimed orders after <strong><em>7 days</em></strong> incur a <strong><em>$25/day storage fee</em></strong>.",
            "<strong>1.4 Free Freight Terms:</strong> Threshold: Free standard shipping applies to orders over <strong><em>$200</em></strong>. Exclusions: Oversized items, COD orders, and custom products are excluded."
        ]
    },
    {
        title: "2. Return & Cancellation Policy",
        content: [
            "<strong>2.1 Returns & Discrepancies:</strong> Reporting Window: Shortages/damages must be reported within <strong><em>72 hours</em></strong> of delivery. General returns are accepted within <strong><em>14 days</em></strong> of receipt.",
            "<strong>Non-Returnable Items:</strong> Decorated, altered, soiled, or final-sale merchandise. Items with removed tags or discontinued styles.",
            "<strong>2.2 Return Authorization:</strong> RMA Required: A Return Merchandise Authorization (RMA) number must be obtained from the Seller. Unauthorized returns will be refused.",
            "<strong>Restocking Fee:</strong> A <strong><em>15% restocking fee</em></strong> applies (excludes defective items).",
            "<strong>2.3 Defective Merchandise:</strong> Claims: Defects must be reported within <strong><em>7 days</em></strong> of receipt. Visible markings (e.g., tape) are required to identify flaws.",
            "<strong>Resolution:</strong> Seller will issue a refund or replacement at its discretion. Return shipping costs are covered <strong><em>only if the error is Seller’s fault</em></strong>.",
            "<strong>2.4 Refund Processing:</strong> <strong>Timeline:</strong> Credits are issued within <strong><em>14 business days</em></strong> of receipt. Include a copy of the original invoice with returns."
        ]
    },
    {
        title: "3. Legal & Liability",
        content: [
            "<strong>3.1 Warranty Disclaimer:</strong> Goods are warranted to be defect-free at delivery. Claims beyond <strong><em>7 days</em></strong> of receipt are void.",
            "<strong>3.2 Limitation of Liability:</strong> Seller’s liability is capped at the purchase price of the affected goods. Indirect damages (e.g., lost profits) are excluded.",
            "<strong>3.3 Governing Law:</strong> Disputes are governed by <strong><em>New York law</em></strong> and resolved in courts located in <strong><em>New York County</em></strong>."
        ]
    },
    {
        title: "4. Policy Updates",
        content: "Revisions are communicated via email or portal notification. The latest version is available at https://www.rsikdercorporation.com/terms"
    },
    
    {
        title: "Contact Information",
        content: [
            "<strong>Email:</strong> <a href='mailto:tabrez@rsikdercorporation.com' class='text-indigo-600 hover:underline'>tabrez@rsikdercorporation.com</a>",
            "<strong>Phone:</strong> +1 (631) 455-0077",
            "<strong>Address:</strong> RSikder Corporation, 198 Canal Street, Ellenville, NY 12428"
        ]
    }
];

export default ShippingReturnPolicy;
