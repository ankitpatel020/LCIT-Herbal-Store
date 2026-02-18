import React from 'react';

const Terms = () => {
    return (
        <div className="bg-gray-50 min-h-screen py-12">
            <div className="container-custom mx-auto px-4 max-w-4xl">
                <div className="bg-white rounded-xl shadow-sm p-8 md:p-12">
                    <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-6">Terms of Service</h1>
                    <p className="text-gray-500 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

                    <div className="prose prose-green max-w-none text-gray-600">
                        <section className="mb-8">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">1. Introduction</h2>
                            <p className="mb-4">
                                Welcome to LCIT Herbal Store ("we," "our," or "us"). By accessing or using our website and services, you agree to be bound by these Terms of Service. If you do not agree to all the terms and conditions, then you may not access the website or use any services.
                            </p>
                            <p>
                                These services are provided by the Department of Chemistry, LCIT College of Commerce & Science, Bodri, Bilaspur (C.G.).
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">2. Student & Faculty Verification</h2>
                            <p className="mb-4">
                                Certain discounts and offers are exclusive to verified students and faculty of LCIT. You agree to provide accurate and current information during the verification process. Misrepresentation of your status may result in the suspension of your account and revocation of any discounts obtained fraudulently.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">3. Products and Services</h2>
                            <p className="mb-4">
                                All products listed on our store are formulated and prepared by students under faculty supervision. While we strive for quality, these are educational and experimental products.
                            </p>
                            <ul className="list-disc pl-5 mb-4 space-y-2">
                                <li>We do not guarantee that the descriptions, prices, or other content are error-free.</li>
                                <li>We reserve the right to limit the sales of our products to any person, geographic region, or jurisdiction.</li>
                                <li>We reserve the right to discontinue any product at any time.</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">4. Pricing and Payment</h2>
                            <p className="mb-4">
                                Prices for our products are subject to change without notice. We reserve the right at any time to modify or discontinue the Service (or any part or content thereof) without notice at any time.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">5. User Comments and Feedback</h2>
                            <p className="mb-4">
                                If you send us creative ideas, suggestions, proposals, plans, or other materials, you agree that we may, at any time, without restriction, edit, copy, publish, distribute, translate and otherwise use in any medium any comments that you forward to us.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">6. Personal Information</h2>
                            <p className="mb-4">
                                Your submission of personal information through the store is governed by our Privacy Policy.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">7. Governing Law</h2>
                            <p className="mb-4">
                                These Terms of Service and any separate agreements whereby we provide you Services shall be governed by and construed in accordance with the laws of India and the jurisdiction of Bilaspur, Chhattisgarh.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-800 mb-4">8. Contact Information</h2>
                            <p>
                                Questions about the Terms of Service should be sent to us at support@lcitherbal.com or visit our Department of Chemistry at LCIT campus.
                            </p>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Terms;
