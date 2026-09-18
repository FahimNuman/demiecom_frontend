import React from 'react';
import Footer from '../components/Footer';

const TermsConditions = () => {
    return (
        <><div className="max-padd-container max-xl:mt-8 p-6 sm:p-8 font-sans text-gray-800 max-w-5xl max-xl:mt-8">
            <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg">
                <h1 className="text-1xl sm:text-2xl font-extrabold text-center text-blue-900 mb-2 sm:mb-2">
                    TERMS AND CONDITIONS
                </h1>
                <h2 className="text-center text-lg sm:text-xl font-semibold text-indigo-800 mb-4">
                    RSikder Corporation
                </h2>
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
              <footer className="bg-gray-100 text-center text-gray-700 mt-8 py-6 px-4 sm:px-8 border-t border-gray-300">
  <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">RSikder Corporation</h2>
  <p className="text-sm sm:text-base font-medium">
    Empowering Wholesale Excellence
  </p>
  <div className="mt-3 text-sm sm:text-base text-gray-600 leading-relaxed">
    <p>● Retain a signed copy for your records.</p>
    <p>● Updates to these Terms will be communicated via email or portal notification.</p>
    <p>
      ● For full terms, refer to{" "}
      <a
        href="https://www.rsikdercorporation.com/terms"
        className="text-blue-600 hover:underline"
        target="_blank"
        rel="noopener noreferrer"
      >
        www.rsikdercorporation.com/terms
      </a>.
    </p>
    <p className="mt-3 italic text-gray-500">
      This document synthesizes industry standards from wholesale apparel distributors and legal templates.
    </p>
  </div>
</footer>

            </div>
        </div><Footer /></>
    );
};

const sections = [
    { title: "1. Acceptance of Terms", content: "All purchases from RSikder Corporation (“Seller”) are governed exclusively by these Terms and Conditions (“Terms”). Any conflicting terms proposed by the Buyer, including those in purchase orders or other documents, are expressly rejected and void unless explicitly agreed to in writing by the Seller. By placing an order, Buyer acknowledges acceptance of these Terms." },
    { title: "2. Ordering", content: [
        "<strong>Registration:</strong> Buyers must register an account via Seller’s online portal to place orders. Approved accounts are subject to credit verification.",
        "<strong>Order Processing:</strong> Orders are processed within 3–5 business days, contingent on stock availability. The seller reserves the right to cancel or delay orders due to unavailability without liability for resulting losses.",
        "<strong>Shipping & Handling:</strong> Orders placed after 12:00 PM EST may be delayed by at least one business day. Shipping costs are calculated based on weight, destination, and carrier rates."
    ] },
    { title: "3. Payment Terms", content: [
        "<strong>Methods:</strong> Accepted payments include credit cards (Visa, Mastercard, Amex), wire transfers, and COD. Net 30 terms are available for approved accounts.",
        "<strong>Late Payments:</strong> A finance charge of 1.5% per month (18% annually) applies to overdue balances. Returned checks incur a $50 fee plus bank charges.",
        "<strong>Tax Exemptions:</strong> Buyers must provide valid tax-exempt documentation before order fulfillment."
    ] },
    { title: "4. Shipping & Delivery", content: [
        "<strong>FOB Terms:</strong> All shipments are FOB Origin (Seller’s warehouse). Title and risk of loss transfer to the Buyer upon delivery to the carrier.",
        "<strong>Expedited Shipping:</strong> Available at an additional cost; delivery timelines are estimates, and Seller disclaims liability for delays caused by carriers or unforeseen events.",
        "<strong>Order Pick-Up:</strong> Buyers may collect orders at Seller’s facility within 7 days of notification. Unclaimed orders incur a $25/day storage fee."
    ] },
    { title: "5. Pricing", content: "Prices are subject to change without notice. Discounts or promotions apply only to in-stock items and may be revoked for abuse. Price adjustments due to typographical errors or supplier cost changes are permitted." },
    { title: "6. Returns & Cancellations", content: [
        "<strong>Authorization Required:</strong> Returns require a Return Merchandise Authorization (RMA) number issued by the Seller. Unauthorized returns are refused.",
        "<strong>Time Limits:</strong> Returns are accepted within 14 days of delivery. Decorated, altered, or soiled merchandise is non-returnable.",
        "<strong>Restocking Fee:</strong> A 15% fee applies to all returns, excluding defective items."
    ] },
    { title: "7. Export Shipments", content: "Buyer assumes full responsibility for compliance with export laws, customs duties, and import regulations. Seller disclaims liability for fines or delays arising from non-compliance." },
    { title: "8. Product Safety & Compliance", content: "Goods comply with CPSIA and other applicable safety standards. The buyer is responsible for obtaining certifications (e.g., flammability testing) required for resale in specific jurisdictions." },
    { title: "9. Warranty Disclaimer", content: "Goods are warranted to be free from defects at the time of delivery. Claims must be submitted within 7 days of receipt. Seller’s sole obligation is limited to refund or replacement at its discretion." },
    { title: "10. Limitation of Liability", content: "Seller is not liable for indirect, incidental, or consequential damages (e.g., lost profits). Liability is capped at the purchase price of the affected goods." },
    { title: "11. General Legal Provisions", content: [
        "<strong>Governing Law:</strong> These Terms are governed by New York law. Disputes shall be resolved in courts located in New York County.",
        "<strong>Independent Contractor:</strong> Buyer and Seller are independent entities; no agency or partnership is created.",
        "<strong>Severability:</strong> If any clause is deemed unenforceable, the remainder of the Terms remain valid.",
        "<strong>Waiver:</strong> Failure to enforce a provision does not constitute a waiver of rights."
    ] },
    { title: "RSikder Corporation Contact Information", content: [
        "<strong>Address:</strong> 198 Canal Street, Ellenville, NY 12428",
        "<strong>Phone:</strong> +1 (631) 455-0077",
        "<strong>Email:</strong> <a href='mailto:tabrez@rsikdercorporation.com' class='text-indigo-600 hover:underline'>tabrez@rsikdercorporation.com</a>"
    ] }
];

export default TermsConditions;
