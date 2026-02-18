import React from 'react';

const PrivacyPolicy = () => {
    return (
        <div className="bg-gray-50 min-h-screen py-12">
            <div className="container-custom mx-auto px-4 max-w-4xl">
                <div className="bg-white rounded-xl shadow-sm p-8 md:p-12">
                    <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-6">Privacy Policy</h1>
                    <p className="text-gray-500 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

                    <div className="prose prose-green max-w-none text-gray-600">
                        <section className="mb-8">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">1. What Information We Collect</h2>
                            <p className="mb-4">
                                When you purchase something from our store, as part of the buying and selling process, we collect the personal information you give us such as your name, address, and email address.
                            </p>
                            <p className="mb-4">
                                <strong>Student/Faculty Verification:</strong> To provide exclusive discounts, we collect student IDs, department details, and enrollment years. This data is used solely for verification purposes.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">2. How We Use Your Information</h2>
                            <ul className="list-disc pl-5 mb-4 space-y-2">
                                <li>To process and fulfill your orders.</li>
                                <li>To verify your eligibility for student/faculty discounts.</li>
                                <li>To communicate with you regarding your order or account.</li>
                                <li>To improve our store offerings and user experience.</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">3. Discord and Consent</h2>
                            <p className="mb-4">
                                How do you get my consent? When you provide us with personal information to complete a transaction, verify your credit card, place an order, arrange for a delivery or return a purchase, we imply that you consent to our collecting it and using it for that specific reason only.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">4. Disclosure</h2>
                            <p className="mb-4">
                                We may disclose your personal information if we are required by law to do so or if you violate our Terms of Service. We do not sell your personal information to third parties.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">5. Security</h2>
                            <p className="mb-4">
                                To protect your personal information, we take reasonable precautions and follow industry best practices to make sure it is not inappropriately lost, misused, accessed, disclosed, altered or destroyed.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">6. Cookies</h2>
                            <p className="mb-4">
                                We use cookies to maintain your session (such as keeping you logged in) and to store information about your cart contents.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">7. Changes to This Privacy Policy</h2>
                            <p className="mb-4">
                                We reserve the right to modify this privacy policy at any time, so please review it frequently. Changes and clarifications will take effect immediately upon their posting on the website.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-800 mb-4">8. Questions and Contact Information</h2>
                            <p>
                                If you would like to: access, correct, amend or delete any personal information we have about you, register a complaint, or simply want more information contact our Privacy Compliance Officer at privacy@lcitherbal.com.
                            </p>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
